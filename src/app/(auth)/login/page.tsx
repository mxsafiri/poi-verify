'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/ui/auth-form';
import { mockAuth } from '@/lib/mock-auth';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await mockAuth.login(email, password);
      
      // Redirect based on role
      if (user.role === 'verifier') {
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
