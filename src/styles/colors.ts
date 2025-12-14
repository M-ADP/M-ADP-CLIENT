export interface ColorPalette {
  primary: {
    default: string;
    10: string;
    20: string;
    30: string;
  };
  black: {
    50: string;
    75: string;
    100: string;
    200: string;
    300: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
  };
  gradient: {
    primary: string;
  };
  status: {
    healthy: string;
    unhealthy: string;
    warning: string;
  };
}

export const primary = {
  default: '#030982',
  10: '#1174F7',
  20: '#00C2FF',
  30: '#95E8FF',
} as const;

export const black = {
  50: '#E6E6E6',
  75: '#969696',
  100: '#6B6B6B',
  200: '#2B2B2B',
  300: '#000000',
} as const;

export const background = {
  primary: '#0F123B',
  secondary: '#090D2E',
  tertiary: '#020515',
  quaternary: '#000000',
} as const;

export const gradient = {
  primary: 'linear-gradient(135deg, #030982 0%, #1174F7 33%, #00C2FF 67%, #95E8FF 100%)',
} as const;

export const status = {
  healthy: '#10b981',
  unhealthy: '#ef4444',
  warning: '#f59e0b',
} as const;

export const colors: ColorPalette = {
  primary,
  black,
  background,
  gradient,
  status,
};

export const COLORS = {
  PRIMARY_DEFAULT: primary.default,
  PRIMARY_10: primary[10],
  PRIMARY_20: primary[20],
  PRIMARY_30: primary[30],

  BLACK_50: black[50],
  BLACK_75: black[75],
  BLACK_100: black[100],
  BLACK_200: black[200],
  BLACK_300: black[300],

  BG_PRIMARY: background.primary,
  BG_SECONDARY: background.secondary,
  BG_TERTIARY: background.tertiary,
  BG_QUATERNARY: background.quaternary,

  GRADIENT_PRIMARY: gradient.primary,
} as const;

export default colors;