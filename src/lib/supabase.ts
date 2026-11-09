import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Configure these in a `.env` file (see `.env.example`). The fallbacks below are the
// project's existing *public anon* credentials, so the app keeps working out of the box.
// The anon key is designed to be public — your data is protected by Row Level Security.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://vhcqafdaluapfazwvokx.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3FhZmRhbHVhcGZhend2b2t4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzM2NzMsImV4cCI6MjA3MTQwOTY3M30.M6iJTXykRB2tq37VUKro4gmhTl5Oz8gTrtnNNqm_GSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Only refresh tokens while the app is in the foreground (recommended by Supabase for RN).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export default supabase;
