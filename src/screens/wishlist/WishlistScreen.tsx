import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductCard } from '../../components/product/ProductCard';
import { colors } from '../../constants/colors';
import { radius, spacing, touchTarget } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useWishlist } from '../../context/WishlistContext';
import { strings } from '../../constants/strings';
import type { WishlistScreenProps } from '../../navigation/types';
import type { Product } from '../../types/product.types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = WishlistScreenProps;

const WIDE_SCREEN_BREAKPOINT = 700;
const SNACKBAR_TIMEOUT_MS = 4000;

export function WishlistScreen({ navigation }: Props) {
  const { items, toggleItem, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const numColumns = width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2;

  // Snackbar states
  const [lastRemovedProduct, setLastRemovedProduct] = useState<Product | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const snackbarOpacity = useRef(new Animated.Value(0)).current;
  const snackbarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (snackbarTimeoutRef.current) {
        clearTimeout(snackbarTimeoutRef.current);
      }
    };
  }, []);

  const hideSnackbar = useCallback(() => {
    Animated.timing(snackbarOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSnackbarVisible(false);
      setLastRemovedProduct(null);
    });
  }, [snackbarOpacity]);

  const showSnackbar = useCallback((product: Product) => {
    // Clear any existing timer
    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }

    setLastRemovedProduct(product);
    setSnackbarVisible(true);

    // Fade in
    Animated.timing(snackbarOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after timeout
    snackbarTimeoutRef.current = setTimeout(() => {
      hideSnackbar();
    }, SNACKBAR_TIMEOUT_MS);
  }, [snackbarOpacity, hideSnackbar]);

  const handleToggleWishlist = useCallback((product: Product) => {
    const isRemoving = isInWishlist(product.id);

    // Trigger vibration haptic feedback (very subtle, single pulse)
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    } else {
      Vibration.vibrate(15);
    }

    // Configure layout animation for list row transitions
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (isRemoving) {
      showSnackbar(product);
    }

    toggleItem(product);
  }, [isInWishlist, toggleItem, showSnackbar]);

  const handleUndoRemove = useCallback(() => {
    if (!lastRemovedProduct) return;

    // Pulse vibration again
    Vibration.vibrate(10);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleItem(lastRemovedProduct);
    
    // Instantly hide snackbar
    if (snackbarTimeoutRef.current) {
      clearTimeout(snackbarTimeoutRef.current);
    }
    setSnackbarVisible(false);
    setLastRemovedProduct(null);
    snackbarOpacity.setValue(0);
  }, [lastRemovedProduct, toggleItem, snackbarOpacity]);

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onPress={handleProductPress}
        isWishlisted={isInWishlist(item.id)}
        onToggleWishlist={handleToggleWishlist}
      />
    ),
    [handleProductPress, isInWishlist, handleToggleWishlist],
  );

  const headerSubtitle = items.length > 0 
    ? strings.wishlist.count(items.length) 
    : strings.wishlist.emptyCount;

  return (
    <View style={styles.container}>
      <View style={[styles.headerWrapper, { paddingTop: Math.max(insets.top, spacing.lg) }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{strings.wishlist.title}</Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
        </View>
      </View>
      <FlatList
        key={numColumns}
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[styles.listContent, { paddingBottom: spacing.xxl + 40 }]}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title={strings.wishlist.emptyTitle}
            message={strings.wishlist.emptyMessage}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Undo Snackbar Overlay */}
      {snackbarVisible && lastRemovedProduct && (
        <Animated.View
          style={[
            styles.snackbar,
            {
              bottom: insets.bottom + spacing.md,
              opacity: snackbarOpacity,
              transform: [
                {
                  translateY: snackbarOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.snackbarText} numberOfLines={1}>
            {strings.wishlist.removedFromWishlist}
          </Text>
          <Pressable
            style={styles.undoButton}
            onPress={handleUndoRemove}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Urungkan penghapusan dari wishlist"
          >
            <Text style={styles.undoText}>{strings.wishlist.undo}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  listContent: {
    flexGrow: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  snackbar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.textPrimary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: touchTarget.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  snackbarText: {
    ...typography.body,
    color: colors.textInverse,
    flex: 1,
  },
  undoButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  undoText: {
    ...typography.bodyMedium,
    color: colors.primary50,
  },
});
