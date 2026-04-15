import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function HelpSupportScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();

  const handleCall = () => {
    Linking.openURL('tel:+91******9270').catch(() => Alert.alert('Error', 'Could not open phone dialer.'));
  };
  const handleEmail = () => {
    Linking.openURL('mailto:shreyashkhandar82@gmail.com?subject=Layman%20App%20Support').catch(() => Alert.alert('Error', 'Could not open email client.'));
  };

  const faqs = [
    { q: 'How does Layman simplify news?', a: 'Layman uses AI (Google Gemini & Groq) to break down complex news articles into simple, conversational language that anyone can understand.' },
    { q: 'Why are some articles not simplified?', a: 'If the AI service is temporarily unavailable or the API quota is exceeded, articles will show their original headlines with placeholder summaries.' },
    { q: 'How do I save articles?', a: 'Tap the bookmark icon on any article to save it. Your saved articles persist even after signing out and are available in the Saved tab.' },
    { q: 'Is my data secure?', a: 'Yes. We use Supabase with row-level security for cloud storage. Your saved articles are also cached locally on your device.' },
    { q: 'How do I change the app theme?', a: 'Go to Profile → Appearance to switch between Dark Mode, Light Mode, or System (follows your device setting).' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>CONTACT US</Text>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface }]} onPress={handleCall} activeOpacity={0.7}>
            <View style={[styles.contactIcon, { backgroundColor: 'rgba(48, 209, 88, 0.15)' }]}>
              <Ionicons name="call" size={22} color={colors.success} />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>Phone Support</Text>
              <Text style={[styles.contactValue, { color: colors.accent }]}>+91 ******9270</Text>
              <Text style={[styles.contactMeta, { color: colors.textTertiary }]}>Available Mon–Sat, 10 AM – 6 PM IST</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface }]} onPress={handleEmail} activeOpacity={0.7}>
            <View style={[styles.contactIcon, { backgroundColor: colors.accentMuted }]}>
              <Ionicons name="mail" size={22} color={colors.accent} />
            </View>
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>Email Support</Text>
              <Text style={[styles.contactValue, { color: colors.accent }]}>shreyashkhandar82@gmail.com</Text>
              <Text style={[styles.contactMeta, { color: colors.textTertiary }]}>We typically respond within 24 hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>FREQUENTLY ASKED QUESTIONS</Text>
          {faqs.map((faq, i) => (
            <View key={i} style={[styles.faqCard, { backgroundColor: colors.surface }]}>
              <View style={styles.faqQ}>
                <Ionicons name="help-circle" size={20} color={colors.accent} style={{ marginRight: Spacing.sm }} />
                <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>{faq.q}</Text>
              </View>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
            </View>
          ))}
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: colors.accentMuted }]}>
            <Ionicons name="time-outline" size={16} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.accent }]}>Avg response: 12 hrs</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.accentMuted }]}>
            <Ionicons name="star-outline" size={16} color={colors.accent} />
            <Text style={[styles.badgeText, { color: colors.accent }]}>4.8/5 satisfaction</Text>
          </View>
        </View>
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
  section: { paddingHorizontal: Spacing.xxl, marginTop: Spacing.xl },
  sectionLabel: { fontSize: Typography.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  contactIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  contactText: { flex: 1 },
  contactTitle: { fontSize: Typography.body, fontWeight: '700', marginBottom: 2 },
  contactValue: { fontSize: Typography.bodySmall, fontWeight: '600', marginBottom: 2 },
  contactMeta: { fontSize: Typography.caption },
  faqCard: { borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.sm },
  faqQ: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  faqQuestion: { flex: 1, fontSize: Typography.body, fontWeight: '600' },
  faqAnswer: { fontSize: Typography.bodySmall, lineHeight: 21, paddingLeft: 28 },
  badgeRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xxl, marginTop: Spacing.xxl },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round },
  badgeText: { fontSize: Typography.caption, fontWeight: '600' },
});
