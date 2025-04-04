'use client';

import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddCircle as AddCircleIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useVerifier } from '@/lib/hooks/useVerifier';

const drawerWidth = 250;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isVerifier } = useVerifier();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'New Project',
      icon: <AddCircleIcon />,
      path: '/projects/new',
    },
    ...(isVerifier ? [
      {
        text: 'Verifier Dashboard',
        icon: <VerifiedUserIcon />,
        path: '/verifier',
      },
    ] : []),
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.default',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'primary.main' }}>
          POI Validation
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: pathname === item.path ? 'primary.main' : 'text.primary',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export { Sidebar };
