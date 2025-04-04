'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProjectCard } from '@/components/ui/project-card';
import { getProjects } from '@/lib/db';
import type { Project } from '@/types/database';

const DashboardPage = () => {
  const { user } = useAuth();
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

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading projects...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Projects
      </Typography>
      
      {projects.length === 0 ? (
        <Typography color="text.secondary">
          No projects found. Create a new project to get started.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default DashboardPage;
