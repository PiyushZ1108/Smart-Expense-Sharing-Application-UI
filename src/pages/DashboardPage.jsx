import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { api } from '../api';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function DashboardPage() {
  const { balances, settlements, expenses, fetchData } = useOutletContext();
  const navigate = useNavigate();

  const handleDeleteExpense = async (id) => {
    if(!window.confirm("Are you sure you want to delete this expense? Balances will be reversed if configured.")) return;
    try {
      await api.deleteExpense(id);
      fetchData(); // Refresh everything
    } catch(err) {
      alert("Error deleting expense");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="text.primary">Overview</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/add-expense')}
          disableElevation
        >
          New Expense
        </Button>
      </Box>

      <Dashboard 
        balances={balances} 
        settlements={settlements} 
        expenses={expenses.slice(0, 5)} // Show only recent 5 on dashboard
        onDeleteExpense={handleDeleteExpense} 
      />
    </Box>
  );
}
