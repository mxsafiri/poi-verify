'use client';

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
  AccessTime as AccessTimeIcon,
  VerifiedUser as VerifiedUserIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import type { Project } from '@/types/database';

interface ProjectDetailsModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onAction?: (action: 'verify' | 'reject', project: Project) => void;
}

export function ProjectDetailsModal({
  project,
  open,
  onClose,
  onAction,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#00C853';
      case 'Pending': return '#FFA000';
      case 'Rejected': return '#D32F2F';
      default: return '#757575';
    }
  };

  const statusColor = getStatusColor(project.status);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            {project.name}
          </Typography>
          <Chip
            label={project.status}
            size="small"
            sx={{
              bgcolor: `${statusColor}15`,
              color: statusColor,
              fontWeight: 500,
            }}
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Project Details
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              {project.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="body1">${parseFloat(project.budget || '0').toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Impact Category
              </Typography>
              <Typography variant="body1">{project.metric}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Submission Date
              </Typography>
              <Typography variant="body1">
                {new Date(project.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              NFT Status
            </Typography>
            <Typography variant="body1">
              {project.nft_minted ? 'Minted' : 'Not Minted'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Impact Progress
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimelineIcon sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={70}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    bgcolor: 'success.main',
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            {project.status === 'Pending' && onAction && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onAction('verify', project)}
                >
                  Verify Project
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onAction('reject', project)}
                >
                  Reject Project
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
