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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit?: (email: string, password: string, role?: string) => Promise<void>;
}

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(email, password, role);
      } else {
        const supabase = createClient();
        if (type === 'signup') {
          const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: role
              }
            }
          });
          if (signUpError) throw signUpError;
          
          // If signup successful, create verifier record if role is verifier
          if (role === 'verifier' && data?.user) {
            const { error: verifierError } = await supabase
              .from('verifiers')
              .insert([{ user_id: data.user.id }]);
            if (verifierError) throw verifierError;
          }
          
          router.push('/login?message=Check your email to confirm your account');
        } else {
          const { error: signInError, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInError) throw signInError;
          
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
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      p: 2 
    }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          {type === 'login' ? 'Login' : 'Sign Up'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          
          {type === 'signup' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="user">Project Owner</MenuItem>
                <MenuItem value="verifier">Verifier</MenuItem>
              </Select>
            </FormControl>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : type === 'login' ? (
              'Login'
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export { AuthForm };
