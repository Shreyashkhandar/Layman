import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
  Share, Dimensions, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useSavedStore } from '../../store/savedStore';
import { simplifyContent } from '../../services/ai';
import ContentCard from '../../components/ContentCard';
import { Article, SimplifiedCard } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 64;

const FALLBACK_CARDS: SimplifiedCard[] = [
  { partNumber: 1, text: 'This article covers an interesting recent development. Here is a simplified overview of what happened.' },
  { partNumber: 2, text: "This matters because it could change how people think about this topic. It's worth keeping an eye on." },
  { partNumber: 3, text: "Going forward, experts will be watching how this plays out. We'll keep you updated as more details emerge." },
];

export default function ArticleDetailScreen({ route, navigation }: any) {
  // Guard: missing params
  const article: Article = route?.params?.article ?? {
    id: 'unknown', title: 'Article', simplifiedTitle: 'Article',
    description: '', content: '', imageUrl: null, sourceUrl: '',
    publishedAt: '', source: '', category: '',
  };

  const { user } = useAuthStore();
  const { toggleSave, isSaved } = useSavedStore();

  const [cards, setCards] = useState<SimplifiedCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const saved = isSaved(article.id);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const content = article.content || article.description || '';
        const headline = article.simplifiedTitle || article.title || 'News';
        const result = await simplifyContent(content, headline);
        if (mounted) setCards(result && result.length > 0 ? result : FALLBACK_CARDS);
      } catch {
        if (mounted) setCards(FALLBACK_CARDS);
      } finally {
        if (mounted) setIsLoadingCards(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleOpenOriginal = async () => {
    if (!article.sourceUrl) return;
    try {
      await WebBrowser.openBrowserAsync(article.sourceUrl, {
        controlsColor: Colors.accent, toolbarColor: Colors.background,
      });
    } catch { /* silent */ }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.simplifiedTitle || article.title}\n\nRead more: ${article.sourceUrl || ''}`,
      });
    } catch { /* silent */ }
  };

  const handleSave = () => {
    if (user) toggleSave(article, user.id);
  };

  const onCardScroll = (event: any) => {
    try {
      const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
      setActiveCardIndex(index);
    } catch { /* silent */ }
  };

  // Prepare sections for FlatList to avoid nested scrolling
  const sections = [
    { type: 'header', key: 'header' },
    { type: 'headline', key: 'headline' },
    { type: 'image', key: 'image' },
    { type: 'cards', key: 'cards' },
    { type: 'spacer', key: 'spacer' },
  ];

  const renderSection = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return (
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.topBarRight}>
              <TouchableOpacity onPress={handleOpenOriginal} style={styles.iconBtn}>
                <Ionicons name="link-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? Colors.accent : Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                <Ionicons name="share-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'headline':
        return (
          <Text style={styles.headline} numberOfLines={2}>
            {article.simplifiedTitle || article.title || 'News Article'}
          </Text>
        );
      case 'image':
        return article.imageUrl && !imgError ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.image, styles.imgPlaceholder]}>
            <Ionicons name="image-outline" size={48} color={Colors.textTertiary} />
          </View>
        );
      case 'cards':
        return (
          <View style={styles.cardsSection}>
            {isLoadingCards ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.accent} />
                <Text style={styles.loadingText}>Simplifying article...</Text>
              </View>
            ) : (
              <FlatList
                data={cards}
                horizontal pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 32}
                decelerationRate="fast"
                contentContainerStyle={styles.cardsContent}
                onScroll={onCardScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => String(item.partNumber)}
                renderItem={({ item }) => (
                  <ContentCard text={item.text} partNumber={item.partNumber} totalParts={cards.length} />
                )}
              />
            )}
          </View>
        );
      case 'spacer':
        return <View style={styles.bottomSpacer} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />

      <TouchableOpacity
        style={styles.askButton} activeOpacity={0.9}
        onPress={() => navigation.navigate('Chat', {
          articleTitle: article.simplifiedTitle || article.title || '',
          articleContent: article.content || article.description || '',
        })}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" />
        <Text style={styles.askButtonText}>Ask Layman</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  contentContainer: { paddingBottom: 120 }, // Space for floating button
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  topBarRight: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  headline: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg, lineHeight: 34 },
  image: { width: width - 48, height: 220, borderRadius: BorderRadius.lg, alignSelf: 'center', marginBottom: Spacing.xxl, backgroundColor: Colors.surface },
  imgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  cardsSection: { minHeight: 200 },
  cardsContent: { paddingHorizontal: Spacing.lg },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.section },
  loadingText: { color: Colors.textSecondary, marginTop: Spacing.sm, fontSize: Typography.bodySmall },
  bottomSpacer: { height: 100 },
  askButton: { position: 'absolute', bottom: 40, left: Spacing.xxl, right: Spacing.xxl, backgroundColor: Colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg, borderRadius: BorderRadius.lg, ...Shadows.elevated },
  askButtonText: { color: '#FFFFFF', fontSize: Typography.body, fontWeight: '700' },
});
