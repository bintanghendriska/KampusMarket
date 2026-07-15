import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { usePressAnimation } from '../../hooks/usePressAnimation';

export type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation();
  const labelColor = labelColorByVariant[variant];

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={[
          styles.base,
          variantStyles[variant],
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
      >
        {/* Invisible layout helper to preserve button width during loading */}
        <View style={[styles.contentRow, loading && styles.hidden]}>
          {!!icon && <Ionicons name={icon} size={18} color={labelColor} style={styles.icon} />}
          <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        </View>

        {loading && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <ActivityIndicator
              color={
                variant === 'primary' || variant === 'danger'
                  ? colors.textInverse
                  : colors.primary
              }
            />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// Temporary alias-export to avoid breaking existing imports before refactoring
export { Button as PrimaryButton };

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.min + 4,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
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
    backgroundColor: colors.primary,
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
  ghost: colors.primary,
};
