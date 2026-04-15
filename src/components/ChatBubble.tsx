import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ChatBubbleProps {
  message: string;
  isBot: boolean;
}

export default function ChatBubble({ message, isBot }: ChatBubbleProps) {
  // Strip "Answer: " prefix for clean display, show as label instead
  const isFactualAnswer = isBot && message.startsWith('Answer:');
  const displayText = isFactualAnswer ? message.replace(/^Answer:\s*/, '') : message;

  return (
    <View style={[styles.row, isBot ? styles.botRow : styles.userRow]}>
      {isBot && (
        <View style={styles.avatar}>
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.accent} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        {isFactualAnswer && (
          <Text style={styles.answerLabel}>Answer</Text>
        )}
        <Text style={[styles.text, isBot ? styles.botText : styles.userText]}>
          {displayText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: 4,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  botBubble: {
    backgroundColor: Colors.chatBotBubble,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.chatUserBubble,
    borderTopRightRadius: 4,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  text: {
    fontSize: Typography.bodySmall,
    lineHeight: Typography.bodySmallLineHeight,
  },
  botText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: '#FFFFFF',
  },
});
