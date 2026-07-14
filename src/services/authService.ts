import { apiClient } from './apiClient';
import { endpoints } from '../constants/endpoints';
import type { AuthUser, LoginPayload, RegisterPayload, RegisteredUser } from '../types/auth.types';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthUser>(endpoints.login, {
      username: payload.username,
      password: payload.password,
      expiresInMins: 60,
    }),

  // DummyJSON tidak benar-benar menyimpan user baru ke database autentikasinya,
  // endpoint ini hanya mensimulasikan pembuatan resource (lihat README bagian "Catatan Auth").
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisteredUser>(endpoints.registerUser, {
      firstName: payload.name,
      email: payload.email,
      password: payload.password,
    }),
};
