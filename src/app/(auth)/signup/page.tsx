'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { mockAuth } from '@/lib/mock-auth';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (email: string, password: string, role?: string) => {
    try {
      await mockAuth.signup(email, password, role || 'user');
      alert('Sign-up successful! You can now log in.');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during sign up');
    }
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} />;
}
