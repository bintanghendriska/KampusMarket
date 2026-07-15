import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';
import { authService } from '../services/authService';
import { localAccountStore } from '../services/localAccountStore';
import { registerTokenProvider, ApiError } from '../services/apiClient';
import { sha256 } from '../utils/crypto';
import { strings } from '../constants/strings';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Restore session from AsyncStorage on startup
  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const rawUser = await AsyncStorage.getItem('uasprak:session');
        if (rawUser) {
          const parsed = JSON.parse(rawUser) as AuthUser;
          setUser(parsed);
        }
      } catch (e) {
        console.error('Failed to hydrate session', e);
      } finally {
        setIsHydrating(false);
      }
    };
    hydrateSession();
  }, []);

  // Sync auth token provider for ApiClient headers
  useEffect(() => {
    registerTokenProvider(() => (user ? user.accessToken : null));
  }, [user]);

  const login = useCallback(async (payload: LoginPayload) => {
    const trimmedUsername = payload.username.trim();

    // Check local accounts first
    const localAccount = await localAccountStore.findByUsername(trimmedUsername);
    if (localAccount) {
      if (localAccount.password !== sha256(payload.password)) {
        throw new ApiError(strings.api.invalidCredentials, 401);
      }

      const loggedUser: AuthUser = {
        id: localAccount.id,
        username: localAccount.username,
        email: localAccount.email,
        firstName: localAccount.name,
        lastName: '',
        accessToken: 'local-session',
      };

      await AsyncStorage.setItem('uasprak:session', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return;
    }

    // Call DummyJSON real login endpoint
    try {
      const remoteUser = await authService.login({
        username: trimmedUsername,
        password: payload.password,
      });
      await AsyncStorage.setItem('uasprak:session', JSON.stringify(remoteUser));
      setUser(remoteUser);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(strings.api.invalidCredentials, 401);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const trimmedUsername = payload.username.trim();

    // Prevent local account username conflict
    const existingLocal = await localAccountStore.findByUsername(trimmedUsername);
    if (existingLocal) {
      throw new ApiError(strings.validation.usernameTaken, 400);
    }

    try {
      // Simulate API registration call (DummyJSON user mock add)
      await authService.register({
        name: payload.name.trim(),
        username: trimmedUsername,
        email: payload.email.trim(),
        password: payload.password,
      });

      // Save user record securely to local store (hashing done internally in save)
      await localAccountStore.save({
        id: Date.now(),
        username: trimmedUsername,
        password: payload.password,
        name: payload.name.trim(),
        email: payload.email.trim(),
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(strings.api.registerFailed, 400);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('uasprak:session');
    } catch (e) {
      console.error('Failed to clear session during logout', e);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isHydrating,
      login,
      register,
      logout,
    }),
    [user, isHydrating, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}
