import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 64;

interface ContentCardProps {
  text: string;
  partNumber: number;
  totalParts: number;
}

export default function ContentCard({ text, partNumber, totalParts }: ContentCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.dots}>
        {Array.from({ length: totalParts }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i + 1 === partNumber && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    width: '100%',
    minHeight: 160,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    lineHeight: 26,
    fontWeight: '400',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: 24,
    borderRadius: 4,
  },
});
