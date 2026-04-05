import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Box, Typography, Button, Card, CardContent, List, ListItem, Divider, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ExpensesPage() {
  const { expenses, fetchData } = useOutletContext();
  const navigate = useNavigate();

  const handleDeleteExpense = async (id) => {
    if(!window.confirm("Are you sure you want to delete this expense? Balances will be reversed.")) return;
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
          <Typography variant="h4" fontWeight={800} color="text.primary">All Expenses</Typography>
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

      <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {expenses.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No expenses added yet.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {expenses.map((exp, i) => (
                <React.Fragment key={exp._id}>
                  <ListItem sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700}>{exp.name}</Typography>
                        <Chip label={exp.splitType} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.main', height: 24, fontSize: '0.75rem', fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Paid by {exp.payer?.name} • {exp.description || 'No description'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h5" fontWeight={800} color="text.primary">₹{exp.totalAmount}</Typography>
                      <IconButton color="error" onClick={() => handleDeleteExpense(exp._id)} size="large">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {i < expenses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
