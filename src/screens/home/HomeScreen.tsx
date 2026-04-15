import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useArticlesStore } from '../../store/articlesStore';
import FeaturedCard from '../../components/FeaturedCard';
import ArticleCard from '../../components/ArticleCard';
import { Article } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    articles,
    featuredArticles,
    isLoading,
    isRefreshing,
    fetchArticles,
    refreshArticles,
    search,
    searchResults,
    searchQuery,
    clearSearch,
    isSearching,
  } = useArticlesStore();

  const [showSearch, setShowSearch] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticlePress = (article: Article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      search(localSearchQuery.trim());
    }
  };

  const onCarouselScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
      setActiveCarouselIndex(index);
    },
    []
  );

  const displayArticles = searchQuery ? searchResults : articles;

  if (isLoading && articles.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {showSearch ? (
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles..."
              placeholderTextColor={Colors.textTertiary}
              value={localSearchQuery}
              onChangeText={setLocalSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setShowSearch(false);
                setLocalSearchQuery('');
                clearSearch();
              }}
            >
              <Ionicons name="close-circle" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.logo}>Layman</Text>
            <TouchableOpacity onPress={() => setShowSearch(true)}>
              <Ionicons name="search" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshArticles}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Featured Carousel */}
        {!searchQuery && featuredArticles.length > 0 && (
          <View style={styles.carouselSection}>
            <FlatList
              ref={carouselRef}
              data={featuredArticles}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 8}
              decelerationRate="fast"
              contentContainerStyle={styles.carouselContent}
              onScroll={onCarouselScroll}
              scrollEventThrottle={16}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FeaturedCard
                  title={item.simplifiedTitle || item.title}
                  imageUrl={item.imageUrl}
                  source={item.source}
                  onPress={() => handleArticlePress(item)}
                />
              )}
            />
            {/* Carousel Dots */}
            <View style={styles.dotsContainer}>
              {featuredArticles.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeCarouselIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Today's Picks / Search Results */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : "Today's Picks"}
          </Text>
          {!searchQuery && (
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          <ActivityIndicator
            size="small"
            color={Colors.accent}
            style={styles.searchLoader}
          />
        ) : (
          <View style={styles.articlesList}>
            {displayArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.simplifiedTitle || article.title}
                imageUrl={article.imageUrl}
                source={article.source}
                publishedAt={article.publishedAt}
                onPress={() => handleArticlePress(article)}
              />
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    fontSize: Typography.bodySmall,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Typography.bodySmall,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  carouselSection: {
    marginBottom: Spacing.xxl,
  },
  carouselContent: {
    paddingHorizontal: Spacing.xxl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 20,
    borderRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAll: {
    color: Colors.accent,
    fontSize: Typography.bodySmall,
    fontWeight: '600',
  },
  articlesList: {
    paddingHorizontal: Spacing.lg,
  },
  searchLoader: {
    marginTop: Spacing.xxl,
  },
  bottomSpacer: {
    height: 100,
  },
});
