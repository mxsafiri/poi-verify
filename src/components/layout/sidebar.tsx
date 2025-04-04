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

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        backgroundColor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          POI Validation
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              key={item.text}
              component={Link}
              href={item.href}
              sx={{
                color: pathname === item.href ? 'primary.main' : 'text.primary',
                bgcolor: pathname === item.href ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <Icon color={pathname === item.href ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', position: 'absolute', bottom: 0, width: '100%' }}>
        <List>
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListItem
                key={item.text}
                component={Link}
                href={item.href}
                sx={{
                  color: pathname === item.href ? 'primary.main' : 'text.primary',
                  bgcolor: pathname === item.href ? 'action.selected' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <Icon color={pathname === item.href ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
