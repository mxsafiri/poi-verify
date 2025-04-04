'use client';

import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ProjectCard from '@/components/ui/project-card';
import { useEffect, useState } from 'react';
import { Project } from '@/types/database';
import { getProjects } from '@/lib/db';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (user?.id) {
        const userProjects = await getProjects(user.id);
        setProjects(userProjects);
        setLoading(false);
      }
    }

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Projects
      </Typography>
      
      {projects.length === 0 ? (
        <Typography color="text.secondary">
          No projects found. Create a new project to get started.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
