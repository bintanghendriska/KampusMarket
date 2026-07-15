import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';
import { typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { strings } from '../../constants/strings';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { items } = useWishlist();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={[
        styles.content, 
        { paddingTop: Math.max(insets.top + spacing.sm, spacing.xl) }
      ]}
    >
      <Text style={styles.headerTitle}>{strings.profile.title}</Text>

      <View style={styles.avatarWrapper}>
        {user.image ? (
          <Image source={{ uri: user.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={36} color={colors.textInverse} />
          </View>
        )}
      </View>

      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.email}>{user.email}</Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.cardIcon}>
            <Ionicons name="heart" size={18} color={colors.primary} />
          </View>
          <View style={styles.cardRowText}>
            <Text style={styles.cardLabel}>{strings.profile.wishlistLabel}</Text>
            <Text style={styles.cardValue}>{strings.profile.wishlistValue(items.length)}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <View style={styles.cardIcon}>
            <Ionicons name="at" size={18} color={colors.primary} />
          </View>
          <View style={styles.cardRowText}>
            <Text style={styles.cardLabel}>{strings.profile.usernameLabel}</Text>
            <Text style={styles.cardValue}>{user.username}</Text>
          </View>
        </View>
      </View>

      <View style={styles.logoutButton}>
        <Button 
          label={strings.profile.logoutButton} 
          icon="log-out-outline" 
          onPress={logout} 
          variant="danger" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatarWrapper: {
    ...shadows.md,
    borderRadius: radius.full,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
  },
  avatarFallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  email: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xl,
    ...shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRowText: {
    flex: 1,
  },
  cardLabel: {
    ...typography.small,
    color: colors.textSecondary, // Use textSecondary for contrast (Finding #35)
  },
  cardValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  logoutButton: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
