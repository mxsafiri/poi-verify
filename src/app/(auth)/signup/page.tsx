'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (email: string, password: string, role?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role || 'user'
          }
        }
      });

      if (error) {
        throw error;
      }

      // If signup successful and role is verifier, create verifier record
      if (role === 'verifier' && data?.user) {
        const { error: verifierError } = await supabase
          .from('verifiers')
          .insert([{ user_id: data.user.id }]);
        
        if (verifierError) {
          console.error('Error creating verifier record:', verifierError);
        }
      }

      alert('Sign-up successful! Please check your email to confirm your account.');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during sign up');
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} />;
}
