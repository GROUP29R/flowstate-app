import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VideoPlayer } from '@/components/VideoPlayer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { goBack, Header } from '@/components/ui/Header';
import { Segmented } from '@/components/ui/Segmented';
import { AppText } from '@/components/ui/Text';
import { averageRating, extractYoutubeId } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, layout, radius, spacing } from '@/theme';
import type { Course, CoursePdf, CourseReview, CourseVideo } from '@/types/db';

type Tab = 'lessons' | 'resources' | 'reviews';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [pdfs, setPdfs] = useState<CoursePdf[]>([]);
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [tab, setTab] = useState<Tab>('lessons');
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);

  const load = useCallback(async () => {
    if (!user || !id) return;
    try {
      const { data: enrolment, error: enrolErr } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', id)
        .maybeSingle();
      if (enrolErr) throw enrolErr;
      if (enrolment?.status !== 'approved') {
        toast.error('You’re not enrolled in this course.');
        goBack();
        return;
      }

      const [courseRes, videoRes, pdfRes, reviewRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', id).single(),
        supabase.from('course_videos').select('*').eq('course_id', id).order('position'),
        supabase.from('course_pdfs').select('*').eq('course_id', id).order('position'),
        supabase.from('course_reviews').select('*').eq('course_id', id),
      ]);
      if (courseRes.error) throw courseRes.error;

      const c = courseRes.data as Course;
      const v = (videoRes.data ?? []) as CourseVideo[];
      setCourse(c);
      setVideos(v);
      setPdfs((pdfRes.data ?? []) as CoursePdf[]);
      setReviews((reviewRes.data ?? []) as CourseReview[]);
      setVideoId(extractYoutubeId(c.intro_video) || extractYoutubeId(v[0]?.youtube_url));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not load this course.');
      goBack();
    } finally {
      setLoading(false);
    }
  }, [user, id, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, id]);

  const playVideo = (video: CourseVideo) => {
    const vid = extractYoutubeId(video.youtube_url);
    if (!vid) {
      toast.error('This video link isn’t valid.');
      return;
    }
    setVideoId(vid);
    setAutoPlay(true);
  };

  if (loading || !course) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const rating = averageRating(reviews.map((r) => r.rating));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.column}>
        <Header title={course.title} subtitle={course.subtitle ?? undefined} />
        <VideoPlayer videoId={videoId} autoPlay={autoPlay} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.badges}>
            <Badge label={`${videos.length} lesson${videos.length === 1 ? '' : 's'}`} icon="play-circle-outline" tone="primary" />
            <Badge label={`${pdfs.length} resource${pdfs.length === 1 ? '' : 's'}`} icon="document-text-outline" />
            {reviews.length > 0 ? <Badge label={`${rating.toFixed(1)} · ${reviews.length} review${reviews.length === 1 ? '' : 's'}`} icon="star" tone="warning" /> : null}
          </View>
          {course.description ? (
            <AppText color={colors.textMuted} style={{ marginTop: spacing.lg }}>
              {course.description}
            </AppText>
          ) : null}

          <View style={{ marginVertical: spacing.xl }}>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { value: 'lessons', label: 'Lessons', count: videos.length },
                { value: 'resources', label: 'Resources', count: pdfs.length },
                { value: 'reviews', label: 'Reviews', count: reviews.length },
              ]}
            />
          </View>

          {tab === 'lessons' &&
            (videos.length === 0 ? (
              <EmptyState icon="videocam-outline" title="No lessons yet" message="Video lessons for this course will appear here." />
            ) : (
              videos.map((v, i) => {
                const active = extractYoutubeId(v.youtube_url) === videoId;
                return (
                  <Pressable key={v.id} accessibilityRole="button" onPress={() => playVideo(v)} style={({ pressed }) => [styles.row, active && styles.rowActive, pressed && { opacity: 0.85 }]}>
                    <View style={[styles.index, active && { backgroundColor: colors.primary }]}>
                      {active ? <Ionicons name="play" size={14} color="#fff" /> : <AppText variant="label" color={colors.textMuted}>{i + 1}</AppText>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyStrong" numberOfLines={2}>
                        {v.title}
                      </AppText>
                      {v.duration ? (
                        <AppText variant="caption" color={colors.textMuted}>
                          {v.duration}
                        </AppText>
                      ) : null}
                    </View>
                    <Ionicons name={active ? 'volume-high' : 'play-circle-outline'} size={22} color={active ? colors.primary : colors.textFaint} />
                  </Pressable>
                );
              })
            ))}

          {tab === 'resources' &&
            (pdfs.length === 0 ? (
              <EmptyState icon="document-outline" title="No resources yet" message="PDFs and study notes will appear here." />
            ) : (
              pdfs.map((p) => (
                <Pressable key={p.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/pdf', params: { url: p.file_url, title: p.title } })} style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}>
                  <View style={[styles.index, { backgroundColor: colors.dangerSoft }]}>
                    <Ionicons name="document-text" size={16} color={colors.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyStrong" numberOfLines={2}>
                      {p.title}
                    </AppText>
                    {p.description ? (
                      <AppText variant="caption" color={colors.textMuted} numberOfLines={2}>
                        {p.description}
                      </AppText>
                    ) : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
                </Pressable>
              ))
            ))}

          {tab === 'reviews' &&
            (reviews.length === 0 ? (
              <EmptyState icon="chatbubble-ellipses-outline" title="No reviews yet" message="Be the first to share what you think once you’ve finished." />
            ) : (
              reviews.map((r) => (
                <Card key={r.id} style={{ marginBottom: spacing.md }}>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Ionicons key={n} name={n <= Math.round(r.rating) ? 'star' : 'star-outline'} size={16} color={colors.warning} />
                    ))}
                  </View>
                  {r.review ? <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>{r.review}</AppText> : null}
                </Card>
              ))
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  column: { flex: 1, width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center', paddingHorizontal: spacing.lg, gap: spacing.sm },
  scroll: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, marginBottom: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  rowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  index: { width: 34, height: 34, borderRadius: radius.sm + 2, backgroundColor: colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  stars: { flexDirection: 'row', gap: 2 },
});
