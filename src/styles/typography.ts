export const FONT_FAMILY = 'IBM Plex Sans KR, sans-serif';

export type FontWeight = 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export type FontSize = 8 | 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 36 | 40 | 48;

export const fontWeights: Record<FontWeight, number> = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights: Record<FontSize, number> = {
  8: 1.2,
  12: 1.2,
  14: 1.2,
  16: 1.2,
  18: 1.2,
  20: 1.2,
  24: 1.2,
  28: 1.2,
  32: 1.2,
  36: 1.2,
  40: 1.2,
  48: 1.2,
} as const;

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: string;
}

export const createTypographyStyle = (
  fontSize: FontSize,
  fontWeight: FontWeight = 'regular',
  letterSpacing?: string
): TypographyStyle => ({
  fontFamily: FONT_FAMILY,
  fontSize: `${fontSize}px`,
  fontWeight: fontWeights[fontWeight],
  lineHeight: lineHeights[fontSize],
  ...(letterSpacing && { letterSpacing }),
});

export const typography = {
  text8Thin: createTypographyStyle(8, 'thin'),
  text8ExtraLight: createTypographyStyle(8, 'extraLight'),
  text8Light: createTypographyStyle(8, 'light'),
  text8Regular: createTypographyStyle(8, 'regular'),
  text8Medium: createTypographyStyle(8, 'medium'),
  text8Semibold: createTypographyStyle(8, 'semibold'),
  text8Bold: createTypographyStyle(8, 'bold'),

  text12Thin: createTypographyStyle(12, 'thin'),
  text12ExtraLight: createTypographyStyle(12, 'extraLight'),
  text12Light: createTypographyStyle(12, 'light'),
  text12Regular: createTypographyStyle(12, 'regular'),
  text12Medium: createTypographyStyle(12, 'medium'),
  text12Semibold: createTypographyStyle(12, 'semibold'),
  text12Bold: createTypographyStyle(12, 'bold'),

  text14Thin: createTypographyStyle(14, 'thin'),
  text14ExtraLight: createTypographyStyle(14, 'extraLight'),
  text14Light: createTypographyStyle(14, 'light'),
  text14Regular: createTypographyStyle(14, 'regular'),
  text14Medium: createTypographyStyle(14, 'medium'),
  text14Semibold: createTypographyStyle(14, 'semibold'),
  text14Bold: createTypographyStyle(14, 'bold'),

  text16Thin: createTypographyStyle(16, 'thin'),
  text16ExtraLight: createTypographyStyle(16, 'extraLight'),
  text16Light: createTypographyStyle(16, 'light'),
  text16Regular: createTypographyStyle(16, 'regular'),
  text16Medium: createTypographyStyle(16, 'medium'),
  text16Semibold: createTypographyStyle(16, 'semibold'),
  text16Bold: createTypographyStyle(16, 'bold'),

  text18Thin: createTypographyStyle(18, 'thin'),
  text18ExtraLight: createTypographyStyle(18, 'extraLight'),
  text18Light: createTypographyStyle(18, 'light'),
  text18Regular: createTypographyStyle(18, 'regular'),
  text18Medium: createTypographyStyle(18, 'medium'),
  text18Semibold: createTypographyStyle(18, 'semibold'),
  text18Bold: createTypographyStyle(18, 'bold'),

  text20Thin: createTypographyStyle(20, 'thin'),
  text20ExtraLight: createTypographyStyle(20, 'extraLight'),
  text20Light: createTypographyStyle(20, 'light'),
  text20Regular: createTypographyStyle(20, 'regular'),
  text20Medium: createTypographyStyle(20, 'medium'),
  text20Semibold: createTypographyStyle(20, 'semibold'),
  text20Bold: createTypographyStyle(20, 'bold'),

  text24Thin: createTypographyStyle(24, 'thin'),
  text24ExtraLight: createTypographyStyle(24, 'extraLight'),
  text24Light: createTypographyStyle(24, 'light'),
  text24Regular: createTypographyStyle(24, 'regular'),
  text24Medium: createTypographyStyle(24, 'medium'),
  text24Semibold: createTypographyStyle(24, 'semibold'),
  text24Bold: createTypographyStyle(24, 'bold'),

  text28Thin: createTypographyStyle(28, 'thin'),
  text28ExtraLight: createTypographyStyle(28, 'extraLight'),
  text28Light: createTypographyStyle(28, 'light'),
  text28Regular: createTypographyStyle(28, 'regular'),
  text28Medium: createTypographyStyle(28, 'medium'),
  text28Semibold: createTypographyStyle(28, 'semibold'),
  text28Bold: createTypographyStyle(28, 'bold'),

  text32Thin: createTypographyStyle(32, 'thin'),
  text32ExtraLight: createTypographyStyle(32, 'extraLight'),
  text32Light: createTypographyStyle(32, 'light'),
  text32Regular: createTypographyStyle(32, 'regular'),
  text32Medium: createTypographyStyle(32, 'medium'),
  text32Semibold: createTypographyStyle(32, 'semibold'),
  text32Bold: createTypographyStyle(32, 'bold'),

  text36Thin: createTypographyStyle(36, 'thin'),
  text36ExtraLight: createTypographyStyle(36, 'extraLight'),
  text36Light: createTypographyStyle(36, 'light'),
  text36Regular: createTypographyStyle(36, 'regular'),
  text36Medium: createTypographyStyle(36, 'medium'),
  text36Semibold: createTypographyStyle(36, 'semibold'),
  text36Bold: createTypographyStyle(36, 'bold'),

  text40Thin: createTypographyStyle(40, 'thin'),
  text40ExtraLight: createTypographyStyle(40, 'extraLight'),
  text40Light: createTypographyStyle(40, 'light'),
  text40Regular: createTypographyStyle(40, 'regular'),
  text40Medium: createTypographyStyle(40, 'medium'),
  text40Semibold: createTypographyStyle(40, 'semibold'),
  text40Bold: createTypographyStyle(40, 'bold'),

  text48Thin: createTypographyStyle(48, 'thin'),
  text48ExtraLight: createTypographyStyle(48, 'extraLight'),
  text48Light: createTypographyStyle(48, 'light'),
  text48Regular: createTypographyStyle(48, 'regular'),
  text48Medium: createTypographyStyle(48, 'medium'),
  text48Semibold: createTypographyStyle(48, 'semibold'),
  text48Bold: createTypographyStyle(48, 'bold'),
} as const;

export const semanticTypography = {
  h1: typography.text48Bold,
  h2: typography.text40Bold,
  h3: typography.text32Bold,
  h4: typography.text28Bold,
  h5: typography.text24Bold,
  h6: typography.text20Bold,

  bodyLarge: typography.text18Regular,
  body: typography.text16Regular,
  bodySmall: typography.text14Regular,

  caption: typography.text12Regular,
  captionSmall: typography.text8Regular,

  buttonLarge: typography.text18Semibold,
  button: typography.text16Semibold,
  buttonSmall: typography.text14Semibold,

  label: typography.text14Medium,
  labelSmall: typography.text12Medium,
} as const;

export const getTypographyStyle = (styleName: keyof typeof typography) => {
  return typography[styleName];
};

export default typography;