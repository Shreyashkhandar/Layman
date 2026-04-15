import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

LogBox.ignoreLogs([
  'Error simplifying', 'Error loading saved', 'Error toggling save',
  'SUPABASE_NOT_CONFIGURED', 'GoogleGenerativeAI', 'AI_QUOTA_EXHAUSTED',
  'quota', '429', 'Non-serializable values were found',
]);

function AppContent() {
  const { restoreSession, isLoading, isAuthenticated } = useAuthStore();
  const { colors, isDark } = useTheme();

  useEffect(() => { restoreSession(); }, []);

  if (isLoading && !isAuthenticated) {
    return (
      <View style={[styles.splash, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={styles.root}>
        <AppContent />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
