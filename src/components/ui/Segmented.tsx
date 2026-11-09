import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './Text';

interface Props<T extends string> {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable key={o.value} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => onChange(o.value)} style={[styles.item, active && styles.active]}>
            <AppText variant="label" color={active ? colors.text : colors.textMuted}>
              {o.label}
              {o.count !== undefined ? `  ${o.count}` : ''}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.md, padding: 4, borderWidth: 1, borderColor: colors.border },
  item: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm + 2, borderRadius: radius.sm + 2 },
  active: { backgroundColor: colors.surfaceHigh },
});
