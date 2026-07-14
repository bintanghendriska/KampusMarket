import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { useWishlist } from '../../context/WishlistContext';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { ApiError } from '../../services/apiClient';
import { productService } from '../../services/productService';
import type { HomeStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

function FloatingIconButton({
  icon,
  color,
  onPress,
  accessibilityLabel,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={styles.floatingButton}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={8}
      >
        <Ionicons name={icon} size={20} color={color} />
      </Pressable>
    </Animated.View>
  );
}

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { toggleItem, isInWishlist } = useWishlist();
  const insets = useSafeAreaInsets();

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
    loadProduct();
  }, [loadProduct]);

  if (loading) return <LoadingState message="Memuat detail produk..." />;
  if (error || !product) return <ErrorState message={error ?? 'Produk tidak ditemukan'} onRetry={loadProduct} />;

  const wishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.sheet}>
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
        </View>
      </ScrollView>

      <View style={[styles.floatingHeader, { top: insets.top + spacing.xs }]}>
        <FloatingIconButton
          icon="chevron-back"
          color={colors.textPrimary}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Kembali"
        />
        <FloatingIconButton
          icon={wishlisted ? 'heart' : 'heart-outline'}
          color={wishlisted ? colors.danger : colors.textPrimary}
          onPress={() => toggleItem(product)}
          accessibilityLabel={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
        />
      </View>

      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View>
          <Text style={styles.ctaLabel}>Harga</Text>
          <Text style={styles.ctaPrice}>${discountedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.ctaButton}>
          <PrimaryButton
            label={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            onPress={() => toggleItem(product)}
            variant={wishlisted ? 'danger' : 'primary'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    padding: spacing.lg,
  },
  floatingHeader: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    ...typography.caption,
    color: colors.primary600,
    textTransform: 'capitalize',
    backgroundColor: colors.primary50,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  ratingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  brand: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  price: {
    ...typography.display,
    color: colors.primary600,
  },
  originalPrice: {
    ...typography.body,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stock: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  ctaBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    ...shadows.lg,
  },
  ctaLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  ctaPrice: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  ctaButton: {
    flex: 1,
  },
});
