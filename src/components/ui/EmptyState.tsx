import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { Button } from './Button';
import { AppText } from './Text';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={30} color={colors.primary} />
      </View>
      <AppText variant="heading" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText color={colors.textMuted} align="center" style={styles.msg}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} size="sm" variant="secondary" style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.xl },
  iconWrap: { width: 68, height: 68, borderRadius: radius.xl, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  msg: { marginTop: spacing.sm, maxWidth: 320 },
  action: { marginTop: spacing.xl },
});
