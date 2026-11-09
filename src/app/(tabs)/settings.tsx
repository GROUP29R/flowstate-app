import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { Sheet } from '@/components/ui/Sheet';
import { AppText } from '@/components/ui/Text';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const { user, displayName, signOut } = useAuth();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const avatarUrl = (user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url;

  const logout = async () => {
    setSigningOut(true);
    try {
      await signOut(); // the root layout's auth guard sends us back to the sign-in screen
    } catch {
      toast.error('Could not sign out. Please try again.');
      setSigningOut(false);
      setConfirming(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="display">Profile</AppText>
      </View>

      <Card onPress={() => router.push('/account')} style={styles.profile}>
        <Avatar name={displayName} uri={avatarUrl} size={60} />
        <View style={{ flex: 1 }}>
          <AppText variant="heading" numberOfLines={1}>
            {displayName}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
            {user?.email}
          </AppText>
        </View>
        <AppText variant="label" color={colors.primary}>
          Edit
        </AppText>
      </Card>

      <AppText variant="overline" color={colors.textFaint} style={styles.groupLabel}>
        Account
      </AppText>
      <Card padded={false}>
        <ListRow icon="person-outline" title="Account details" subtitle="Name, email, password, photo" onPress={() => router.push('/account')} />
        <ListRow icon="notifications-outline" title="Notifications" subtitle="Choose how we keep you updated" onPress={() => router.push('/notifications')} last />
      </Card>

      <AppText variant="overline" color={colors.textFaint} style={styles.groupLabel}>
        About
      </AppText>
      <Card padded={false}>
        <ListRow icon="sparkles-outline" title="About FlowState" onPress={() => router.push('/about')} />
        <ListRow icon="help-buoy-outline" title="Help & support" onPress={() => router.push('/help')} />
        <ListRow icon="lock-closed-outline" title="Privacy policy" onPress={() => router.push('/privacy')} />
        <ListRow icon="document-text-outline" title="Terms & conditions" onPress={() => router.push('/terms')} last />
      </Card>

      <Card padded={false} style={{ marginTop: spacing.xl }}>
        <ListRow icon="log-out-outline" title="Log out" destructive onPress={() => setConfirming(true)} last />
      </Card>

      <AppText variant="caption" color={colors.textFaint} align="center" style={styles.version}>
        FlowState · v{Constants.expoConfig?.version ?? '1.0.0'}
      </AppText>

      <Sheet visible={confirming} onClose={() => !signingOut && setConfirming(false)}>
        <AppText variant="title">Log out?</AppText>
        <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>
          You’ll need to sign in again to access your courses.
        </AppText>
        <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
          <Button title="Log out" variant="danger" onPress={logout} loading={signingOut} />
          <Button title="Cancel" variant="ghost" onPress={() => setConfirming(false)} disabled={signingOut} />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.xl },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  groupLabel: { marginTop: spacing.xxl, marginBottom: spacing.sm, marginLeft: spacing.xs },
  version: { marginTop: spacing.xxl },
});
