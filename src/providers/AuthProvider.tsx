import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/db';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** Best available human-friendly name for the signed-in user. */
  displayName: string;
  /** True until the persisted session has been read from storage. */
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    // NB: don't await Supabase calls inside this callback (can deadlock the auth client).
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setProfile(null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) console.warn('Could not load profile:', error.message);
    setProfile((data as Profile | null) ?? null);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-change
    refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const user = session?.user ?? null;

  const value = useMemo<AuthContextValue>(() => {
    const meta = (user?.user_metadata ?? {}) as { name?: string };
    const displayName =
      profile?.username?.trim() || meta.name?.trim() || user?.email?.split('@')[0] || 'there';
    return { session, user, profile, displayName, loading, signOut, refreshProfile };
  }, [session, user, profile, loading, signOut, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
