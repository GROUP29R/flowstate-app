import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { LEGAL_UPDATED, type LegalSection } from '@/constants/legal';
import { colors, spacing } from '@/theme';

export function LegalDoc({ title, sections, children }: { title: string; sections: LegalSection[]; children?: React.ReactNode }) {
  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header />
      <AppText variant="display" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.textFaint}>
        Last updated: {LEGAL_UPDATED}
      </AppText>
      <View style={styles.sections}>
        {sections.map((s) => (
          <View key={s.title} style={{ gap: spacing.xs }}>
            <AppText variant="heading">{s.title}</AppText>
            <AppText color={colors.textMuted}>{s.body}</AppText>
          </View>
        ))}
      </View>
      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  sections: { gap: spacing.xl, marginTop: spacing.xl },
});
