import React, { useCallback, useState, useRef } from 'react';
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
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { strings } from '../../constants/strings';
import type { AuthStackParamList } from '../../navigation/types';
import {
  isFormValid,
  validateRegisterForm,
  type RegisterFormErrors,
} from '../../utils/validation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleNameChange = useCallback((val: string) => {
    setName(val);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    setApiError(null);
  }, [errors.name]);

  const handleUsernameChange = useCallback((val: string) => {
    setUsername(val);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: undefined }));
    }
    setApiError(null);
  }, [errors.username]);

  const handleEmailChange = useCallback((val: string) => {
    setEmail(val);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    setApiError(null);
  }, [errors.email]);

  const handlePasswordChange = useCallback((val: string) => {
    setPassword(val);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    setApiError(null);
  }, [errors.password]);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateRegisterForm({ name, username, email, password });
    setErrors(validationErrors);
    setApiError(null);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    try {
      const trimmedUsername = username.trim();
      await register({
        name: name.trim(),
        username: trimmedUsername,
        email: email.trim(),
        password,
      });

      navigation.navigate('Login', { prefillUsername: trimmedUsername });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : strings.api.registerFailed);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, username, email, password, navigation, register]);

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

        <Text style={styles.title}>{strings.auth.registerTitle}</Text>
        <Text style={styles.subtitle}>{strings.auth.registerSubtitle}</Text>

        <View style={styles.form}>
          <CustomInput
            label={strings.auth.labelName}
            placeholder={strings.auth.placeholderName}
            value={name}
            onChangeText={handleNameChange}
            error={errors.name}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => usernameRef.current?.focus()}
          />
          <CustomInput
            ref={usernameRef}
            label={strings.auth.labelUsername}
            placeholder={strings.auth.placeholderRegisterUsername}
            value={username}
            onChangeText={handleUsernameChange}
            error={errors.username}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <CustomInput
            ref={emailRef}
            label={strings.auth.labelEmail}
            placeholder={strings.auth.placeholderEmail}
            value={email}
            onChangeText={handleEmailChange}
            error={errors.email}
            keyboardType="email-address"
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
            <Button label={strings.auth.registerButton} onPress={handleSubmit} loading={isSubmitting} />
          </View>
        </View>

        <Button
          label={strings.auth.registerLoginLink}
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
