import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomInput = React.forwardRef<TextInput, CustomInputProps>(
  ({ label, error, style, onBlur, onFocus, secureTextEntry, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
      <View style={styles.container}>
        {!!label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <TextInput
            ref={ref}
            style={[
              styles.input,
              isFocused && styles.inputFocused,
              !!error && styles.inputError,
              secureTextEntry && styles.inputPassword,
              style,
            ]}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={isSecure}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            accessibilityLabel={label}
            {...rest}
          />
          {secureTextEntry && (
            <Pressable
              style={styles.eyeButton}
              onPress={() => setIsSecure(!isSecure)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isSecure ? 'Tampilkan password' : 'Sembunyikan password'}
            >
              <Ionicons
                name={isSecure ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
        {!!error && (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
      </View>
    );
  }
);

CustomInput.displayName = 'CustomInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xxs + 2,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    minHeight: touchTarget.min + 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.neutral100,
    width: '100%',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSurface,
  },
  inputPassword: {
    paddingRight: spacing.xl + spacing.xs,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.small,
    color: colors.danger,
    marginTop: spacing.xxs,
  },
});
