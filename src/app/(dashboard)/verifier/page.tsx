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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { supabase } from '@/lib/supabase';
import { useVerifier } from '@/lib/hooks/useVerifier';
import { ProjectCard } from '@/components/ui/project-card';
import { ProjectDetailsModal } from '@/components/ui/project-details-modal';
import { sendStatusUpdateEmail } from '@/lib/email';
import type { Project, ProjectStatus } from '@/types/database';

export default function VerifierPage() {
  const router = useRouter();
  const { isVerifier, loading: verifierLoading } = useVerifier();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
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
            status: project.status as ProjectStatus,
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
        status: action === 'verify' ? ('Approved' as const) : ('Rejected' as const),
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
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              displayEmpty
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Submitted
            </Typography>
            <Typography variant="h4">{stats.submitted}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Approved
            </Typography>
            <Typography variant="h4">{stats.approved}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Amount
            </Typography>
            <Typography variant="h4">${stats.totalAmount.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onView={() => setSelectedProject(project)}
            onAction={handleProjectAction}
            isVerifier
          />
        ))}
      </Box>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onAction={handleProjectAction}
          isVerifier
        />
      )}
    </Box>
  );
}
