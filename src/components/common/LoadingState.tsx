import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { StatusView } from './StatusView';
import { strings } from '../../constants/strings';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = strings.loading }: LoadingStateProps) {
  return (
    <StatusView title={message}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </StatusView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    marginTop: spacing.lg,
  },
});
