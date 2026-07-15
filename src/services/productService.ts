import { apiClient } from './apiClient';
import { endpoints } from '../constants/endpoints';
import type { Product, ProductCategory, ProductListResponse } from '../types/product.types';

export const productService = {
  getProducts: (limit = 0, skip = 0, signal?: AbortSignal) =>
    apiClient.get<ProductListResponse>(
      `${endpoints.products}?limit=${limit}&skip=${skip}`,
      { signal }
    ),

  getProductById: (id: number, signal?: AbortSignal) =>
    apiClient.get<Product>(endpoints.productById(id), { signal }),

  getCategories: (signal?: AbortSignal) =>
    apiClient.get<ProductCategory[]>(endpoints.productCategories, { signal }),

  searchProducts: (query: string, limit = 0, skip = 0, signal?: AbortSignal) =>
    apiClient.get<ProductListResponse>(
      `${endpoints.products}/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
      { signal }
    ),

  getProductsByCategory: (category: string, limit = 0, skip = 0, signal?: AbortSignal) =>
    apiClient.get<ProductListResponse>(
      `${endpoints.products}/category/${category}?limit=${limit}&skip=${skip}`,
      { signal }
    ),
};
