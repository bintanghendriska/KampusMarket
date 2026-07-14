import React from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import type { ProductCategory } from '../../types/product.types';

export const ALL_CATEGORIES_VALUE = 'all';

interface CategoryFilterProps {
  categories: ProductCategory[];
  selected: string;
  onSelect: (categorySlug: string) => void;
}

function CategoryChip({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={onSelect}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const data = [{ slug: ALL_CATEGORIES_VALUE, name: 'Semua', url: '' }, ...categories];

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.slug}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <CategoryChip
          label={item.name}
          isActive={item.slug === selected}
          onSelect={() => onSelect(item.slug)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  chip: {
    minHeight: touchTarget.min - 6,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  chipActive: {
    backgroundColor: colors.primary600,
  },
  chipLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  chipLabelActive: {
    color: colors.textInverse,
  },
});
