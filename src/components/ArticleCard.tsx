import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface ArticleCardProps {
  title: string;
  imageUrl: string | null;
  source?: string;
  publishedAt?: string;
  onPress: () => void;
}

export default function ArticleCard({
  title,
  imageUrl,
  source,
  publishedAt,
  onPress,
}: ArticleCardProps) {
  const timeAgo = publishedAt ? getTimeAgo(publishedAt) : '';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.container}
    >
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require('../../assets/placeholder.png')
        }
        style={styles.thumbnail}
        resizeMode="cover"
        defaultSource={require('../../assets/placeholder.png')}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <View style={styles.meta}>
          {source ? <Text style={styles.source}>{source}</Text> : null}
          {timeAgo ? <Text style={styles.time}>{timeAgo}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
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
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    lineHeight: Typography.bodySmallLineHeight,
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  source: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: '600',
  },
  time: {
    color: Colors.textTertiary,
    fontSize: Typography.caption,
  },
});
