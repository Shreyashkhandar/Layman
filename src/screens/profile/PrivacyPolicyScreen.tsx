import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

  const sections = [
    {
      title: '1. Information We Collect',
      text: 'Layman collects your email address for authentication purposes. We also store your saved articles and app preferences locally on your device and in our secure cloud database.',
    },
    {
      title: '2. How We Use Your Data',
      text: 'Your data is used solely to provide and improve the Layman news reading experience. We use AI services (Google Gemini, Groq) to simplify news content. Article text is sent to these services for processing but is never stored by them.',
    },
    {
      title: '3. Data Storage',
      text: 'Your account data is stored securely using Supabase (built on PostgreSQL) with row-level security enabled. Saved articles are also cached locally on your device for offline access.',
    },
    {
      title: '4. Third-Party Services',
      text: 'We integrate with NewsData.io for news content, Google Gemini and Groq for AI-powered simplification, and Supabase for authentication and storage. Each service has its own privacy policy.',
    },
    {
      title: '5. Your Rights',
      text: 'You can delete your account and all associated data at any time by contacting us. You can also clear your locally saved articles by signing out of the app.',
    },
    {
      title: '6. Data Sharing',
      text: 'We do not sell, trade, or share your personal information with third parties for marketing purposes. Data is only shared with our service providers (Supabase, AI services) as necessary to operate the app.',
    },
    {
      title: '7. Security',
      text: 'We implement industry-standard security measures including encrypted storage, secure API communication (HTTPS), and row-level database security to protect your data.',
    },
    {
      title: '8. Contact',
      text: 'For privacy concerns, contact us at shreyashkhandar82@gmail.com or call +91 ******9270.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.topRow}>
            <Ionicons name="shield-checkmark" size={28} color={colors.accent} />
            <View style={styles.topText}>
              <Text style={[styles.policyTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
              <Text style={[styles.policyDate, { color: colors.textTertiary }]}>Last updated: April 2026</Text>
            </View>
          </View>

          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            At Layman, your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our app.
          </Text>

          {sections.map((s, i) => (
            <View key={i} style={styles.sectionBlock}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>{s.title}</Text>
              <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{s.text}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.textTertiary }]}>
          By using Layman, you agree to this privacy policy.
        </Text>
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
  scroll: { paddingHorizontal: Spacing.xxl },
  card: { borderRadius: BorderRadius.lg, padding: Spacing.xl, marginTop: Spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  topText: { marginLeft: Spacing.md },
  policyTitle: { fontSize: Typography.sectionTitle, fontWeight: '700' },
  policyDate: { fontSize: Typography.caption, marginTop: 2 },
  intro: { fontSize: Typography.bodySmall, lineHeight: 22, marginBottom: Spacing.lg },
  sectionBlock: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: Typography.body, fontWeight: '700', marginBottom: Spacing.sm },
  sectionText: { fontSize: Typography.bodySmall, lineHeight: 22 },
  footer: { textAlign: 'center', fontSize: Typography.caption, marginTop: Spacing.xl, fontStyle: 'italic' },
});
