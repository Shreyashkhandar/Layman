import { Config } from '../constants/config';
import { Article, NewsApiArticle, NewsApiResponse } from '../types';

const BASE_URL = Config.newsApi.baseUrl;

function transformArticle(raw: NewsApiArticle): Article {
  return {
    id: raw.article_id,
    title: raw.title || '',
    simplifiedTitle: '', // Will be set by AI service
    description: raw.description || '',
    content: raw.content || raw.description || '',
    imageUrl: raw.image_url,
    sourceUrl: raw.link,
    publishedAt: raw.pubDate,
    source: raw.source_name || raw.source_id || 'Unknown',
    category: raw.category?.[0] || 'business',
  };
}

export async function fetchNews(
  category: string = 'business',
  page?: string
): Promise<{ articles: Article[]; nextPage?: string }> {
  try {
    const params = new URLSearchParams({
      apikey: Config.newsApi.key,
      category,
      language: 'en',
      image: '1', // Only articles with images
      size: '10',
    });

    if (page) {
      params.append('page', page);
    }

    const response = await fetch(`${BASE_URL}/latest?${params.toString()}`);
    const data: NewsApiResponse = await response.json();

    if (data.status !== 'success') {
      throw new Error('Failed to fetch news');
    }

    const articles = (data.results || [])
      .filter((a) => a.title && a.image_url)
      .map(transformArticle);

    return {
      articles,
      nextPage: data.nextPage,
    };
  } catch {
    return { articles: [] };
  }
}

export async function fetchTechNews(page?: string) {
  return fetchNews('technology', page);
}

export async function fetchBusinessNews(page?: string) {
  return fetchNews('business', page);
}

export async function searchNews(query: string): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      apikey: Config.newsApi.key,
      q: query,
      language: 'en',
      image: '1',
      size: '10',
    });

    const response = await fetch(`${BASE_URL}/latest?${params.toString()}`);
    const data: NewsApiResponse = await response.json();

    if (data.status !== 'success') {
      throw new Error('Failed to search news');
    }

    return (data.results || [])
      .filter((a) => a.title && a.image_url)
      .map(transformArticle);
  } catch {
    return [];
  }
}
