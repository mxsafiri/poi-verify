'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/database';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaidIcon from '@mui/icons-material/Paid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    impactUnlocked: 0,
    projectsCount: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
      
      // Calculate statistics
      setStats({
        impactUnlocked: data?.filter(p => p.status === 'Approved').length || 0,
        projectsCount: data?.length || 0,
        totalAmount: data?.reduce((sum, p) => sum + (parseFloat(p.budget || '0') || 0), 0) || 0,
      });
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#00C853';
      case 'Pending': return '#FFA000';
      case 'Rejected': return '#D32F2F';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="600">Impact Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Filter by date
          </Typography>
          <Chip
            label="Today"
            size="small"
            sx={{ bgcolor: '#00C853', color: 'white' }}
          />
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#E8F5E9',
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                  }}
                >
                  <TrendingUpIcon sx={{ color: '#00C853' }} />
                </Box>
                <Typography color="text.secondary">Impact un-locked</Typography>
              </Box>
              <Typography variant="h4" fontWeight="600">
                {stats.impactUnlocked}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#EDE7F6',
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                  }}
                >
                  <AssignmentIcon sx={{ color: '#673AB7' }} />
                </Box>
                <Typography color="text.secondary"># of projects</Typography>
              </Box>
              <Typography variant="h4" fontWeight="600">
                {stats.projectsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: '#E3F2FD',
                    borderRadius: '50%',
                    p: 1,
                    mr: 2,
                  }}
                >
                  <PaidIcon sx={{ color: '#2196F3' }} />
                </Box>
                <Typography color="text.secondary">Total amount</Typography>
              </Box>
              <Typography variant="h4" fontWeight="600">
                ${stats.totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 3 }}>Projects to be Approved</Typography>
      
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="600">
                    {project.name}
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      bgcolor: `${getStatusColor(project.status)}15`,
                      color: getStatusColor(project.status),
                      fontWeight: 500,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Budget: ${parseFloat(project.budget || '0').toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
