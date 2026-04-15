import { GoogleGenerativeAI } from '@google/generative-ai';
import { Config } from '../constants/config';
import { SimplifiedCard } from '../types';

let genAI: GoogleGenerativeAI | null = null;

function isGeminiReady(): boolean {
  try {
    const k = Config.gemini.key;
    return !!(k && k !== 'your_gemini_api_key_here' && k.length > 10);
  } catch { return false; }
}

function isGroqReady(): boolean {
  try {
    const k = Config.groq.key;
    return !!(k && k !== 'your_groq_api_key_here' && k.length > 10);
  } catch { return false; }
}

function getGeminiModel() {
  if (!genAI) genAI = new GoogleGenerativeAI(Config.gemini.key);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

async function callGemini(system: string, user: string): Promise<string> {
  const model = getGeminiModel();
  const result = await withTimeout(model.generateContent(`${system}\n\n${user}`), 8000);
  return result.response.text().trim();
}

async function callGroq(system: string, user: string): Promise<string> {
  const res = await withTimeout(
    fetch(`${Config.groq.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Config.groq.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 0.3, max_tokens: 150, top_p: 0.9,
      }),
    }), 10000
  );
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function aiCall(system: string, user: string): Promise<string> {
  if (isGeminiReady()) {
    try { return await callGemini(system, user); } catch { /* fall */ }
  }
  if (isGroqReady()) {
    try { return await callGroq(system, user); } catch { /* fall */ }
  }
  throw new Error('NO_AI');
}

async function factualCall(system: string, user: string): Promise<string> {
  if (isGroqReady()) {
    try { return await callGroq(system, user); } catch { /* fall */ }
  }
  if (isGeminiReady()) {
    try { return await callGemini(system, user); } catch { /* fall */ }
  }
  throw new Error('NO_AI');
}

function safeParseJsonArray(text: string): any[] | null {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    }
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ─── Simplify Headline ──────────────────────────────────────

export async function simplifyHeadline(originalTitle: string): Promise<string> {
  if (!originalTitle) return 'Breaking News';
  if (!isGeminiReady() && !isGroqReady()) {
    return originalTitle.length > 52 ? originalTitle.substring(0, 49) + '...' : originalTitle;
  }
  try {
    const text = await aiCall(
      `Rewrite news headlines simply. Max 48-52 chars, casual tone, no jargon. Return ONLY the headline.`,
      `Rewrite: "${originalTitle}"`
    );
    return text.replace(/^["']|["']$/g, '') || originalTitle;
  } catch {
    return originalTitle.length > 52 ? originalTitle.substring(0, 49) + '...' : originalTitle;
  }
}

// ─── Simplify Content ───────────────────────────────────────

export async function simplifyContent(originalContent: string, headline: string): Promise<SimplifiedCard[]> {
  if (!isGeminiReady() && !isGroqReady()) return getPlaceholderCards(headline);
  if (!originalContent && !headline) return getPlaceholderCards('News Update');

  try {
    const result = await aiCall(
      `You are Layman. Create exactly 3 summary cards. Each: 2 sentences, 28-35 words, simple language. Card 1: What happened. Card 2: Why it matters. Card 3: What's next. Return ONLY JSON: [{"partNumber":1,"text":"..."},{"partNumber":2,"text":"..."},{"partNumber":3,"text":"..."}]`,
      `Headline: "${headline || 'News'}"\nContent: "${(originalContent || '').substring(0, 2000)}"`
    );
    const parsed = safeParseJsonArray(result);
    if (parsed && parsed.length >= 3 && parsed[0].text) {
      return parsed.map((c: any, i: number) => ({ partNumber: c.partNumber || i + 1, text: String(c.text || '') }));
    }
    return getPlaceholderCards(headline);
  } catch {
    return getPlaceholderCards(headline);
  }
}

// ─── Ask Layman ─────────────────────────────────────────────

export async function askLayman(
  articleContext: { title: string; content: string },
  question: string
): Promise<string> {
  if (!isGeminiReady() && !isGroqReady()) {
    return "Answer: AI is not configured. Add a Gemini or Groq API key to .env.";
  }
  try {
    const system = `You are a factual Q&A assistant named Layman. Rules: direct answers, under 2 sentences, no guessing, say "Not available." if unknown. Article: "${(articleContext.title || '').substring(0, 200)}" Content: "${(articleContext.content || '').substring(0, 1000)}"`;
    const raw = await factualCall(system, question);
    return raw.startsWith('Answer:') ? raw : `Answer: ${raw}`;
  } catch {
    return "Answer: Could not process your question right now. Please try again.";
  }
}

// ─── Suggestions ────────────────────────────────────────────

export async function generateQuestionSuggestions(articleTitle: string, articleContent: string): Promise<string[]> {
  if (!isGeminiReady() && !isGroqReady()) return getDefaultSuggestions();
  try {
    const result = await factualCall(
      `Generate 3 short factual questions a reader would ask. Under 35 chars each. Return ONLY a JSON array of 3 strings.`,
      `Title: "${(articleTitle || '').substring(0, 200)}"\nContent: "${(articleContent || '').substring(0, 1000)}"`
    );
    const parsed = safeParseJsonArray(result);
    if (parsed && parsed.length >= 3 && typeof parsed[0] === 'string') return parsed.slice(0, 3);
    return getDefaultSuggestions();
  } catch {
    return getDefaultSuggestions();
  }
}

// ─── Helpers ────────────────────────────────────────────────

function getDefaultSuggestions(): string[] {
  return ['Who is involved?', 'What are the numbers?', 'When did this happen?'];
}

function getPlaceholderCards(headline: string): SimplifiedCard[] {
  const t = (headline || 'This story').length > 60 ? (headline || '').substring(0, 57) + '...' : (headline || 'This story');
  return [
    { partNumber: 1, text: `Here's what happened: ${t}. This is a developing story we're tracking for you.` },
    { partNumber: 2, text: "This matters because it could change how companies and everyday people think about this topic going forward." },
    { partNumber: 3, text: "Looking ahead, experts will be watching how this story develops over the coming weeks and months." },
  ];
}
