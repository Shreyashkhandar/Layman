import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

type ThemeMode = 'dark' | 'light' | 'system';

export default function AppearanceScreen({ navigation }: any) {
  const systemScheme = useColorScheme();
  const { colors, isDark, mode, setMode } = useTheme();

  const options: { key: ThemeMode; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'dark', label: 'Dark Mode', desc: 'Always use dark theme', icon: 'moon' },
    { key: 'light', label: 'Light Mode', desc: 'Always use light theme', icon: 'sunny' },
    { key: 'system', label: 'System', desc: `Follow device setting (currently ${systemScheme || 'dark'})`, icon: 'phone-portrait-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>THEME</Text>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.option, { backgroundColor: colors.surface }, mode === opt.key && { borderWidth: 1, borderColor: colors.accent }]}
            onPress={() => setMode(opt.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: mode === opt.key ? colors.accentMuted : colors.surfaceLight }]}>
              <Ionicons name={opt.icon} size={20} color={mode === opt.key ? colors.accent : colors.textSecondary} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: mode === opt.key ? colors.accent : colors.textPrimary }]}>{opt.label}</Text>
              <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{opt.desc}</Text>
            </View>
            <View style={[styles.radio, { borderColor: mode === opt.key ? colors.accent : colors.textTertiary }]}>
              {mode === opt.key && <View style={[styles.radioDot, { backgroundColor: colors.accent }]} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 56, paddingBottom: Spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: Typography.cardTitle, fontWeight: '700' },
  content: { paddingHorizontal: Spacing.xxl, marginTop: Spacing.xl },
  sectionLabel: { fontSize: Typography.caption, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.md },
  option: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  iconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  optionText: { flex: 1 },
  optionTitle: { fontSize: Typography.body, fontWeight: '600', marginBottom: 2 },
  optionDesc: { fontSize: Typography.caption },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
});
