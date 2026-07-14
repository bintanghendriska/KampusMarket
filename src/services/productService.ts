import { apiClient } from './apiClient';
import { endpoints } from '../constants/endpoints';
import type { Product, ProductCategory, ProductListResponse } from '../types/product.types';

export const productService = {
  getProducts: (limit = 100) =>
    apiClient.get<ProductListResponse>(`${endpoints.products}?limit=${limit}`),

  getProductById: (id: number) => apiClient.get<Product>(endpoints.productById(id)),

  getCategories: () => apiClient.get<ProductCategory[]>(endpoints.productCategories),
};
