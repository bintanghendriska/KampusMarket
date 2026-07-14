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
import { fontSize, spacing } from '../../constants/spacing';
import { ApiError } from '../../services/apiClient';
import { authService } from '../../services/authService';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateRegisterForm,
  type RegisterFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateRegisterForm({ name, email, password });
    setErrors(validationErrors);
    setApiError(null);
    setSuccessMessage(null);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await authService.register({ name: name.trim(), email: email.trim(), password });
      setSuccessMessage('Registrasi berhasil! Silakan masuk menggunakan akun demo di halaman login.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Registrasi gagal, coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, password]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Buat Akun</Text>
        <Text style={styles.subtitle}>Daftar untuk mulai berbelanja</Text>

        <View style={styles.form}>
          <CustomInput
            label="Nama"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />
          <CustomInput
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
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
          {!!successMessage && <Text style={styles.successText}>{successMessage}</Text>}

          <View style={styles.submitButton}>
            <PrimaryButton label="Daftar" onPress={handleSubmit} loading={isSubmitting} />
          </View>

          <PrimaryButton
            label="Sudah punya akun? Masuk"
            onPress={() => navigation.navigate('Login')}
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
  apiError: {
    color: colors.danger,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successText: {
    color: colors.success,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginBottom: spacing.md,
  },
});
