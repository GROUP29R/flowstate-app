import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/theme';

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

export function AppText({ variant = 'body', color = colors.text, align, style, ...rest }: Props) {
  return <RNText {...rest} style={[typography[variant], { color }, align && { textAlign: align }, style]} />;
}
