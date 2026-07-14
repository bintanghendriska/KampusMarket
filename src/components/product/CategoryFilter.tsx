import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize, radius, spacing } from '../../constants/spacing';
import type { ProductCategory } from '../../types/product.types';

export const ALL_CATEGORIES_VALUE = 'all';

interface CategoryFilterProps {
  categories: ProductCategory[];
  selected: string;
  onSelect: (categorySlug: string) => void;
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
      renderItem={({ item }) => {
        const isActive = item.slug === selected;
        return (
          <Pressable
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(item.slug)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  chipLabelActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
});
