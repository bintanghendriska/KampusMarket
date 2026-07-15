import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomInput } from '../../components/common/CustomInput';
import { Button } from '../../components/common/Button';
import { colors } from '../../constants/colors';
import { DEMO_CREDENTIALS } from '../../constants/endpoints';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { strings } from '../../constants/strings';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateLoginForm,
  type LoginFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation, route }: Props) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  // Monitor navigation params for Register -> Login handoff (prefill + banner)
  useEffect(() => {
    if (route.params?.prefillUsername) {
      setUsername(route.params.prefillUsername);
      setJustRegistered(true);
      // Clean params so banner doesn't persist on subsequent states
      navigation.setParams({ prefillUsername: undefined });
    }
  }, [route.params?.prefillUsername, navigation]);

  const handleUsernameChange = useCallback((val: string) => {
    setUsername(val);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
    setApiError(null);
  }, [errors.username]);

  const handlePasswordChange = useCallback((val: string) => {
    setPassword(val);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    setApiError(null);
  }, [errors.password]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateLoginForm({ username, password });
    setErrors(validationErrors);
    setApiError(null);
    setJustRegistered(false);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : strings.api.invalidCredentials);
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

        <Text style={styles.title}>{strings.auth.loginTitle}</Text>
        <Text style={styles.subtitle}>{strings.auth.loginSubtitle}</Text>

        <View style={styles.form}>
          {justRegistered && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>
                {strings.auth.registerSuccessBanner}
              </Text>
            </View>
          )}

          <CustomInput
            label={strings.auth.labelUsername}
            placeholder={strings.auth.placeholderUsername}
            value={username}
            onChangeText={handleUsernameChange}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <CustomInput
            ref={passwordRef}
            label={strings.auth.labelPassword}
            placeholder={strings.auth.placeholderPassword}
            value={password}
            onChangeText={handlePasswordChange}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />

          {!!apiError && <Text style={styles.apiError}>{apiError}</Text>}

          <View style={styles.submitButton}>
            <Button label={strings.auth.loginButton} onPress={handleSubmit} loading={isSubmitting} />
          </View>

          {__DEV__ && (
            <Text style={styles.hint}>
              {strings.auth.loginDemoHint}
              <Text style={styles.hintStrong}>
                {DEMO_CREDENTIALS.username} / {DEMO_CREDENTIALS.password}
              </Text>
            </Text>
          )}
        </View>

        <Button
          label={strings.auth.loginRegisterLink}
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
    backgroundColor: colors.primary,
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
