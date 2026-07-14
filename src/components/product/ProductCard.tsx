import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

function ProductCardComponent({
  product,
  onPress,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <Pressable
        style={styles.card}
        onPress={() => onPress(product)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail ${product.title}`}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
          <Pressable
            style={styles.wishlistButton}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isWishlisted
                ? `Hapus ${product.title} dari wishlist`
                : `Tambah ${product.title} ke wishlist`
            }
            onPress={() => onToggleWishlist(product)}
          >
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={16}
              color={isWishlisted ? colors.danger : colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <View style={styles.footerRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={colors.warning} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const ProductCard = React.memo(ProductCardComponent);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.neutral100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 36,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    ...typography.subtitle,
    fontSize: 16,
    color: colors.primary600,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
