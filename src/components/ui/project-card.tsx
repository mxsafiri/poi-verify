'use client';

import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  amount: number;
}

interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onAction?: (action: 'approve' | 'reject') => void;
  isVerifier?: boolean;
}

export function ProjectCard({ project, onView, onAction, isVerifier }: ProjectCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{project.title}</Typography>
        <Typography color="textSecondary" gutterBottom>
          {project.description}
        </Typography>
        <Typography>Status: {project.status}</Typography>
        <Typography>Amount: ${project.amount.toLocaleString()}</Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {onView && (
            <Button size="small" variant="outlined" onClick={onView}>
              View Details
            </Button>
          )}
          
          {isVerifier && project.status === 'Pending' && onAction && (
            <>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => onAction('approve')}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onAction('reject')}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
