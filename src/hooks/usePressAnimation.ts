import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';

interface PressAnimation {
  animatedStyle: { transform: [{ scale: Animated.Value }] };
  onPressIn: () => void;
  onPressOut: () => void;
}

// Subtle scale-down-on-press feedback shared by buttons, cards, and chips.
// Runs on the native thread (useNativeDriver) so it never touches JS-thread performance.
// Respects system accessibility setting for reduced motion.
export function usePressAnimation(scaleTo = 0.97): PressAnimation {
  const scale = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Check initial status
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });

    // Listen to changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (active) setReduceMotion(enabled);
      }
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const onPressIn = useCallback(() => {
    if (reduceMotion) return;
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  }, [scale, scaleTo, reduceMotion]);

  const onPressOut = useCallback(() => {
    if (reduceMotion) {
      // Instantly reset scale if reduceMotion is active (just in case)
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  }, [scale, reduceMotion]);

  return { animatedStyle: { transform: [{ scale }] }, onPressIn, onPressOut };
}
