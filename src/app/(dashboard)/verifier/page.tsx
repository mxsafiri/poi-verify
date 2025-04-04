'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { supabase } from '@/lib/supabase';
import { useVerifier } from '@/lib/hooks/useVerifier';
import { ProjectCard } from '@/components/ui/project-card';
import { ProjectDetailsModal } from '@/components/ui/project-details-modal';
import { sendStatusUpdateEmail } from '@/lib/email';
import type { Project } from '@/types/database';

export default function VerifierPage() {
  const router = useRouter();
  const { isVerifier, loading: verifierLoading } = useVerifier();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stats, setStats] = useState({
    submitted: 0,
    approved: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (!isVerifier && !verifierLoading) {
      router.push('/dashboard');
    }
  }, [isVerifier, verifierLoading, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: projectsData, error } = await supabase
          .from('projects')
          .select('*, users(email)')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (projectsData) {
          const typedProjects = projectsData.map(project => ({
            ...project,
            status: project.status as 'Pending' | 'Approved' | 'Rejected',
            users: project.users || undefined
          }));

          setProjects(typedProjects);
          setFilteredProjects(typedProjects);

          const stats = {
            submitted: typedProjects.length,
            approved: typedProjects.filter(p => p.status === 'Approved').length,
            totalAmount: typedProjects.reduce((sum, p) => sum + (parseFloat(p.budget || '0') || 0), 0)
          };

          setStats(stats);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (isVerifier) {
      fetchProjects();
    }
  }, [isVerifier, dateFilter, statusFilter]);

  const handleProjectAction = async (action: 'verify' | 'reject', project: Project) => {
    try {
      const updates = {
        status: action === 'verify' ? 'Approved' : 'Rejected',
        nft_minted: action === 'verify',
        funded: action === 'verify',
      };

      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', project.id);

      if (error) throw error;

      // Send email notification
      if (project.users?.email) {
        await sendStatusUpdateEmail({ ...project, ...updates }, project.users.email);
      }

      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error(`Error ${action}ing project:`, error);
      alert(`Failed to ${action} project. Please try again.`);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filteredResults = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (statusFilter !== 'all') {
        filteredResults = filteredResults.filter(project => project.status === statusFilter);
      }

      setFilteredProjects(filteredResults);
    };

    applyFilters();
  }, [projects, searchTerm, statusFilter]);

  if (verifierLoading) return null;
  if (!isVerifier) return null;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight="600">Projects to be Approved</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 days</MenuItem>
              <MenuItem value="all">All time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Projects Submitted
              </Typography>
              <Typography variant="h4" fontWeight="600">
                {stats.submitted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Projects Approved
              </Typography>
              <Typography variant="h4" fontWeight="600">
                {stats.approved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Amount Requested
              </Typography>
              <Typography variant="h4" fontWeight="600">
                ${stats.totalAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <ProjectCard
              project={project}
              showActions={project.status === 'Pending'}
              onAction={handleProjectAction}
              onClick={() => setSelectedProject(project)}
            />
          </Grid>
        ))}
      </Grid>

      <ProjectDetailsModal
        project={selectedProject}
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onAction={handleProjectAction}
      />
    </Box>
  );
}
