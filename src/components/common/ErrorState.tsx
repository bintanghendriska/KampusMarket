import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../../constants/spacing';
import { Button } from './Button';
import { StatusView } from './StatusView';
import { strings } from '../../constants/strings';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StatusView icon="cloud-offline-outline" title={message}>
      {!!onRetry && (
        <View style={styles.retryButton}>
          <Button label={strings.retry} onPress={onRetry} variant="outline" />
        </View>
      )}
    </StatusView>
  );
}

const styles = StyleSheet.create({
  retryButton: {
    marginTop: spacing.lg,
    minWidth: 160,
  },
});
