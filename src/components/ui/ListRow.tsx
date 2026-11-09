import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './Text';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  destructive?: boolean;
  right?: React.ReactNode;
  last?: boolean;
}

export function ListRow({ icon, title, subtitle, onPress, destructive, right, last }: Props) {
  const tint = destructive ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.iconBox, { backgroundColor: destructive ? colors.dangerSoft : colors.primarySoft }]}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={styles.texts}>
        <AppText variant="bodyStrong" color={destructive ? colors.danger : colors.text}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right ?? (onPress && !destructive ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md + 2, paddingHorizontal: spacing.lg },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  iconBox: { width: 36, height: 36, borderRadius: radius.sm + 2, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 1 },
});
