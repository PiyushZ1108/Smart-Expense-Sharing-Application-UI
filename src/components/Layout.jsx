import React, { useState, useEffect } from 'react';
import { Outlet, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { api } from '../api';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, AppBar, Toolbar, Avatar
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutorenewIcon from '@mui/icons-material/Autorenew';

const drawerWidth = 260;

export default function Layout() {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [uRes, eRes, bRes, sRes] = await Promise.all([
        api.getUsers(),
        api.getExpenses(),
        api.getBalances(),
        api.getSettlements()
      ]);
      const usersData = uRes.data?.data || [];
      const expensesData = eRes.data?.data || [];
      const balancesData = bRes.data?.data || [];
      const settlementsData = sRes.data?.data || [];

      setUsers(usersData);
      setExpenses(expensesData.filter(e => !e.isDeleted));
      
      setBalances(
        balancesData[0] === 'No balances found' 
          ? [] 
          : balancesData.map(b => typeof b === 'string' ? b : `${b.userFromName} owes ${b.userToName}: ₹${b.amount}`)
      );
      
      setSettlements(
        settlementsData[0] === 'All balances are settled' 
          ? [] 
          : settlementsData.map(s => typeof s === 'string' ? s : `${s.userFromName} owes ${s.userToName}: ₹${s.amount}`)
      );
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Add Expense', icon: <AddCircleIcon />, path: '/add-expense' },
    { text: 'Current Balances', icon: <AccountBalanceWalletIcon />, path: '/balances' },
    { text: 'Settlements', icon: <AutorenewIcon />, path: '/settlements' },
    { text: 'All Expenses', icon: <ReceiptLongIcon />, path: '/expenses' },
    { text: 'Manage Users', icon: <GroupIcon />, path: '/users' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Navigation */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'common.white',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
            Smart Split
          </Typography>
          
        </Box>
        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={RouterNavLink}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                      '&:hover': {
                         backgroundColor: 'primary.light',
                      }
                    },
                    backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, color: isActive ? 'primary.main' : 'text.secondary' }} 
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Optional App Bar for Top Nav Context */}
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <Avatar sx={{ bgcolor: 'secondary.main' }}>A</Avatar>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1200, margin: '0 auto' }}>
          <Outlet context={{ users, expenses, balances, settlements, fetchData }} />
        </Box>
      </Box>
    </Box>
  );
}
