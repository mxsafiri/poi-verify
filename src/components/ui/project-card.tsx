'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
  onView?: () => void;
  onAction?: (action: 'verify' | 'reject', project: Project) => Promise<void>;
  isVerifier?: boolean;
}

const ProjectCard = ({ project, onView, onAction, isVerifier }: ProjectCardProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {project.name}
          </Typography>
          {isVerifier && project.status === 'Pending' && (
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        <Typography color="text.secondary" sx={{ mb: 2 }} noWrap>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={project.status}
            color={getStatusColor(project.status)}
            size="small"
          />
          {project.nft_minted && (
            <Chip label="NFT Minted" color="primary" size="small" />
          )}
          {project.funded && (
            <Chip label="Funded" color="success" size="small" />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Impact Metric
          </Typography>
          <Typography variant="body2">{project.metric || 'Not specified'}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Budget
          </Typography>
          <Typography variant="body2">${project.budget || '0'}</Typography>
        </Box>

        {onView && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={onView}
              sx={{
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.light' },
              }}
            >
              View Details
            </Button>
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {onAction && project.status === 'Pending' && (
          <>
            <MenuItem
              onClick={() => {
                onAction('verify', project);
                handleMenuClose();
              }}
            >
              Verify Project
            </MenuItem>
            <MenuItem
              onClick={() => {
                onAction('reject', project);
                handleMenuClose();
              }}
            >
              Reject Project
            </MenuItem>
          </>
        )}
      </Menu>
    </Card>
  );
};

export { ProjectCard };
