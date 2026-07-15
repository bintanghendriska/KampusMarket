const palette = {
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
};

export const colors = {
  // Base Palette (exposed for direct access if needed)
  ...palette,

  // Semantic mappings (theme bindings)
  background: palette.neutral50,
  surface: palette.neutral0,
  border: palette.neutral200,
  overlay: 'rgba(24, 24, 27, 0.45)',

  textPrimary: palette.neutral900,
  textSecondary: palette.neutral600,
  textMuted: palette.neutral400,
  textInverse: palette.neutral0,

  // Unified accent color token (removed primary600 alias in favor of a single name)
  primary: palette.primary600,
} as const;

