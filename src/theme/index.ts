import type { TextStyle } from 'react-native';

export const colors = {
  bg: '#0B0D12',
  surface: '#12151C',
  surfaceAlt: '#1A1E29',
  surfaceHigh: '#222737',
  border: '#252A38',
  text: '#F4F6FB',
  textMuted: '#9AA3B8',
  textFaint: '#667085',
  primary: '#6366F1',
  primaryAlt: '#8B5CF6',
  primarySoft: 'rgba(99,102,241,0.16)',
  accent: '#2DD4BF',
  success: '#34D399',
  successSoft: 'rgba(52,211,153,0.14)',
  warning: '#FBBF24',
  warningSoft: 'rgba(251,191,36,0.14)',
  danger: '#F87171',
  dangerSoft: 'rgba(248,113,113,0.14)',
  overlay: 'rgba(4,6,10,0.72)',
  white: '#FFFFFF',
} as const;

export const gradients = {
  primary: ['#6366F1', '#8B5CF6'] as const,
  hero: ['#4338CA', '#7C3AED', '#C026D3'] as const,
  success: ['#10B981', '#059669'] as const,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

/** Max readable width — keeps the layout tidy on tablets and in the browser. */
export const layout = { maxWidth: 720, wideMaxWidth: 1080 } as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export const shadows = {
  card: { boxShadow: '0 6px 18px rgba(0,0,0,0.28)' },
  glow: { boxShadow: '0 8px 24px rgba(99,102,241,0.38)' },
} as const;
