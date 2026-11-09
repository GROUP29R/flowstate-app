import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './Text';

interface Props {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  /** Hide the back button (e.g. for root tabs). */
  noBack?: boolean;
}

export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function Header({ title, subtitle, right, onBack, noBack }: Props) {
  return (
    <View style={styles.row}>
      {noBack ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack ?? goBack}
          hitSlop={8}
          style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      )}
      <View style={styles.titles}>
        {title ? (
          <AppText variant="heading" numberOfLines={1}>
            {title}
          </AppText>
        ) : null}
        {subtitle ? (
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56, gap: spacing.md },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1 },
  right: { minWidth: 40, alignItems: 'flex-end' },
});
