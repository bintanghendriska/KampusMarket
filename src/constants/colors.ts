export const colors = {
  // Neutral scale — cool gray base for a clean, minimal canvas.
  neutral0: '#FFFFFF',
  neutral50: '#FAFAFA',
  neutral100: '#F4F4F5',
  neutral200: '#E4E4E7',
  neutral300: '#D4D4D8',
  neutral400: '#A1A1AA',
  neutral500: '#71717A',
  neutral600: '#52525B',
  neutral700: '#3F3F46',
  neutral800: '#27272A',
  neutral900: '#18181B',

  // Accent — single blue used sparingly for actions and focus states.
  primary50: '#EFF6FF',
  primary100: '#DBEAFE',
  primary500: '#3B82F6',
  primary600: '#2563EB',
  primary700: '#1D4ED8',

  // Semantic
  success: '#16A34A',
  successSurface: '#F0FDF4',
  danger: '#DC2626',
  dangerSurface: '#FEF2F2',
  warning: '#D97706',

  // Surfaces & text
  background: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E4E4E7',
  overlay: 'rgba(24, 24, 27, 0.45)',

  textPrimary: '#18181B',
  textSecondary: '#52525B',
  textMuted: '#A1A1AA',
  textInverse: '#FFFFFF',

  // Convenience alias for the single accent color used across components.
  primary: '#2563EB',
} as const;
