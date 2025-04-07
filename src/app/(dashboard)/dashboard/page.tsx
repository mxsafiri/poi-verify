'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { mockAuth } from '@/lib/mock-auth';
import { Button, Box, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  amount: number;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const user = mockAuth.getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Mock data
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Project X',
        description: 'Description for Project X',
        status: 'Draft',
        amount: 10000,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Project Y',
        description: 'Description for Project Y',
        status: 'Pending',
        amount: 15000,
        createdAt: new Date().toISOString(),
      },
    ];
    setProjects(mockProjects);
  }, []);

  const handleLogout = async () => {
    await mockAuth.logout();
    router.push('/login');
  };

  const handleCreateProject = () => {
    const newProject: Project = {
      id: 'new-' + Math.random().toString(36).substr(2, 9),
      title: 'New Project',
      description: 'Description for new project',
      status: 'Draft',
      amount: 0,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  return (
    <ProtectedRoute requiredRole="user">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Project Owner Dashboard</h1>
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
                  Total Projects
                </Typography>
                <Typography variant="h4">{projects.length}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Review
                </Typography>
                <Typography variant="h4">
                  {projects.filter(p => p.status === 'Pending').length}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Investment
                </Typography>
                <Typography variant="h4">
                  ${projects.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Box>

        <div className="mb-6">
          <Button variant="contained" color="primary" onClick={handleCreateProject}>
            Create New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent>
                <Typography variant="h6">{project.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {project.description}
                </Typography>
                <Typography>Status: {project.status}</Typography>
                <Typography>Amount: ${project.amount.toLocaleString()}</Typography>
                <Box sx={{ mt: 2 }}>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {/* Add edit functionality */}}
                    >
                      Edit
                    </Button>
                    {project.status === 'Draft' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setProjects(projects.map(p => 
                            p.id === project.id ? { ...p, status: 'Pending' } : p
                          ));
                        }}
                      >
                        Submit for Review
                      </Button>
                    )}
                  </div>
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
