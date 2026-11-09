import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { colors, layout, radius, spacing } from '@/theme';
import type { CoursePdf } from '@/types/db';

interface Doc extends CoursePdf {
  courseTitle: string;
}

export default function LibraryScreen() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const { data: enrolled, error: enrolErr } = await supabase
        .from('course_enrollments')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('status', 'approved');
      if (enrolErr) throw enrolErr;

      const courseIds = (enrolled ?? []).map((e) => e.course_id as string);
      if (courseIds.length === 0) {
        setDocs([]);
        return;
      }

      const [pdfRes, courseRes] = await Promise.all([
        supabase.from('course_pdfs').select('*').in('course_id', courseIds).order('position', { ascending: true }),
        supabase.from('courses').select('id,title').in('id', courseIds),
      ]);
      if (pdfRes.error) throw pdfRes.error;

      const titles = new Map<string, string>((courseRes.data ?? []).map((c) => [c.id as string, c.title as string]));
      setDocs(((pdfRes.data ?? []) as CoursePdf[]).map((p) => ({ ...p, courseTitle: titles.get(p.course_id) ?? 'Course' })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your documents.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Reload whenever the tab gains focus so newly enrolled courses show up straight away.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen padded={false}>
      <FlatList
        data={docs}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="display">Library</AppText>
            <AppText color={colors.textMuted}>Study materials from the courses you’re enrolled in.</AppText>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            style={styles.item}
            onPress={() => router.push({ pathname: '/pdf', params: { url: item.file_url, title: item.title } })}>
            <View style={styles.row}>
              <View style={styles.icon}>
                <Ionicons name="document-text" size={22} color={colors.danger} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="bodyStrong" numberOfLines={2}>
                  {item.title}
                </AppText>
                {item.description ? (
                  <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
                    {item.description}
                  </AppText>
                ) : null}
                <View style={styles.meta}>
                  <Badge label={item.courseTitle} tone="primary" />
                  <AppText variant="caption" color={colors.textFaint}>
                    {formatDate(item.created_at)}
                  </AppText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxxl }} />
          ) : error ? (
            <EmptyState icon="cloud-offline-outline" title="Couldn’t load documents" message={error} actionLabel="Try again" onAction={load} />
          ) : (
            <EmptyState
              icon="folder-open-outline"
              title="Nothing here yet"
              message="Enrol in a course and its PDFs and study notes will show up in your library."
              actionLabel="Browse courses"
              onAction={() => router.navigate('/')}
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  header: { gap: spacing.xs, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  item: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
});
