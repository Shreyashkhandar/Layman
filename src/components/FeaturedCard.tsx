import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 220;

interface FeaturedCardProps {
  title: string;
  imageUrl: string | null;
  source: string;
  onPress: () => void;
}

export default function FeaturedCard({ title, imageUrl, source, onPress }: FeaturedCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <Image
        source={
          imageUrl
            ? { uri: imageUrl }
            : require('../../assets/placeholder.png')
        }
        style={styles.image}
        resizeMode="cover"
        defaultSource={require('../../assets/placeholder.png')}
      />
      <View style={styles.gradient}>
        <View style={styles.sourceTag}>
          <Text style={styles.sourceText}>{source}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: 4,
    ...Shadows.elevated,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sourceTag: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  sourceText: {
    color: Colors.textPrimary,
    fontSize: Typography.label,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.cardTitle,
    fontWeight: '700',
    lineHeight: Typography.cardTitleLineHeight,
  },
});
