'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Check if user is a verifier
      const { data: verifierData } = await supabase
        .from('verifiers')
        .select('is_verifier')
        .eq('user_id', data.user.id)
        .single();

      // Redirect based on role
      if (verifierData?.is_verifier) {
        router.push('/verifier');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during login');
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
