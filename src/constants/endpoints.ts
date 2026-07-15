const BASE_URL = 'https://dummyjson.com';

export const endpoints = {
  login: `${BASE_URL}/auth/login`,
  registerUser: `${BASE_URL}/users/add`,
  products: `${BASE_URL}/products`,
  productById: (id: number | string) => `${BASE_URL}/products/${id}`,
  productCategories: `${BASE_URL}/products/categories`,
};

export { DEMO_CREDENTIALS } from './demo';
