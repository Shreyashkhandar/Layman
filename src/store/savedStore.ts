import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, SavedArticleRow } from '../types';
import { saveArticle, unsaveArticle, getSavedArticles, isSupabaseConfigured } from '../services/supabase';

const STORAGE_KEY = '@layman_saved_articles';

interface SavedState {
  savedArticles: SavedArticleRow[];
  savedIds: Set<string>;
  isLoading: boolean;

  loadSaved: (userId: string) => Promise<void>;
  toggleSave: (article: Article, userId: string) => Promise<void>;
  isSaved: (articleId: string) => boolean;
}

async function persistLocal(articles: SavedArticleRow[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {}
}

async function loadLocal(): Promise<SavedArticleRow[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedArticles: [],
  savedIds: new Set(),
  isLoading: false,

  loadSaved: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Try Supabase first, fallback to local
      let saved: SavedArticleRow[] = [];
      if (isSupabaseConfigured()) {
        saved = await getSavedArticles(userId);
      }
      if (saved.length === 0) {
        saved = await loadLocal();
      }
      const ids = new Set(saved.map((s) => s.article_id));
      set({ savedArticles: saved, savedIds: ids, isLoading: false });
    } catch {
      // Fallback to local
      const saved = await loadLocal();
      const ids = new Set(saved.map((s) => s.article_id));
      set({ savedArticles: saved, savedIds: ids, isLoading: false });
    }
  },

  toggleSave: async (article: Article, userId: string) => {
    const { savedIds } = get();
    const currentlySaved = savedIds.has(article.id);

    if (currentlySaved) {
      set((state) => {
        const newIds = new Set(state.savedIds);
        newIds.delete(article.id);
        const updated = state.savedArticles.filter((s) => s.article_id !== article.id);
        persistLocal(updated);
        return { savedIds: newIds, savedArticles: updated };
      });
    } else {
      const newRow: SavedArticleRow = {
        id: Date.now().toString(),
        user_id: userId,
        article_id: article.id,
        title: article.simplifiedTitle || article.title,
        image_url: article.imageUrl,
        source_url: article.sourceUrl,
        saved_at: new Date().toISOString(),
      };
      set((state) => {
        const newIds = new Set(state.savedIds);
        newIds.add(article.id);
        const updated = [newRow, ...state.savedArticles];
        persistLocal(updated);
        return { savedIds: newIds, savedArticles: updated };
      });
    }

    // Also sync to Supabase in background
    try {
      if (currentlySaved) {
        await unsaveArticle(article.id, userId);
      } else {
        await saveArticle(article, userId);
      }
    } catch {}
  },

  isSaved: (articleId: string) => {
    return get().savedIds.has(articleId);
  },
}));
