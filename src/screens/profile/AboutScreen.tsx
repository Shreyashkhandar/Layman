import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function AboutScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accent }]}>
            <Text style={styles.logoText}>L</Text>
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Layman</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>News, made simple.</Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.accentMuted }]}>
            <Text style={[styles.versionText, { color: colors.accent }]}>Version 1.0.0</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Our Mission</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Layman was built with one goal: to make news accessible to everyone. We believe that understanding what's happening in the world shouldn't require a degree in journalism or finance. Our AI simplifies complex stories into clear, conversational language that anyone can understand.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>How It Works</Text>
          {[
            { n: '1', t: 'We fetch the news', d: 'Real-time articles from trusted sources via NewsData.io' },
            { n: '2', t: 'AI simplifies it', d: 'Google Gemini & Groq break down jargon into plain English' },
            { n: '3', t: 'You read & ask', d: 'Get 3-card summaries and chat with our AI for deeper understanding' },
          ].map((s) => (
            <View key={s.n} style={styles.step}>
              <View style={[styles.stepNum, { backgroundColor: colors.accent }]}><Text style={styles.stepNumText}>{s.n}</Text></View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{s.t}</Text>
                <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>{s.d}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Built With</Text>
          <View style={styles.techGrid}>
            {['React Native', 'Expo', 'Supabase', 'Gemini AI', 'Groq', 'NewsData.io'].map((name) => (
              <View key={name} style={[styles.techChip, { backgroundColor: colors.surfaceLight }]}>
                <Text style={[styles.techName, { color: colors.textPrimary }]}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Developer</Text>
          <View style={styles.devRow}>
            <View style={[styles.devAvatar, { backgroundColor: colors.accent }]}>
              <Text style={styles.devAvatarText}>SK</Text>
            </View>
            <View>
              <Text style={[styles.devName, { color: colors.textPrimary }]}>Shreyash Khandar</Text>
              <Text style={[styles.devEmail, { color: colors.textSecondary }]}>shreyashkhandar82@gmail.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.legalSection}>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={[styles.legalLink, { color: colors.accent }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.copyright, { color: colors.textTertiary }]}>© 2026 Layman. All rights reserved.</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: Typography.cardTitle, fontWeight: '700' },
  logoSection: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  logoCircle: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  logoText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF' },
  appName: { fontSize: Typography.heroTitle, fontWeight: '800' },
  tagline: { fontSize: Typography.body, marginTop: 4 },
  versionBadge: { marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: 6, borderRadius: BorderRadius.round },
  versionText: { fontSize: Typography.caption, fontWeight: '600' },
  card: { marginHorizontal: Spacing.xxl, marginBottom: Spacing.lg, borderRadius: BorderRadius.lg, padding: Spacing.xl },
  cardTitle: { fontSize: Typography.cardTitle, fontWeight: '700', marginBottom: Spacing.md },
  cardText: { fontSize: Typography.bodySmall, lineHeight: 22 },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg },
  stepNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md, marginTop: 2 },
  stepNumText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: Typography.body, fontWeight: '700', marginBottom: 2 },
  stepDesc: { fontSize: Typography.bodySmall },
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  techChip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: BorderRadius.round },
  techName: { fontSize: Typography.caption, fontWeight: '600' },
  devRow: { flexDirection: 'row', alignItems: 'center' },
  devAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  devAvatarText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  devName: { fontSize: Typography.body, fontWeight: '700' },
  devEmail: { fontSize: Typography.caption, marginTop: 2 },
  legalSection: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  legalLink: { fontSize: Typography.bodySmall, fontWeight: '600' },
  copyright: { textAlign: 'center', fontSize: Typography.caption, marginTop: Spacing.lg },
});
