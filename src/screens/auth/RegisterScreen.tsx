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
import { localAccountStore } from '../../services/localAccountStore';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateRegisterForm,
  type RegisterFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateRegisterForm({ name, username, email, password });
    setApiError(null);

    setIsSubmitting(true);
    try {
      const trimmedUsername = username.trim();

      if (!validationErrors.username && trimmedUsername) {
        const existing = await localAccountStore.findByUsername(trimmedUsername);
        if (existing) {
          validationErrors.username = 'Username sudah digunakan, pilih username lain';
        }
      }

      setErrors(validationErrors);
      if (!isFormValid(validationErrors)) return;

      // Demonstrates a real DummyJSON network call (loading/success/error state);
      // see README for why this alone cannot make Login succeed afterwards.
      await authService.register({
        name: name.trim(),
        username: trimmedUsername,
        email: email.trim(),
        password,
      });

      // Persist locally so Login can actually authenticate this account.
      await localAccountStore.save({
        id: Date.now(),
        username: trimmedUsername,
        password,
        name: name.trim(),
        email: email.trim(),
      });

      navigation.navigate('Login', { prefillUsername: trimmedUsername });
    } catch (error) {
      setApiError(error instanceof ApiError ? error.message : 'Registrasi gagal, coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [name, username, email, password, navigation]);

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
            label="Username"
            placeholder="Buat username untuk login"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
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
  submitButton: {
    marginBottom: spacing.md,
  },
});
