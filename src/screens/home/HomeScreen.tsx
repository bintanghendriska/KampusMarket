import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../../components/common/CustomInput';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingState } from '../../components/common/LoadingState';
import { CategoryFilter, ALL_CATEGORIES_VALUE } from '../../components/product/CategoryFilter';
import { ProductCard } from '../../components/product/ProductCard';
import { colors } from '../../constants/colors';
import { fontSize, spacing } from '../../constants/spacing';
import { useWishlist } from '../../context/WishlistContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useProducts } from '../../hooks/useProducts';
import type { HomeStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product.types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const WIDE_SCREEN_BREAKPOINT = 700;

export function HomeScreen({ navigation }: Props) {
  const { products, categories, loading, error, refetch } = useProducts();
  const { toggleItem, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions();

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES_VALUE);
  const debouncedSearch = useDebounce(searchInput, 300);

  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;

  const filteredProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = query.length === 0 || product.title.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES_VALUE || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, debouncedSearch, selectedCategory]);

  const handleProductPress = useCallback(
    (product: Product) => navigation.navigate('ProductDetail', { productId: product.id }),
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

  if (loading) return <LoadingState message="Memuat produk..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Katalog Produk</Text>
        <CustomInput
          placeholder="Cari produk..."
          value={searchInput}
          onChangeText={setSearchInput}
          autoCapitalize="none"
          style={styles.searchInput}
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      <FlatList
        key={numColumns}
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="Produk tidak ditemukan"
            message="Coba ubah kata kunci pencarian atau kategori"
          />
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        removeClippedSubviews
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
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
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
