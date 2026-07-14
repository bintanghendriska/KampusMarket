import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../../components/common/CustomInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors } from '../../constants/colors';
import { DEMO_CREDENTIALS } from '../../constants/endpoints';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/apiClient';
import { authService } from '../../services/authService';
import { localAccountStore } from '../../services/localAccountStore';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateLoginForm,
  type LoginFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState(route.params?.prefillUsername ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [justRegistered] = useState(!!route.params?.prefillUsername);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateLoginForm({ username, password });
    setErrors(validationErrors);
    setApiError(null);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const trimmedUsername = username.trim();

      const localAccount = await localAccountStore.findByUsername(trimmedUsername);
      if (localAccount) {
        if (localAccount.password !== password) {
          setApiError('Username atau password salah');
          return;
        }
        login({
          id: localAccount.id,
          username: localAccount.username,
          email: localAccount.email,
          firstName: localAccount.name,
          lastName: '',
          accessToken: 'local-session',
        });
        return;
      }

      const user = await authService.login({ username: trimmedUsername, password });
      login(user);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Username atau password salah');
    } finally {
      setIsSubmitting(false);
    }
  }, [username, password, login]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandMark}>
          <Ionicons name="bag-handle" size={26} color={colors.textInverse} />
        </View>

        <Text style={styles.title}>Selamat datang kembali</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan belanja Anda</Text>

        <View style={styles.form}>
          {justRegistered && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>
                Registrasi berhasil. Masukkan password Anda untuk masuk.
              </Text>
            </View>
          )}

          <CustomInput
            label="Username"
            placeholder="Masukkan username"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <CustomInput
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
          />

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <View style={styles.submitButton}>
            <PrimaryButton label="Masuk" onPress={handleSubmit} loading={isSubmitting} />
          </View>

          <Text style={styles.hint}>
            Belum daftar? Coba akun demo{' '}
            <Text style={styles.hintStrong}>
              {DEMO_CREDENTIALS.username} / {DEMO_CREDENTIALS.password}
            </Text>
          </Text>
        </View>

        <PrimaryButton
          label="Belum punya akun? Daftar"
          onPress={() => navigation.navigate('Register')}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.successSurface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  successText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
  },
  hint: {
    ...typography.small,
    color: colors.textMuted,
  },
  hintStrong: {
    ...typography.small,
    fontFamily: typography.caption.fontFamily,
    color: colors.textSecondary,
  },
  apiError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
});
