import { Article } from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  MainTabs: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ArticleDetail: { article: Article };
  Chat: { articleTitle: string; articleContent: string };
};

export type TabParamList = {
  Home: undefined;
  Saved: undefined;
  Profile: undefined;
};
