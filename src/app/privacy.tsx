import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LegalDoc } from '@/components/LegalDoc';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AppText } from '@/components/ui/Text';
import { PRIVACY_SECTIONS } from '@/constants/legal';
import { formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, spacing } from '@/theme';

const POLICY_VERSION = '1.0';

export default function PrivacyScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_consents')
      .select('accepted_at')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setAcceptedAt((data?.accepted_at as string | undefined) ?? null));
  }, [user]);

  const accept = async () => {
    if (!user) return;
    setSaving(true);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('user_consents')
      .upsert({ user_id: user.id, privacy_version: POLICY_VERSION, accepted_at: now }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) toast.error('Could not save your consent. Please try again.');
    else {
      setAcceptedAt(now);
      toast.success('Thanks — your consent has been saved.');
    }
  };

  return (
    <LegalDoc title="Privacy Policy" sections={PRIVACY_SECTIONS}>
      <Card style={styles.consent}>
        {acceptedAt ? (
          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <AppText variant="bodyStrong">You accepted this policy on {formatDate(acceptedAt)}.</AppText>
          </View>
        ) : (
          <>
            <AppText variant="bodyStrong">Your consent</AppText>
            <AppText color={colors.textMuted} style={{ marginVertical: spacing.sm }}>
              Please confirm you’ve read and agree to how we handle your information.
            </AppText>
            <Button title="I agree" icon="checkmark" onPress={accept} loading={saving} />
          </>
        )}
      </Card>
    </LegalDoc>
  );
}

const styles = StyleSheet.create({
  consent: { marginTop: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
