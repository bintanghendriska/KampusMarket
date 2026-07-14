import React from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { usePressAnimation } from '../../hooks/usePressAnimation';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const labelColor = labelColorByVariant[variant];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={[styles.base, variantStyles[variant], isDisabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary600} />
        ) : (
          <>
            {!!icon && <Ionicons name={icon} size={18} color={labelColor} style={styles.icon} />}
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.min + 4,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    ...typography.bodyMedium,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary600,
    ...shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.danger,
    ...shadows.sm,
  },
  ghost: {
    backgroundColor: 'transparent',
    minHeight: touchTarget.min,
  },
});

const labelColorByVariant: Record<ButtonVariant, string> = {
  primary: colors.textInverse,
  outline: colors.textPrimary,
  danger: colors.textInverse,
  ghost: colors.primary600,
};
