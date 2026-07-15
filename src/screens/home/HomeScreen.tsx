import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { ProductCardSkeleton } from '../../components/product/ProductCardSkeleton';
import { CategoryFilter, ALL_CATEGORIES_VALUE } from '../../components/product/CategoryFilter';
import { ProductCard } from '../../components/product/ProductCard';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useWishlist } from '../../context/WishlistContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useProducts } from '../../hooks/useProducts';
import { strings } from '../../constants/strings';
import type { HomeScreenProps } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = HomeScreenProps;

const WIDE_SCREEN_BREAKPOINT = 700;

export function HomeScreen({ navigation }: Props) {
  const { toggleItem, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES_VALUE);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Load products based on debounced search query and category on the server
  const {
    products,
    categories,
    total,
    loading,
    refreshing,
    loadingMore,
    error,
    refetch,
    loadMore,
  } = useProducts({
    searchQuery: debouncedSearch,
    category: selectedCategory,
  });

  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;

  const handleProductPress = useCallback(
    (product: Product) => navigation.navigate('ProductDetail', { productId: product.id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.id && String(item.id).startsWith('skeleton')) {
        return <ProductCardSkeleton />;
      }
      return (
        <ProductCard
          product={item}
          onPress={handleProductPress}
          isWishlisted={isInWishlist(item.id)}
          onToggleWishlist={toggleItem}
        />
      );
    },
    [handleProductPress, isInWishlist, toggleItem],
  );

  const isInitialLoading = loading && products.length === 0;

  // Dynamic header subtitle based on active filters
  const hasActiveFilter = selectedCategory !== ALL_CATEGORIES_VALUE || debouncedSearch.trim().length > 0;
  const headerSubtitle = isInitialLoading
    ? 'Memuat produk...'
    : hasActiveFilter
      ? `Menampilkan ${products.length} hasil`
      : strings.home.subtitle(total);

  // Only show full screen error on first load when there is no data
  if (error && products.length === 0) return <ErrorState message={error} onRetry={refetch} />;

  // Display pulsing skeletons when loading is active on mount
  const dataToRender = isInitialLoading
    ? Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` }))
    : products;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.lg) }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{strings.home.title}</Text>
        <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder={strings.home.searchPlaceholder}
            placeholderTextColor={colors.textMuted}
            value={searchInput}
            onChangeText={setSearchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={strings.home.searchPlaceholder}
          />
          {searchInput.length > 0 && (
            <Pressable
              onPress={() => setSearchInput('')}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Bersihkan pencarian"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      <FlatList
        key={numColumns}
        data={dataToRender}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title={strings.home.emptyTitle}
            message={strings.home.emptyMessage}
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        removeClippedSubviews={Platform.OS === 'android'} // Android-only optimization (Finding #40)
        onEndReached={isInitialLoading ? undefined : loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
            enabled={!isInitialLoading}
          />
        }
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
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchTarget.min + 4,
    backgroundColor: colors.neutral100,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  listContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  footerLoader: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
