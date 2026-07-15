import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { Button } from '../../components/common/Button';
import { ProductImage } from '../../components/common/ProductImage';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { useWishlist } from '../../context/WishlistContext';
import { usePressAnimation } from '../../hooks/usePressAnimation';
import { formatPrice } from '../../utils/format';
import { ApiError } from '../../services/apiClient';
import { productService } from '../../services/productService';
import { strings } from '../../constants/strings';
import type { ProductDetailScreenProps } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = ProductDetailScreenProps;

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
  const { width } = useWindowDimensions();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Image gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Dynamic padding based on measured CTA bar height
  const [ctaBarHeight, setCtaBarHeight] = useState(100);

  const loadProduct = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProductById(productId, signal);
      setProduct(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof ApiError ? err.message : strings.detail.loadDetailError);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();
    loadProduct(controller.signal);
    return () => {
      controller.abort();
    };
  }, [loadProduct]);

  const handleScroll = useCallback((event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    if (slideSize <= 0) return;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  }, []);

  const handleCtaLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setCtaBarHeight(height);
    }
  }, []);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    Alert.alert(
      'Pembelian Berhasil',
      `Terima kasih telah membeli ${product.title}. Fitur checkout akan segera hadir!`,
      [{ text: 'OK' }]
    );
  }, [product]);

  if (loading) return <LoadingState message={strings.loading} />;
  if (error || !product) {
    return (
      <ErrorState
        message={error ?? strings.detail.productNotFound}
        onRetry={loadProduct}
      />
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const imagesData = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: ctaBarHeight + spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Image Gallery */}
        <View style={[styles.galleryContainer, { width }]}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={imagesData}
            keyExtractor={(item, index) => `${item}-${index}`}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <ProductImage uri={item} style={{ width, height: width }} resizeMode="cover" />
            )}
          />
          {/* Dot indicators */}
          {imagesData.length > 1 && (
            <View style={styles.dotsContainer}>
              {imagesData.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeImageIndex === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Sheet */}
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
            <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
            {product.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
            )}
          </View>

          <Text style={styles.stock}>
            {product.stock > 0 ? strings.detail.stockAvailable(product.stock) : strings.detail.stockEmpty}
          </Text>

          <Text style={styles.sectionTitle}>{strings.detail.descriptionTitle}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Floating header controls */}
      <View style={[styles.floatingHeader, { top: insets.top + spacing.xs }]}>
        <FloatingIconButton
          icon="chevron-back"
          color={colors.textPrimary}
          onPress={() => navigation.goBack()}
          accessibilityLabel={strings.back}
        />
        <FloatingIconButton
          icon={wishlisted ? 'heart' : 'heart-outline'}
          color={wishlisted ? colors.danger : colors.textPrimary}
          onPress={() => toggleItem(product)}
          accessibilityLabel={wishlisted ? strings.detail.ctaRemoveWishlist : strings.detail.ctaAddWishlist}
        />
      </View>

      {/* Primary commerce CTA bar */}
      <View 
        onLayout={handleCtaLayout} 
        style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}
      >
        <View>
          <Text style={styles.ctaLabel}>{strings.detail.ctaPriceLabel}</Text>
          <Text style={styles.ctaPrice}>{formatPrice(discountedPrice)}</Text>
        </View>
        <View style={styles.ctaButton}>
          <Button
            label="Beli Sekarang"
            onPress={handleBuyNow}
            variant="primary"
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
  galleryContainer: {
    aspectRatio: 1,
    backgroundColor: colors.neutral100,
    position: 'relative',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dotActive: {
    backgroundColor: colors.neutral0,
    width: 12,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
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
    color: colors.primary,
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
    color: colors.primary,
  },
  originalPrice: {
    ...typography.body,
    color: colors.textSecondary, // Use textSecondary for contrast (Finding #35)
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
    color: colors.textSecondary, // Use textSecondary for contrast (Finding #35)
  },
  ctaPrice: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  ctaButton: {
    flex: 1,
  },
});
