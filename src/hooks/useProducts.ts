import { useCallback, useEffect, useState, useRef } from 'react';
import { ApiError } from '../services/apiClient';
import { productService } from '../services/productService';
import type { Product, ProductCategory } from '../types/product.types';

interface UseProductsParams {
  searchQuery: string;
  category: string;
}

interface UseProductsResult {
  products: Product[];
  categories: ProductCategory[];
  total: number;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  refetch: () => void;
  loadMore: () => void;
  error: string | null;
}

const LIMIT = 20;

export function useProducts({ searchQuery, category }: UseProductsParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track pagination offset using a ref to prevent race conditions during state updates
  const skipRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategories();
        setCategories(res);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const load = useCallback(
    async (isRefresh = false, isLoadMore = false) => {
      // Abort any ongoing request before initiating a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isLoadMore) {
        setLoadingMore(true);
      } else if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const currentSkip = isLoadMore ? skipRef.current : 0;

      try {
        let res;
        if (category !== 'all') {
          res = await productService.getProductsByCategory(
            category,
            LIMIT,
            currentSkip,
            controller.signal
          );
        } else if (searchQuery.trim().length > 0) {
          res = await productService.searchProducts(
            searchQuery.trim(),
            LIMIT,
            currentSkip,
            controller.signal
          );
        } else {
          res = await productService.getProducts(LIMIT, currentSkip, controller.signal);
        }

        if (isLoadMore) {
          setProducts((prev) => {
            // Avoid duplicate items if request succeeded after parameters reset
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = res.products.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
          skipRef.current = currentSkip + res.products.length;
        } else {
          setProducts(res.products);
          skipRef.current = res.products.length;
        }
        setTotal(res.total);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled; ignore error
          return;
        }
        setError(err instanceof ApiError ? err.message : 'Gagal memuat produk');
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [category, searchQuery]
  );

  // Load first page when filters/search changes
  useEffect(() => {
    load();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [load]);

  const loadMore = useCallback(() => {
    const hasMore = products.length < total;
    if (loading || refreshing || loadingMore || !hasMore) return;
    load(false, true);
  }, [loading, refreshing, loadingMore, products.length, total, load]);

  const refetch = useCallback(() => {
    load(true, false);
  }, [load]);

  const hasMore = products.length < total;

  return {
    products,
    categories,
    total,
    loading: loading && products.length === 0,
    refreshing,
    loadingMore,
    hasMore,
    refetch,
    loadMore,
    error,
  };
}
