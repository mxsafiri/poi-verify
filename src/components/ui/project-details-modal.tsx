'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarTodayIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import type { Project } from '@/types/database';

interface ProjectDetailsModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export default function ProjectDetailsModal({ project, open, onClose }: ProjectDetailsModalProps) {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{project.name}</Typography>
          <Chip
            label={project.status}
            color={getStatusColor(project.status)}
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Impact Metric
              </Typography>
              <Typography variant="body1">{project.metric || 'Not specified'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="body1">{project.budget || 'Not specified'}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1">{project.status}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="overline" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body1">{formatDate(project.created_at)}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="overline" color="text.secondary">
            Verification Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={project.status === 'Approved' ? 100 : project.status === 'Pending' ? 50 : 0}
            sx={{ mt: 1 }}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          {project.nft_minted && (
            <Chip
              icon={<CheckIcon />}
              label="NFT Minted"
              color="success"
              variant="outlined"
            />
          )}
          {project.funded && (
            <Chip
              icon={<AttachMoneyIcon />}
              label="Funded"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
