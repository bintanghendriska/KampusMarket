import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface StatusViewProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  children?: React.ReactNode;
}

export function StatusView({ icon, title, message, children }: StatusViewProps) {
  return (
    <View style={styles.container}>
      {!!icon && (
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={28} color={colors.primary} />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
