'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockAuth } from '@/lib/mock-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'verifier';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const user = mockAuth.getCurrentUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'verifier') {
        router.push('/verifier');
      } else {
        router.push('/dashboard');
      }
      return;
    }
  }, [router, requiredRole]);

  return <>{children}</>;
}
