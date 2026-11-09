import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { AppText } from '@/components/ui/Text';
import { colors, radius, shadows, spacing } from '@/theme';
import type { Course, EnrollmentStatus } from '@/types/db';

interface Props {
  course: Course;
  status: EnrollmentStatus | null;
  onPress: () => void;
}

const CTA: Record<'none' | EnrollmentStatus, { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  none: { label: 'Enrol', icon: 'add-circle-outline', color: colors.primary },
  approved: { label: 'Continue learning', icon: 'play-circle', color: colors.success },
  pending: { label: 'Awaiting approval', icon: 'time-outline', color: colors.warning },
  rejected: { label: 'Not available', icon: 'close-circle-outline', color: colors.danger },
};

export function CourseCard({ course, status, onPress }: Props) {
  const cta = CTA[status ?? 'none'];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.title}. ${cta.label}`}
      onPress={onPress}
      disabled={status === 'rejected' || status === 'pending'}
      style={({ pressed }) => [styles.card, shadows.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        {course.image_url ? (
          <Image source={{ uri: course.image_url }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        ) : (
          <LinearGradient colors={['#312E81', '#6D28D9']} style={[StyleSheet.absoluteFill, styles.fallback]}>
            <Ionicons name="school-outline" size={36} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.scrim} />
        {status === 'approved' ? (
          <View style={styles.badge}>
            <Badge label="Enrolled" tone="success" icon="checkmark-circle" />
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <AppText variant="heading" numberOfLines={2}>
          {course.title}
        </AppText>
        {course.subtitle ? (
          <AppText variant="caption" color={colors.textMuted} numberOfLines={2} style={styles.subtitle}>
            {course.subtitle}
          </AppText>
        ) : null}
        <View style={styles.cta}>
          <Ionicons name={cta.icon} size={18} color={cta.color} />
          <AppText variant="label" color={cta.color}>
            {cta.label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

export function CourseCardSkeleton() {
  return (
    <View style={[styles.card, { opacity: 0.6 }]}>
      <View style={[styles.imageWrap, { backgroundColor: colors.surfaceAlt }]} />
      <View style={styles.body}>
        <View style={[styles.line, { width: '70%', height: 16 }]} />
        <View style={[styles.line, { width: '45%', marginTop: 10 }]} />
        <View style={[styles.line, { width: '35%', marginTop: 18 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  pressed: { transform: [{ scale: 0.985 }], backgroundColor: colors.surfaceAlt },
  imageWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.surfaceAlt },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  scrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%' },
  badge: { position: 'absolute', top: spacing.md, left: spacing.md },
  body: { padding: spacing.lg, gap: 2 },
  subtitle: { marginTop: 2 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  line: { height: 12, borderRadius: 6, backgroundColor: colors.surfaceHigh },
});
