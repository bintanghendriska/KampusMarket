import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

interface PressAnimation {
  animatedStyle: { transform: [{ scale: Animated.Value }] };
  onPressIn: () => void;
  onPressOut: () => void;
}

// Subtle scale-down-on-press feedback shared by buttons, cards, and chips.
// Runs on the native thread (useNativeDriver) so it never touches JS-thread performance.
export function usePressAnimation(scaleTo = 0.97): PressAnimation {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }, [scale, scaleTo]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }, [scale]);

  return { animatedStyle: { transform: [{ scale }] }, onPressIn, onPressOut };
}
