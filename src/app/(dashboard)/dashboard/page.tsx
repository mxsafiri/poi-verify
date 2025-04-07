'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProjectCard } from '@/components/ui/project-card';
import { getProjects } from '@/lib/db';
import type { Project } from '@/types/database';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { mockAuth } from '@/lib/mock-auth';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const router = useRouter();
  const user = mockAuth.getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return;
      const userProjects = await getProjects(user.id);
      setProjects(userProjects);
      setLoading(false);
    };

    loadProjects();
  }, [user]);

  const handleLogout = async () => {
    await mockAuth.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  return (
    <ProtectedRoute requiredRole="user">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h1" gutterBottom>
            Project Owner Dashboard
          </Typography>
          <div className="flex items-center gap-4">
            <span>{user?.email}</span>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="grid gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
              <p>No projects yet. Start by creating a new project.</p>
            </div>
          </div>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
        )}
      </Container>
    </ProtectedRoute>
  );
};

export default DashboardPage;
