import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { colors, spacing } from '@/theme';

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Shared layout for the sign-in / sign-up screens. */
export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={['rgba(99,102,241,0.28)', 'rgba(11,13,18,0)']} style={styles.glow} pointerEvents="none" />
      <Screen scroll keyboardAvoiding edges={['top', 'bottom']} contentStyle={styles.content}>
        <View style={styles.brand}>
          <Logo size={60} />
          <AppText variant="overline" color={colors.textMuted} style={styles.brandName}>
            FlowState Learning
          </AppText>
        </View>
        <AppText variant="display">{title}</AppText>
        <AppText color={colors.textMuted} style={styles.sub}>
          {subtitle}
        </AppText>
        <View style={styles.form}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  glow: { position: 'absolute', top: 0, left: 0, right: 0, height: 320 },
  content: { maxWidth: 440, paddingTop: spacing.xxl, justifyContent: 'center' },
  brand: { alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.xxl },
  brandName: { letterSpacing: 1.6 },
  sub: { marginTop: spacing.sm, marginBottom: spacing.xxl },
  form: { gap: 0 },
  footer: { marginTop: spacing.xl, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
});
