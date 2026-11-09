import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { colors, radius, spacing } from '@/theme';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
  { icon: 'play-circle-outline', title: 'Video lessons', text: 'Learn from clear, structured video lessons.' },
  { icon: 'document-text-outline', title: 'Study materials', text: 'Download PDFs and notes for every course.' },
  { icon: 'time-outline', title: 'Self-paced', text: 'Study anytime, anywhere, at your own speed.' },
  { icon: 'ribbon-outline', title: 'Expert-led', text: 'Courses designed around practical, real-world skills.' },
];

export default function AboutScreen() {
  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Header />
      <View style={styles.hero}>
        <Logo size={72} />
        <AppText variant="display" align="center">
          Learn anytime.{'\n'}Grow every day.
        </AppText>
        <AppText color={colors.textMuted} align="center" style={{ maxWidth: 420 }}>
          FlowState is a modern learning platform for students, professionals and lifelong learners — structured courses you can follow at your own pace.
        </AppText>
      </View>

      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <Card key={f.title} style={styles.feature}>
            <View style={styles.icon}>
              <Ionicons name={f.icon} size={22} color={colors.primary} />
            </View>
            <AppText variant="bodyStrong">{f.title}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {f.text}
            </AppText>
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: spacing.lg }}>
        <AppText variant="heading">Our philosophy</AppText>
        <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>
          Education should be accessible, engaging and practical. Every course builds confidence through step-by-step lessons, real examples and hands-on activities — and you can always come back and revisit a topic.
        </AppText>
      </Card>

      <Button title="Start learning" icon="arrow-forward" onPress={() => router.navigate('/')} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  feature: { flexGrow: 1, flexBasis: '45%', gap: spacing.xs },
  icon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
});
