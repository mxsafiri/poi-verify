'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      alert('Sign-up successful! Please check your email to confirm your account.');
      router.push('/login');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred during sign up');
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} />;
}
