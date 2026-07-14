import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductCard } from '../../components/product/ProductCard';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useWishlist } from '../../context/WishlistContext';
import type { MainTabParamList } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = BottomTabScreenProps<MainTabParamList, 'Wishlist'>;

const WIDE_SCREEN_BREAKPOINT = 700;

export function WishlistScreen({ navigation }: Props) {
  const { items, toggleItem, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions();
  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('HomeTab', {
        screen: 'ProductDetail',
        params: { productId: product.id },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={handleProductPress}
        isWishlisted={isInWishlist(item.id)}
        onToggleWishlist={toggleItem}
      />
    ),
    [handleProductPress, isInWishlist, toggleItem],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist Saya</Text>
        <Text style={styles.headerSubtitle}>
          {items.length > 0 ? `${items.length} produk disimpan` : 'Belum ada produk disimpan'}
        </Text>
      </View>
      <FlatList
        key={numColumns}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Wishlist masih kosong"
            message="Tambahkan produk favorit Anda dari katalog"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  listContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
