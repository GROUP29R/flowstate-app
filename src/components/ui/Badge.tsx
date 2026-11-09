import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './Text';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceHigh, fg: colors.textMuted },
  primary: { bg: colors.primarySoft, fg: '#A5A8FF' },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
};

export function Badge({ label, tone = 'neutral', icon }: { label: string; tone?: Tone; icon?: keyof typeof Ionicons.glyphMap }) {
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      {icon ? <Ionicons name={icon} size={12} color={t.fg} /> : null}
      <AppText variant="caption" color={t.fg} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: spacing.md - 2, paddingVertical: 4, borderRadius: radius.pill },
  text: { fontWeight: '600' },
});
