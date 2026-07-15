import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { ProductImage } from '../common/ProductImage';
import { formatPrice } from '../../utils/format';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

const WIDE_SCREEN_BREAKPOINT = 700;

function ProductCardComponent({
  product,
  onPress,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation(0.98);
  const { width } = useWindowDimensions();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;
  
  // Padding horizontal on listContent is spacing.lg (24pt) * 2 = 48pt.
  // Gap between columns is spacing.md (16pt).
  const totalPadding = 48;
  const totalGaps = (numColumns - 1) * 16;
  const maxWidth = (width - totalPadding - totalGaps) / numColumns;

  return (
    <Animated.View style={[styles.wrapper, { maxWidth }, animatedStyle]}>
      <Pressable
        style={styles.card}
        onPress={() => onPress(product)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail ${product.title}`}
      >
        <View style={styles.imageWrapper}>
          <ProductImage uri={product.thumbnail} style={styles.image} resizeMode="cover" />
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
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
              {product.discountPercentage > 0 && (
                <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
              )}
            </View>
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
    ...typography.bodySmallMedium,
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
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  price: {
    ...typography.subtitle,
    fontSize: 15,
    color: colors.primary,
  },
  originalPrice: {
    ...typography.small,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    fontSize: 11,
    marginTop: 1,
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
