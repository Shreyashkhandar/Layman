// Layman App — Design Tokens
// Supports Dark and Light themes

export const DarkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceLight: '#2C2C2E',
  card: '#1C1C1E',
  cardElevated: '#252528',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  textInverse: '#000000',
  accent: '#F5862E',
  accentLight: '#FF9F4A',
  accentDark: '#D4711F',
  accentMuted: 'rgba(245, 134, 46, 0.15)',
  gradientStart: '#F5A623',
  gradientMid: '#F57B2E',
  gradientEnd: '#E85D26',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
  info: '#64D2FF',
  border: '#38383A',
  separator: '#2C2C2E',
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayHeavy: 'rgba(0, 0, 0, 0.85)',
  tabActive: '#F5862E',
  tabInactive: '#8E8E93',
  tabBar: '#1C1C1E',
  chatBotBubble: '#2C2C2E',
  chatUserBubble: '#F5862E',
  chatInputBg: '#1C1C1E',
  statusBar: '#000000',
};

export const LightColors: typeof DarkColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceLight: '#E5E5EA',
  card: '#FFFFFF',
  cardElevated: '#F9F9F9',
  textPrimary: '#000000',
  textSecondary: '#6C6C70',
  textTertiary: '#AEAEB2',
  textInverse: '#FFFFFF',
  accent: '#F5862E',
  accentLight: '#FF9F4A',
  accentDark: '#D4711F',
  accentMuted: 'rgba(245, 134, 46, 0.12)',
  gradientStart: '#F5A623',
  gradientMid: '#F57B2E',
  gradientEnd: '#E85D26',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  info: '#5AC8FA',
  border: '#D1D1D6',
  separator: '#E5E5EA',
  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayHeavy: 'rgba(0, 0, 0, 0.6)',
  tabActive: '#F5862E',
  tabInactive: '#8E8E93',
  tabBar: '#FFFFFF',
  chatBotBubble: '#E5E5EA',
  chatUserBubble: '#F5862E',
  chatInputBg: '#FFFFFF',
  statusBar: '#F2F2F7',
};

// Default export for backward compatibility — used by files that don't need dynamic theme
export const Colors = DarkColors;

export const Typography = {
  fontRegular: 'System',
  fontMedium: 'System',
  fontSemiBold: 'System',
  fontBold: 'System',
  heroTitle: 34,
  screenTitle: 28,
  sectionTitle: 22,
  cardTitle: 17,
  body: 16,
  bodySmall: 14,
  caption: 12,
  label: 11,
  heroLineHeight: 41,
  screenTitleLineHeight: 34,
  sectionTitleLineHeight: 28,
  cardTitleLineHeight: 22,
  bodyLineHeight: 22,
  bodySmallLineHeight: 20,
  captionLineHeight: 16,
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, section: 40,
};

export const BorderRadius = {
  sm: 8, md: 12, lg: 16, xl: 20, round: 999,
};

export const Shadows = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  elevated: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
};
