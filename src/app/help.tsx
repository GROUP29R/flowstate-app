import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/Text';
import { SUPPORT_EMAIL } from '@/constants/legal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { colors, spacing } from '@/theme';

const FAQS = [
  { q: 'How do I enrol in a course?', a: 'Open the Learn tab, tap a course and confirm your enrolment. It then appears under “My courses”.' },
  { q: 'Where are my PDFs and study notes?', a: 'Every document from your enrolled courses is collected in the Library tab. You can also open them from each course’s Resources tab.' },
  { q: 'A video won’t play. What can I do?', a: 'Check your connection and try again. Videos play through YouTube, so they need internet access.' },
  { q: 'How do I change my name, photo or password?', a: 'Go to Profile → Account details, make your changes and tap Save changes.' },
];

export default function HelpScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState<number | null>(0);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    const text = message.trim();
    if (!text) {
      toast.error('Please write a message first.');
      return;
    }
    setSending(true);
    const { error } = await supabase.from('support_requests').insert([{ message: `${text}\n\n— ${user?.email ?? 'unknown user'}` }]);
    if (error) {
      setSending(false);
      toast.error('Could not send your request. Please try again.');
      return;
    }
    // Best-effort email notification; the request is already saved even if this isn't set up.
    supabase.functions.invoke('send-support-email', { body: { to: SUPPORT_EMAIL, subject: 'New support request', text } }).catch(() => {});
    setSending(false);
    setMessage('');
    toast.success('Message sent — we’ll get back to you soon.');
  };

  return (
    <Screen scroll keyboardAvoiding edges={['top', 'bottom']}>
      <Header />
      <AppText variant="display" style={{ marginTop: spacing.md }}>
        Help & support
      </AppText>
      <AppText color={colors.textMuted} style={{ marginTop: spacing.xs, marginBottom: spacing.xl }}>
        Quick answers, or send us a message.
      </AppText>

      <Card padded={false}>
        {FAQS.map((f, i) => {
          const expanded = open === i;
          return (
            <Pressable key={f.q} accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setOpen(expanded ? null : i)} style={[styles.faq, i < FAQS.length - 1 && styles.divider]}>
              <View style={styles.faqHead}>
                <AppText variant="bodyStrong" style={{ flex: 1 }}>
                  {f.q}
                </AppText>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textFaint} />
              </View>
              {expanded ? (
                <AppText color={colors.textMuted} style={{ marginTop: spacing.sm }}>
                  {f.a}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
      </Card>

      <AppText variant="heading" style={{ marginTop: spacing.xxl, marginBottom: spacing.md }}>
        Contact us
      </AppText>
      <Input placeholder="How can we help?" value={message} onChangeText={setMessage} multiline />
      <Button title="Send message" icon="send" onPress={send} loading={sending} />
      <Button title={`Email ${SUPPORT_EMAIL}`} variant="ghost" size="sm" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} style={{ marginTop: spacing.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  faq: { padding: spacing.lg },
  divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
