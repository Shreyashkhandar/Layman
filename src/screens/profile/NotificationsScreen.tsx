import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function NotificationsScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [savedNews, setSavedNews] = useState(true);
  const [breakingNews, setBreakingNews] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState(true);
  const [weeklyRecap, setWeeklyRecap] = useState(false);

  const sections = [
    { title: 'NEWS ALERTS', items: [
      { label: 'Breaking News', desc: 'Get notified about major breaking stories', value: breakingNews, onChange: setBreakingNews },
      { label: 'Trending Topics', desc: 'Popular stories gaining attention', value: trendingTopics, onChange: setTrendingTopics },
    ]},
    { title: 'SAVED ARTICLES', items: [
      { label: 'Saved Article Updates', desc: "Updates on stories you've bookmarked", value: savedNews, onChange: setSavedNews },
    ]},
    { title: 'DIGESTS', items: [
      { label: 'Daily Digest', desc: 'Morning summary of top stories', value: dailyDigest, onChange: setDailyDigest },
      { label: 'Weekly Recap', desc: 'Best stories of the week, every Sunday', value: weeklyRecap, onChange: setWeeklyRecap },
    ]},
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{section.title}</Text>
            {section.items.map((item, ii) => (
              <View key={ii} style={[styles.row, { backgroundColor: colors.surface }]}>
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{item.label}</Text>
                  <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
                </View>
                <Switch value={item.value} onValueChange={item.onChange} trackColor={{ false: colors.surfaceLight, true: colors.accent }} thumbColor="#FFFFFF" />
              </View>
            ))}
          </View>
        ))}
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
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  rowText: { flex: 1, marginRight: Spacing.md },
  rowTitle: { fontSize: Typography.body, fontWeight: '600', marginBottom: 2 },
  rowDesc: { fontSize: Typography.caption },
});
