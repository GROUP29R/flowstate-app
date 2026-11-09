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

export default function LoginScreen() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Enter your email address';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'That email address doesn’t look right';
    if (!password) next.password = 'Enter your password';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const signIn = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    // On success the auth listener flips the session and the router moves us into the app.
    if (error) setErrors({ form: error.message });
  };

  const forgotPassword = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      setErrors({ email: 'Enter your email above first, then tap “Forgot password?”' });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) toast.error(error.message);
    else toast.success('Check your inbox for a reset link.');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue learning where you left off."
      footer={
        <>
          <AppText color={colors.textMuted}>New to FlowState?</AppText>
          <Link href="/register">
            <AppText variant="bodyStrong" color={colors.primary}>
              Create an account
            </AppText>
          </Link>
        </>
      }>
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
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        password
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={signIn}
      />
      {errors.form ? (
        <AppText variant="caption" color={colors.danger} style={{ marginBottom: 12 }}>
          {errors.form}
        </AppText>
      ) : null}
      <Button title="Sign in" onPress={signIn} loading={loading} />
      <Button title="Forgot password?" onPress={forgotPassword} variant="ghost" size="sm" style={{ marginTop: 8 }} />
    </AuthShell>
  );
}
