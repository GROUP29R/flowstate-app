import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Course, Enrollment } from '@/types/db';

/** Loads the course catalogue plus the signed-in user's enrolments. */
export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [coursesRes, enrollRes] = await Promise.all([
        supabase.from('courses').select('*').order('created_at'),
        user
          ? supabase.from('course_enrollments').select('course_id,status').eq('user_id', user.id)
          : Promise.resolve({ data: [] as Enrollment[], error: null }),
      ]);
      if (coursesRes.error) throw coursesRes.error;
      if (enrollRes.error) throw enrollRes.error;
      setCourses((coursesRes.data as Course[]) ?? []);
      setEnrollments((enrollRes.data as Enrollment[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong while loading courses.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const statusOf = useCallback(
    (courseId: string) => enrollments.find((e) => e.course_id === courseId)?.status ?? null,
    [enrollments],
  );

  /** Enrols the user. Resolves to the resulting status, or throws on failure. */
  const enroll = useCallback(
    async (courseId: string): Promise<Enrollment['status']> => {
      if (!user) throw new Error('Please sign in first.');
      const { data: existing, error: lookupError } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) return existing.status as Enrollment['status'];

      const { error: insertError } = await supabase
        .from('course_enrollments')
        .insert({ user_id: user.id, course_id: courseId, status: 'approved' });
      if (insertError) throw insertError;
      await load();
      return 'approved';
    },
    [user, load],
  );

  return { courses, enrollments, loading, refreshing, error, refresh, reload: load, statusOf, enroll };
}
