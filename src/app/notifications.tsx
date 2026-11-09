import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, spacing } from '@/theme';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const [loud, setLoud] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('notifications_settings')
      .select('mode')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setLoud(data.mode === 'loud');
        setLoading(false);
      });
  }, [user]);

  const toggle = async (next: boolean) => {
    if (!user) return;
    setLoud(next);
    const { error } = await supabase.from('notifications_settings').upsert({ user_id: user.id, mode: next ? 'loud' : 'silent' });
    if (error) {
      setLoud(!next);
      toast.error('Could not update your preference.');
    }
  };

  return (
    <Screen scroll>
      <Header />
      <AppText variant="display" style={{ marginTop: spacing.md }}>
        Notifications
      </AppText>
      <AppText color={colors.textMuted} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Choose how FlowState keeps you in the loop.
      </AppText>
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="bodyStrong">Course updates</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {loud ? 'On — you’ll get alerts about your courses.' : 'Off — we’ll keep things quiet.'}
            </AppText>
          </View>
          <Switch
            value={loud}
            onValueChange={toggle}
            disabled={loading}
            trackColor={{ false: colors.surfaceHigh, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg } });
