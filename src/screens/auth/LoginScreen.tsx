import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../../components/common/CustomInput';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors } from '../../constants/colors';
import { DEMO_CREDENTIALS } from '../../constants/endpoints';
import { fontSize, spacing } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/apiClient';
import { authService } from '../../services/authService';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateLoginForm,
  type LoginFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateLoginForm({ username, password });
    setErrors(validationErrors);
    setApiError(null);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const user = await authService.login({ username: username.trim(), password });
      login(user);
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Login gagal, coba lagi.');
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
      >
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan belanja</Text>

        <View style={styles.form}>
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

          <Text style={styles.hint}>
            Akun demo: {DEMO_CREDENTIALS.username} / {DEMO_CREDENTIALS.password}
          </Text>

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <View style={styles.submitButton}>
            <PrimaryButton label="Masuk" onPress={handleSubmit} loading={isSubmitting} />
          </View>

          <PrimaryButton
            label="Belum punya akun? Daftar"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
          />
        </View>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  apiError: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: spacing.md,
  },
});
