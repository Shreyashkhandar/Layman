import { create } from 'zustand';
import { Article } from '../types';
import { fetchNews, fetchTechNews, searchNews } from '../services/news';
import { simplifyHeadline } from '../services/ai';

interface ArticlesState {
  articles: Article[];
  featuredArticles: Article[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  nextPage?: string;
  searchQuery: string;
  searchResults: Article[];
  isSearching: boolean;

  fetchArticles: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshArticles: () => Promise<void>;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
  articles: [],
  featuredArticles: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  nextPage: undefined,
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  fetchArticles: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const [businessData, techData] = await Promise.all([
        fetchNews('business'),
        fetchTechNews(),
      ]);

      const allArticles = [...businessData.articles, ...techData.articles];

      // Simplify headlines sequentially with delay to avoid rate limits
      const simplifiedArticles: Article[] = [];
      for (const article of allArticles) {
        const simplifiedTitle = await simplifyHeadline(article.title);
        simplifiedArticles.push({ ...article, simplifiedTitle });
        await new Promise((r) => setTimeout(r, 300));
      }

      const featured = simplifiedArticles.slice(0, 5);
      const regular = simplifiedArticles.slice(5);

      set({
        featuredArticles: featured,
        articles: regular,
        nextPage: businessData.nextPage,
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to load articles', isLoading: false });
    }
  },

  loadMore: async () => {
    const { nextPage, isLoading } = get();
    if (!nextPage || isLoading) return;

    try {
      const data = await fetchNews('business', nextPage);
      const newArticles: Article[] = [];
      for (const article of data.articles) {
        const simplifiedTitle = await simplifyHeadline(article.title);
        newArticles.push({ ...article, simplifiedTitle });
        await new Promise((r) => setTimeout(r, 300));
      }

      set((state) => ({
        articles: [...state.articles, ...newArticles],
        nextPage: data.nextPage,
      }));
    } catch {
      // silent
    }
  },

  refreshArticles: async () => {
    set({ isRefreshing: true });
    try {
      await get().fetchArticles();
    } finally {
      set({ isRefreshing: false });
    }
  },

  search: async (query: string) => {
    set({ searchQuery: query, isSearching: true });
    try {
      const results = await searchNews(query);
      set({ searchResults: results, isSearching: false });
    } catch {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchQuery: '', searchResults: [], isSearching: false }),
}));
