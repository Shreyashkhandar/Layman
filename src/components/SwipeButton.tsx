import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 80;
const THUMB_SIZE = 56;
const MAX_TRANSLATE = BUTTON_WIDTH - THUMB_SIZE - 8;

interface SwipeButtonProps {
  onSwipeComplete: () => void;
}

export default function SwipeButton({ onSwipeComplete }: SwipeButtonProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(gestureState.dx, MAX_TRANSLATE));
        translateX.setValue(newValue);
        // Fade text as user swipes
        opacity.setValue(1 - newValue / MAX_TRANSLATE);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > MAX_TRANSLATE * 0.6) {
          // Complete the swipe
          Animated.timing(translateX, {
            toValue: MAX_TRANSLATE,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onSwipeComplete();
          });
        } else {
          // Reset
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, { opacity }]}>
        Swipe to get started
      </Animated.Text>
      <Animated.View
        style={[
          styles.thumb,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Ionicons name="chevron-forward" size={24} color={Colors.textInverse} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_WIDTH,
    height: THUMB_SIZE + 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.bodySmall,
    fontWeight: '600',
    position: 'absolute',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
