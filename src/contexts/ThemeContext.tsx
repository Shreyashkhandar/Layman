import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkColors, LightColors } from '../constants/theme';

type ThemeMode = 'dark' | 'light' | 'system';
type ColorScheme = typeof DarkColors;

interface ThemeContextValue {
  colors: ColorScheme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (m: ThemeMode) => void;
}

const THEME_KEY = '@layman_theme';

const ThemeContext = createContext<ThemeContextValue>({
  colors: DarkColors,
  mode: 'dark',
  isDark: true,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val === 'dark' || val === 'light' || val === 'system') {
        setModeState(val);
      }
      setReady(true);
    }).catch(() => setReady(true));
  }, []);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    await AsyncStorage.setItem(THEME_KEY, m);
  };

  const isDark =
    mode === 'dark' ? true :
    mode === 'light' ? false :
    systemScheme !== 'light';

  const colors = isDark ? DarkColors : LightColors;

  // Show a themed splash instead of null to avoid blue/white flash
  if (!ready) {
    return (
      <View style={[splash.container, { backgroundColor: '#000000' }]}>
        <ActivityIndicator size="large" color="#F5862E" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={{ colors, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

const splash = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export function useTheme() {
  return useContext(ThemeContext);
}
