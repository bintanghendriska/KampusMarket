import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';

const WIDE_SCREEN_BREAKPOINT = 700;

export function ProductCardSkeleton() {
  const animatedValue = useRef(new Animated.Value(0.3)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;
  const totalPadding = 48;
  const totalGaps = (numColumns - 1) * 16;
  const cardWidth = (width - totalPadding - totalGaps) / numColumns;

  return (
    <View style={[styles.card, { maxWidth: cardWidth }]}>
      <Animated.View style={[styles.image, { opacity: animatedValue }]} />
      <View style={styles.info}>
        <Animated.View style={[styles.titleLine, { opacity: animatedValue }]} />
        <Animated.View style={[styles.titleLineShort, { opacity: animatedValue }]} />
        <Animated.View style={[styles.price, { opacity: animatedValue }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.neutral200,
  },
  info: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  titleLine: {
    height: 12,
    width: '90%',
    backgroundColor: colors.neutral200,
    borderRadius: radius.sm,
  },
  titleLineShort: {
    height: 12,
    width: '60%',
    backgroundColor: colors.neutral200,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  price: {
    height: 16,
    width: '50%',
    backgroundColor: colors.neutral200,
    borderRadius: radius.sm,
  },
});
