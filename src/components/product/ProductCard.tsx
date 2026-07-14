import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { fontSize, radius, spacing } from '../../constants/spacing';
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
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(product)}
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
            isWishlisted ? `Hapus ${product.title} dari wishlist` : `Tambah ${product.title} ke wishlist`
          }
          onPress={() => onToggleWishlist(product)}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
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
  );
}

export const ProductCard = React.memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
    minHeight: 36,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
