import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './Button';
import { StatusView } from './StatusView';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <StatusView
            icon="alert-circle-outline"
            title="Ada Masalah Sistem"
            message={this.state.error?.message || 'Terjadi kesalahan sistem yang tidak terduga.'}
          >
            <View style={styles.buttonWrapper}>
              <Button label="Muat Ulang Aplikasi" onPress={this.handleReset} />
            </View>
          </StatusView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonWrapper: {
    marginTop: spacing.xl,
    minWidth: 200,
  },
});
