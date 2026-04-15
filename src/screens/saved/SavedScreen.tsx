import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useSavedStore } from '../../store/savedStore';
import { SavedArticleRow } from '../../types';

interface SavedScreenProps {
  navigation: any;
}

export default function SavedScreen({ navigation }: SavedScreenProps) {
  const { user } = useAuthStore();
  const { savedArticles, isLoading, loadSaved } = useSavedStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (user) {
      loadSaved(user.id);
    }
  }, [user]);

  const filteredArticles = searchQuery.trim()
    ? savedArticles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedArticles;

  const renderArticle = ({ item }: { item: SavedArticleRow }) => (
    <TouchableOpacity
      style={styles.articleRow}
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to article detail with saved data
        navigation.navigate('Home', {
          screen: 'ArticleDetail',
          params: {
            article: {
              id: item.article_id,
              title: item.title,
              simplifiedTitle: item.title,
              description: '',
              content: '',
              imageUrl: item.image_url,
              sourceUrl: item.source_url,
              publishedAt: item.saved_at,
              source: '',
              category: '',
            },
          },
        });
      }}
    >
      <Image
        source={
          item.image_url
            ? { uri: item.image_url }
            : require('../../../assets/placeholder.png')
        }
        style={styles.thumbnail}
        resizeMode="cover"
        defaultSource={require('../../../assets/placeholder.png')}
      />
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.savedDate}>
          Saved {getTimeAgo(item.saved_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {showSearch ? (
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search saved articles..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoFocus
            />
            <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Saved</Text>
            <TouchableOpacity onPress={() => setShowSearch(true)}>
              <Ionicons name="search" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : filteredArticles.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="bookmark-outline" size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>{searchQuery ? 'No results found' : 'No saved articles'}</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'Try a different search' : 'Bookmark articles to read them later'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={renderArticle}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function getTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.textPrimary,
    fontSize: Typography.body,
  },
  title: {
    fontSize: Typography.screenTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: Typography.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
  },
  articleContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  articleTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    lineHeight: Typography.bodySmallLineHeight,
    marginBottom: Spacing.xs,
  },
  savedDate: {
    color: Colors.textTertiary,
    fontSize: Typography.caption,
  },
});
