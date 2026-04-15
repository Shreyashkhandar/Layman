import { create } from 'zustand';
import { ChatMessage } from '../types';
import { askLayman, generateQuestionSuggestions } from '../services/ai';

interface ChatState {
  messages: ChatMessage[];
  suggestions: string[];
  isTyping: boolean;
  articleContext: { title: string; content: string } | null;

  initChat: (articleTitle: string, articleContent: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  suggestions: [],
  isTyping: false,
  articleContext: null,

  initChat: async (articleTitle: string, articleContent: string) => {
    const botGreeting: ChatMessage = {
      id: 'greeting',
      role: 'bot',
      content: "Hi, I'm Layman! What can I answer for you?",
      timestamp: Date.now(),
    };

    set({
      messages: [botGreeting],
      articleContext: { title: articleTitle, content: articleContent },
      isTyping: false,
    });

    // Generate suggestions
    try {
      const suggestions = await generateQuestionSuggestions(articleTitle, articleContent);
      set({ suggestions });
    } catch {
      set({
        suggestions: [
          'What does this mean for me?',
          'Why is this important?',
          'What happens next?',
        ],
      });
    }
  },

  sendMessage: async (text: string) => {
    const { articleContext, messages } = get();
    if (!articleContext) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    set({
      messages: [...messages, userMessage],
      isTyping: true,
      suggestions: [], // Clear suggestions after first question
    });

    try {
      const response = await askLayman(articleContext, text);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, botMessage],
        isTyping: false,
      }));
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Sorry, I couldn't process that. Try asking again!",
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
        isTyping: false,
      }));
    }
  },

  clearChat: () => {
    set({
      messages: [],
      suggestions: [],
      isTyping: false,
      articleContext: null,
    });
  },
}));
