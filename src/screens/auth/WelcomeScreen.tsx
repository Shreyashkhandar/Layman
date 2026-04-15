import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../../constants/theme';
import SwipeButton from '../../components/SwipeButton';

const { height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleSwipeComplete = () => {
    navigation.navigate('Auth');
  };

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Layman</Text>
      </View>

      {/* Slogan */}
      <View style={styles.sloganContainer}>
        <Text style={styles.slogan}>
          Business, tech{'\n'}& startups{'\n'}
          <Text style={styles.sloganAccent}>made simple</Text>
        </Text>
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Swipe Button */}
      <View style={styles.swipeContainer}>
        <SwipeButton onSwipeComplete={handleSwipeComplete} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.12,
    paddingBottom: 60,
  },
  logoContainer: {
    marginBottom: Spacing.section,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  sloganContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  slogan: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
  },
  sloganAccent: {
    color: '#FFFFFF',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    textDecorationColor: '#FFFFFF',
  },
  spacer: {
    flex: 1,
  },
  swipeContainer: {
    alignItems: 'center',
  },
});
