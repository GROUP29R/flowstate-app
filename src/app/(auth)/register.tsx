import { Link } from 'expo-router';
import React, { useState } from 'react';

import { AuthShell } from '@/components/AuthShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AppText } from '@/components/ui/Text';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/providers/ToastProvider';
import { colors } from '@/theme';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function RegisterScreen() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Tell us what to call you';
    if (!email.trim()) next.email = 'Enter your email address';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'That email address doesn’t look right';
    if (password.length < 6) next.password = 'Use at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const signUp = async () => {
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      setErrors({ form: error.message });
      return;
    }
    // If email confirmation is on there's no session yet — tell the user what to do next.
    if (!data.session) toast.success('Account created! Confirm your email, then sign in.');
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join FlowState and start learning at your own pace."
      footer={
        <>
          <AppText color={colors.textMuted}>Already have an account?</AppText>
          <Link href="/login" replace>
            <AppText variant="bodyStrong" color={colors.primary}>
              Sign in
            </AppText>
          </Link>
        </>
      }>
      <Input label="Name" icon="person-outline" placeholder="Your name" value={name} onChangeText={setName} error={errors.name} autoComplete="name" textContentType="name" returnKeyType="next" />
      <Input
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <Input
        label="Password"
        icon="lock-closed-outline"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        password
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={signUp}
      />
      {errors.form ? (
        <AppText variant="caption" color={colors.danger} style={{ marginBottom: 12 }}>
          {errors.form}
        </AppText>
      ) : null}
      <Button title="Create account" onPress={signUp} loading={loading} />
    </AuthShell>
  );
}
