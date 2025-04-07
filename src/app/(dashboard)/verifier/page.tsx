'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { mockAuth } from '@/lib/mock-auth';
import { Button, Box, Card, CardContent, Typography, FormControl, Select, MenuItem, TextField, InputAdornment } from '@mui/material';
import { useRouter } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  amount: number;
  createdAt: string;
}

type ProjectStatus = 'Pending' | 'Approved' | 'Rejected';

interface Stats {
  submitted: number;
  approved: number;
  totalAmount: number;
}

export default function VerifierPage() {
  const router = useRouter();
  const user = mockAuth.getCurrentUser();

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState<Stats>({
    submitted: 0,
    approved: 0,
    totalAmount: 0,
  });

  const handleLogout = async () => {
    await mockAuth.logout();
    router.push('/login');
  };

  // Mock data
  useEffect(() => {
    // Simulated projects data
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Project A',
        description: 'Description for Project A',
        status: 'Pending',
        amount: 5000,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Project B',
        description: 'Description for Project B',
        status: 'Approved',
        amount: 7500,
        createdAt: new Date().toISOString(),
      },
    ];
    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  // Filter projects
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.createdAt);
        switch (dateFilter) {
          case 'today':
            return projectDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return projectDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return projectDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredProjects(filtered);

    // Update stats
    const newStats = filtered.reduce((acc, project) => ({
      submitted: acc.submitted + 1,
      approved: acc.approved + (project.status === 'Approved' ? 1 : 0),
      totalAmount: acc.totalAmount + project.amount,
    }), {
      submitted: 0,
      approved: 0,
      totalAmount: 0,
    });

    setStats(newStats);
  }, [projects, searchTerm, statusFilter, dateFilter]);

  const handleProjectAction = (projectId: string, action: 'approve' | 'reject') => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status: action === 'approve' ? 'Approved' : 'Rejected' }
        : p
    ));
  };

  return (
    <ProtectedRoute requiredRole="verifier">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Verifier Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>{user?.email}</span>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Box sx={{ mb: 4 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Submitted
                </Typography>
                <Typography variant="h4">{stats.submitted}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Approved
                </Typography>
                <Typography variant="h4">{stats.approved}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h4">${stats.totalAmount.toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </div>
        </Box>

        <Box sx={{ mb: 4 }}>
          <div className="flex flex-wrap gap-4">
            <FormControl size="small">
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
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
          </div>
        </Box>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id}>
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {project.description}
                </Typography>
                <Typography>Status: {project.status}</Typography>
                <Typography>Amount: ${project.amount.toLocaleString()}</Typography>
                <Box sx={{ mt: 2 }}>
                  {project.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleProjectAction(project.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleProjectAction(project.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
