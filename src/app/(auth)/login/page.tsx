'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred during login');
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
