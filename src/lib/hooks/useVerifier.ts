import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useVerifier() {
  const [isVerifier, setIsVerifier] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkVerifierStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsVerifier(false);
          return;
        }

        const { data, error } = await supabase
          .from('verifiers')
          .select('is_verifier')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setIsVerifier(data?.is_verifier || false);
      } catch (error) {
        console.error('Error checking verifier status:', error);
        setIsVerifier(false);
      } finally {
        setLoading(false);
      }
    }

    checkVerifierStatus();
  }, []);

  return { isVerifier, loading };
}
