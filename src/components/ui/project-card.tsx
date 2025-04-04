'use client';

import { Card, CardContent, Box, Typography, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { Project } from '@/types/database';

interface ProjectCardProps {
  project: Project;
  onAction?: (action: 'verify' | 'reject', project: Project) => void;
  showActions?: boolean;
  onClick?: () => void;
}

export function ProjectCard({ project, onAction, showActions = false, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#00C853';
      case 'Pending': return '#FFA000';
      case 'Rejected': return '#D32F2F';
      default: return '#757575';
    }
  };

  const formatBudget = (budget: string | null) => {
    if (!budget) return '$0';
    const amount = parseFloat(budget);
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {project.name}
            </Typography>
            {project.nft_minted && (
              <Chip
                icon={<VerifiedIcon />}
                label="NFT Minted"
                size="small"
                sx={{
                  bgcolor: '#E8F5E9',
                  color: '#00C853',
                  mt: 1,
                }}
              />
            )}
          </Box>
          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip
              label={project.status}
              size="small"
              sx={{
                bgcolor: `${getStatusColor(project.status)}15`,
                color: getStatusColor(project.status),
                fontWeight: 500,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Budget: {formatBudget(project.budget)}
            </Typography>
          </Box>

          {showActions && project.status === 'Pending' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Chip
                label="Verify"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.('verify', project);
                }}
                sx={{
                  bgcolor: '#00C853',
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#00B34A',
                  },
                }}
              />
              <Chip
                label="Reject"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.('reject', project);
                }}
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
