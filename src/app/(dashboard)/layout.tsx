'use client';

import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Sidebar } from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AddIcon from '@mui/icons-material/Add';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleNewProject = () => {
    router.push('/projects/new');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <AppBar
        position="fixed"
        sx={{
          ml: '250px',
          width: 'calc(100% - 250px)',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            POI Validation System
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewProject}
            sx={{
              mr: 2,
              bgcolor: '#00C853',
              '&:hover': {
                bgcolor: '#00B34A',
              },
            }}
          >
            New Project
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleSignOut}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: '250px',
          bgcolor: '#F5F7FA',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
