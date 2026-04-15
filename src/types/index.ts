// ─── Article Types ────────────────────────────────────────────

export interface Article {
  id: string;
  title: string;
  simplifiedTitle: string;
  description: string;
  content: string;
  imageUrl: string | null;
  sourceUrl: string;
  publishedAt: string;
  source: string;
  category: string;
  simplifiedCards?: SimplifiedCard[];
}

export interface SimplifiedCard {
  partNumber: number;
  text: string;
}

// ─── Chat Types ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

// ─── User Types ──────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
}

// ─── Saved Article (Supabase row) ────────────────────────────

export interface SavedArticleRow {
  id: string;
  user_id: string;
  article_id: string;
  title: string;
  image_url: string | null;
  source_url: string;
  saved_at: string;
}

// ─── News API Response ───────────────────────────────────────

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  results: NewsApiArticle[];
  nextPage?: string;
}

export interface NewsApiArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_id: string;
  source_name?: string;
  category: string[];
}
