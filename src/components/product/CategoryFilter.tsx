import React, { useMemo } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { strings } from '../../constants/strings';
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

const CategoryChip = React.memo(({
  label,
  isActive,
  onSelect,
}: {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={onSelect}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={{ top: 3, bottom: 3, left: 0, right: 0 }}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
});

CategoryChip.displayName = 'CategoryChip';

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const data = useMemo(() => [
    { slug: ALL_CATEGORIES_VALUE, name: strings.home.categoryAll, url: '' },
    ...categories
  ], [categories]);

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
    backgroundColor: colors.primary,
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
