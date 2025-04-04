'use client';

import { Box, TextField, Button, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await onSubmit(email, password);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        p: 3, 
        maxWidth: 400, 
        mx: 'auto', 
        mt: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2 
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        {type === 'login' ? 'Login' : 'Sign Up'} to POI-Validation System
      </Typography>
      
      <TextField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
      />
      
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        fullWidth
      />
      
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ 
          bgcolor: '#00C853',
          '&:hover': {
            bgcolor: '#00B34A'
          }
        }}
      >
        {type === 'login' ? 'Login' : 'Sign Up'}
      </Button>

      <Typography align="center" sx={{ mt: 2 }}>
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <MuiLink component={Link} href="/signup">
              Sign up
            </MuiLink>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <MuiLink component={Link} href="/login">
              Login
            </MuiLink>
          </>
        )}
      </Typography>
    </Box>
  );
}
