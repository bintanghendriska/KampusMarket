// 8-point spacing system (4 kept as a half-step for fine adjustments).
export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

// 16–24px rounded corners for cards/buttons; full for pills/avatars.
export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const touchTarget = {
  min: 44,
} as const;
