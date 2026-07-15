export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

// A small, deliberate type scale — every text style in the app should come
// from here so headings, body copy, and captions stay consistent.
export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28 },
  subtitle: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 24 },
  bodyMedium: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodySmallMedium: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
} as const;
