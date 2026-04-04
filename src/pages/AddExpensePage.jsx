import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { Box, Typography, Button, Alert } from '@mui/material';

export default function AddExpensePage() {
  const { users, fetchData } = useOutletContext();
  const navigate = useNavigate();

  const handleExpenseAdded = () => {
    fetchData();
    navigate('/expenses'); // Redirect to expenses after adding
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">Add Expense</Typography>
        <Typography variant="body1" color="text.secondary">Record a new transaction and let Smart Split handle the math.</Typography>
      </Box>

      {users && users.length > 0 ? (
        <ExpenseForm users={users} onExpenseAdded={handleExpenseAdded} />
      ) : (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => navigate('/users')}>
              Go to Manage Users
            </Button>
          }
        >
          You need to add users before you can add an expense.
        </Alert>
      )}
    </Box>
  );
}
