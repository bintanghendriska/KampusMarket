import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StatusView } from './StatusView';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

export function EmptyState({ title, message, icon = 'file-tray-outline' }: EmptyStateProps) {
  return <StatusView icon={icon} title={title} message={message} />;
}
