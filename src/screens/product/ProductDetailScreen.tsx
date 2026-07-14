import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors } from '../../constants/colors';
import { fontSize, radius, spacing } from '../../constants/spacing';
import { useWishlist } from '../../context/WishlistContext';
import { ApiError } from '../../services/apiClient';
import { productService } from '../../services/productService';
import type { HomeStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route }: Props) {
  const { productId } = route.params;
  const { toggleItem, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProductById(productId);
      setProduct(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat detail produk');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // Fetch-on-mount: same intentional pattern as useProducts (see its comment).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProduct();
  }, [loadProduct]);

  if (loading) return <LoadingState message="Memuat detail produk..." />;
  if (error || !product) return <ErrorState message={error ?? 'Produk tidak ditemukan'} onRetry={loadProduct} />;

  const wishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.category}>{product.category}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.title}>{product.title}</Text>
        {!!product.brand && <Text style={styles.brand}>{product.brand}</Text>}

        <View style={styles.priceRow}>
          <Text style={styles.price}>${discountedPrice.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
          )}
        </View>

        <Text style={styles.stock}>
          {product.stock > 0 ? `Stok tersedia: ${product.stock}` : 'Stok habis'}
        </Text>

        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.wishlistButton}>
          <PrimaryButton
            label={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            onPress={() => toggleItem(product)}
            variant={wishlisted ? 'danger' : 'primary'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  brand: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stock: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  wishlistButton: {
    marginTop: spacing.xl,
  },
});
