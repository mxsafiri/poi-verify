'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useAuth } from '@/lib/auth/AuthContext';

const menuItems = [
  { text: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { text: 'Impact projects', href: '/projects', icon: AssignmentIcon },
  { text: 'Profile', href: '/profile', icon: PersonIcon },
  { text: 'Marketplace', href: '/marketplace', icon: StorefrontIcon },
];

const bottomMenuItems = [
  { text: 'Settings', href: '/settings', icon: SettingsIcon },
  { text: 'Support', href: '/support', icon: HelpIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        bgcolor: '#F5F7FA',
        borderRight: '1px solid',
        borderColor: 'divider',
        position: 'fixed',
        left: 0,
        top: 0,
        p: 2,
      }}
    >
      <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>

      <Typography
        variant="overline"
        sx={{ px: 2, color: 'text.secondary', fontWeight: 500 }}
      >
        MAIN
      </Typography>

      <List>
        {menuItems.map(({ text, href, icon: Icon }) => (
          <ListItem
            key={href}
            component={Link}
            href={href}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: pathname === href ? 'primary.main' : 'text.primary',
              bgcolor: pathname === href ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon
                sx={{
                  color: pathname === href ? 'primary.main' : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: pathname === href ? 500 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Typography
        variant="overline"
        sx={{
          px: 2,
          mt: 4,
          color: 'text.secondary',
          fontWeight: 500,
          display: 'block',
        }}
      >
        OTHERS
      </Typography>

      <List>
        {bottomMenuItems.map(({ text, href, icon: Icon }) => (
          <ListItem
            key={href}
            component={Link}
            href={href}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              color: pathname === href ? 'primary.main' : 'text.primary',
              bgcolor: pathname === href ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon
                sx={{
                  color: pathname === href ? 'primary.main' : 'text.secondary',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: pathname === href ? 500 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
