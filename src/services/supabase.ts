import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Config } from '../constants/config';
import { Article, SavedArticleRow } from '../types';

let supabase: SupabaseClient | null = null;
let configValid: boolean | null = null;

export function isSupabaseConfigured(): boolean {
  if (configValid !== null) return configValid;
  const url = Config.supabase.url;
  const key = Config.supabase.anonKey;
  configValid = !!(
    url &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key &&
    key.length > 20 &&
    !key.includes('your_')
  );
  return configValid;
}

function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabase) {
    try {
      supabase = createClient(Config.supabase.url, Config.supabase.anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
    } catch {
      configValid = false;
      return null;
    }
  }
  return supabase;
}

// ─── Auth Functions ─────────────────────────────────────────

export async function signUp(email: string, password: string) {
  const client = getSupabase();
  if (!client) return { user: null, session: null };
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();
  if (!client) return { user: null, session: null };
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.auth.signOut();
  } catch {
    // silent
  }
}

export async function getSession() {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data.session;
  } catch {
    return null;
  }
}

// ─── Saved Articles ─────────────────────────────────────────

export async function saveArticle(article: Article, userId: string) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('saved_articles').upsert({
      user_id: userId,
      article_id: article.id,
      title: article.simplifiedTitle || article.title,
      image_url: article.imageUrl,
      source_url: article.sourceUrl,
    });
  } catch {
    // silent
  }
}

export async function unsaveArticle(articleId: string, userId: string) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client
      .from('saved_articles')
      .delete()
      .eq('user_id', userId)
      .eq('article_id', articleId);
  } catch {
    // silent
  }
}

export async function getSavedArticles(userId: string): Promise<SavedArticleRow[]> {
  const client = getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('saved_articles')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });
    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function isArticleSaved(articleId: string, userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { data } = await client
      .from('saved_articles')
      .select('id')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}
