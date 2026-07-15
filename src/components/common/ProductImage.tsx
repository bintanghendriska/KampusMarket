import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface ProductImageProps {
  uri: string;
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

export function ProductImage({ uri, style, resizeMode = 'cover' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const contentFit = resizeMode === 'stretch' ? 'fill' : resizeMode;

  if (hasError || !uri) {
    return (
      <View style={[styles.fallbackContainer, style]}>
        <Ionicons name="image-outline" size={32} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFillObject, style]}
        contentFit={contentFit}
        transition={200}
        cachePolicy="disk"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.neutral100,
  },
  fallbackContainer: {
    backgroundColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 244, 245, 0.5)',
  },
});
