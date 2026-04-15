import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  NEWSDATA_API_KEY,
  GEMINI_API_KEY,
  GROQ_API_KEY,
} from '@env';

export const Config = {
  supabase: {
    url: SUPABASE_URL || '',
    anonKey: SUPABASE_ANON_KEY || '',
  },
  newsApi: {
    key: NEWSDATA_API_KEY || '',
    baseUrl: 'https://newsdata.io/api/1',
  },
  gemini: {
    key: GEMINI_API_KEY || '',
  },
  groq: {
    key: GROQ_API_KEY || '',
    baseUrl: 'https://api.groq.com/openai/v1',
  },
};
