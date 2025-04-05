import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 4,
      p: 4
    }}>
      <Typography variant="h2" component="h1" gutterBottom>
        POI Verification System
      </Typography>
      <Typography variant="h5" gutterBottom>
        Welcome to the POI Verification System
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link href="/login" passHref>
          <Button variant="contained" color="primary">
            Login
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button variant="outlined" color="primary">
            Sign Up
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
