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
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
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

      await authService.register({
        name: name.trim(),
        username: trimmedUsername,
        email: email.trim(),
        password,
      });

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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandMark}>
          <Ionicons name="person-add" size={24} color={colors.textInverse} />
        </View>

        <Text style={styles.title}>Buat akun baru</Text>
        <Text style={styles.subtitle}>Isi data di bawah untuk mulai berbelanja</Text>

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
        </View>

        <PrimaryButton
          label="Sudah punya akun? Masuk"
          onPress={() => navigation.navigate('Login')}
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
