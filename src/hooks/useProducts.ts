import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../services/apiClient';
import { productService } from '../services/productService';
import type { Product, ProductCategory } from '../types/product.types';

interface UseProductsResult {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(productsResponse.products);
      setCategories(categoriesResponse);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: `load` sets loading/error state at the start of an async
    // request, a standard data-fetching pattern the strict lint rule below misreads
    // as a derived-state anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { products, categories, loading, error, refetch: load };
}
