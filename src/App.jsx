import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import ExpensesPage from './pages/ExpensesPage';
import AddExpensePage from './pages/AddExpensePage';
import BalancesPage from './pages/BalancesPage';
import SettlementsPage from './pages/SettlementsPage';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f3f4f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="add-expense" element={<AddExpensePage />} />
            <Route path="balances" element={<BalancesPage />} />
            <Route path="settlements" element={<SettlementsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
