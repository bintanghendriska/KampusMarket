import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { colors } from '../../constants/colors';
import { fontSize, radius, spacing } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { items } = useWishlist();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={40} color={colors.textInverse} />
          </View>
        )}
      </View>

      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.statsCard}>
        <Text style={styles.statsValue}>{items.length}</Text>
        <Text style={styles.statsLabel}>Produk di Wishlist</Text>
      </View>

      <View style={styles.logoutButton}>
        <PrimaryButton label="Logout" onPress={logout} variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: spacing.xl,
  },
  avatarWrapper: {
    marginTop: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  statsLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  logoutButton: {
    width: '100%',
    marginTop: 'auto',
  },
});
