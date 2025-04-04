'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        router.push('/login?message=Check your email to confirm your account');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {type === 'login' ? 'Sign In' : 'Create Account'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            type === 'login' ? 'Sign In' : 'Sign Up'
          )}
        </Button>

        {type === 'signup' && (
          <Typography variant="body2" color="text.secondary" align="center">
            By signing up, you agree to our Terms and Privacy Policy.
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 2 }}>
          {type === 'login' ? (
            <>
              Do not have an account?{' '}
              <Button
                variant="text"
                onClick={() => router.push('/signup')}
                sx={{ p: 0, minWidth: 'auto' }}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button
                variant="text"
                onClick={() => router.push('/login')}
                sx={{ p: 0, minWidth: 'auto' }}
              >
                Sign in
              </Button>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
