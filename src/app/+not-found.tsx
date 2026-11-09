import { Redirect, router, usePathname } from 'expo-router';
import React from 'react';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Also acts as the auth fallback: routes behind <Stack.Protected> resolve to "not found"
 * when the guard is false, so we send signed-out users to sign-in and signed-in users home.
 */
export default function NotFound() {
  const { session } = useAuth();
  const pathname = usePathname();

  if (!session) return <Redirect href="/login" />;
  if (pathname === '/login' || pathname === '/register') return <Redirect href="/" />;

  return (
    <Screen edges={['top', 'bottom']}>
      <EmptyState icon="compass-outline" title="Page not found" message="That screen doesn’t exist or has moved." actionLabel="Go home" onAction={() => router.replace('/')} />
    </Screen>
  );
}
