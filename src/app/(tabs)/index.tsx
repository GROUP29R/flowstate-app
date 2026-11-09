import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard, CourseCardSkeleton } from '@/components/CourseCard';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Segmented } from '@/components/ui/Segmented';
import { Sheet } from '@/components/ui/Sheet';
import { AppText } from '@/components/ui/Text';
import { useCourses } from '@/hooks/useCourses';
import { greeting } from '@/lib/format';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, layout, radius, spacing } from '@/theme';
import type { Course } from '@/types/db';

type Filter = 'all' | 'mine' | 'available';
type Row = Course | { id: string; spacer: true };

export default function LearnScreen() {
  const { displayName, user } = useAuth();
  const toast = useToast();
  const { width } = useWindowDimensions();
  const { courses, loading, refreshing, error, refresh, reload, statusOf, enroll } = useCourses();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Course | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const columns = width >= 1000 ? 3 : width >= 640 ? 2 : 1;
  const avatarUrl = (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url;

  const joined = courses.filter((c) => statusOf(c.id) === 'approved').length;

  const rows = useMemo<Row[]>(() => {
    const q = query.trim().toLowerCase();
    const list = courses.filter((c) => {
      const status = statusOf(c.id);
      if (filter === 'mine' && status !== 'approved') return false;
      if (filter === 'available' && status === 'approved') return false;
      if (!q) return true;
      return `${c.title} ${c.subtitle ?? ''}`.toLowerCase().includes(q);
    });
    // Pad the last row so cards keep a consistent width in multi-column layouts.
    const pad = columns > 1 ? (columns - (list.length % columns)) % columns : 0;
    return [...list, ...Array.from({ length: pad }, (_, i) => ({ id: `spacer-${i}`, spacer: true as const }))];
  }, [courses, query, filter, columns, statusOf]);

  const openCourse = (id: string) => router.push({ pathname: '/course/[id]', params: { id } });

  const onCardPress = (course: Course) => {
    if (statusOf(course.id) === 'approved') openCourse(course.id);
    else setSelected(course);
  };

  const confirmEnrol = async () => {
    if (!selected) return;
    setEnrolling(true);
    try {
      const status = await enroll(selected.id);
      const id = selected.id;
      setSelected(null);
      if (status === 'approved') {
        toast.success(`You’re in! Welcome to ${selected.title}.`);
        openCourse(id);
      } else if (status === 'rejected') {
        toast.error('Your enrolment request was declined.');
      } else {
        toast.info('Your request is awaiting approval.');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not enrol. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textMuted}>
            {greeting()}
          </AppText>
          <AppText variant="title" numberOfLines={1}>
            {displayName}
          </AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push('/account')}>
          <Avatar name={displayName} uri={avatarUrl} size={44} />
        </Pressable>
      </View>

      <LinearGradient colors={['#4338CA', '#7C3AED', '#C026D3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="overline" color="rgba(255,255,255,0.75)">
            Your learning
          </AppText>
          <AppText variant="heading" color="#fff">
            {joined === 0 ? 'Find your first course' : `${joined} course${joined === 1 ? '' : 's'} in progress`}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.8)">
            {courses.length > 0 ? `${courses.length} available · learn at your own pace` : 'Learn at your own pace, anywhere.'}
          </AppText>
        </View>
        <View style={styles.heroIcon}>
          <Ionicons name="rocket-outline" size={28} color="#fff" />
        </View>
      </LinearGradient>

      <Input icon="search-outline" placeholder="Search courses" value={query} onChangeText={setQuery} returnKeyType="search" autoCapitalize="none" containerStyle={{ marginBottom: 0 }} />
      <Segmented
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'All' },
          { value: 'mine', label: 'My courses', count: joined },
          { value: 'available', label: 'Explore' },
        ]}
      />
      <AppText variant="heading" style={styles.sectionTitle}>
        {filter === 'mine' ? 'My courses' : filter === 'available' ? 'Explore courses' : 'All courses'}
      </AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <FlatList<Row>
        key={columns}
        data={loading ? [] : rows}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        columnWrapperStyle={columns > 1 ? styles.columnGap : undefined}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />}
        renderItem={({ item }) =>
          'spacer' in item ? (
            <View style={{ flex: 1 }} />
          ) : (
            <View style={[styles.cell, columns === 1 && { marginBottom: spacing.lg }]}>
              <CourseCard course={item} status={statusOf(item.id)} onPress={() => onCardPress(item)} />
            </View>
          )
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ gap: spacing.lg }}>
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </View>
          ) : error ? (
            <EmptyState icon="cloud-offline-outline" title="Couldn’t load courses" message={error} actionLabel="Try again" onAction={reload} />
          ) : (
            <EmptyState
              icon={query ? 'search-outline' : 'school-outline'}
              title={query ? 'No matches' : filter === 'mine' ? 'No courses yet' : 'No courses available'}
              message={query ? 'Try a different search term.' : filter === 'mine' ? 'Enrol in a course to see it here.' : 'New courses will appear here soon.'}
              actionLabel={filter === 'mine' ? 'Explore courses' : undefined}
              onAction={filter === 'mine' ? () => setFilter('available') : undefined}
            />
          )
        }
      />

      <Sheet visible={!!selected} onClose={() => !enrolling && setSelected(null)}>
        <AppText variant="title">Enrol in this course?</AppText>
        <AppText variant="heading" color={colors.primary} style={{ marginTop: spacing.md }}>
          {selected?.title}
        </AppText>
        {selected?.description ? (
          <AppText color={colors.textMuted} numberOfLines={5} style={{ marginTop: spacing.sm }}>
            {selected.description}
          </AppText>
        ) : null}
        <View style={styles.sheetActions}>
          <Button title="Confirm enrolment" icon="checkmark" onPress={confirmEnrol} loading={enrolling} />
          <Button title="Not now" variant="ghost" onPress={() => setSelected(null)} disabled={enrolling} />
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { width: '100%', maxWidth: layout.wideMaxWidth, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { gap: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, padding: spacing.xl, borderRadius: radius.xl },
  heroIcon: { width: 52, height: 52, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { marginTop: spacing.sm },
  columnGap: { gap: spacing.lg, marginBottom: spacing.lg },
  cell: { flex: 1 },
  sheetActions: { gap: spacing.sm, marginTop: spacing.xl },
});
