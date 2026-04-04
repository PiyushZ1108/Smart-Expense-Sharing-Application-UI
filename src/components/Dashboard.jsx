import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function Dashboard({ balances, settlements, expenses, onDeleteExpense }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccountBalanceWalletIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Overview Balances</Typography>
            </Box>
            {balances.length === 0 ? (
              <Typography color="text.secondary">No balances found</Typography>
            ) : (
              <List disablePadding>
                {balances.map((b, i) => (
                  <ListItem key={i} disablePadding sx={{ py: 1, borderBottom: i === balances.length -1 ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
                    <Typography variant="body1">{b}</Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutorenewIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Quick Settlements</Typography>
            </Box>
            {settlements.length === 0 ? (
              <Typography color="text.secondary">All settled up!</Typography>
            ) : (
              <List disablePadding>
                {settlements.map((s, i) => (
                  <ListItem key={i} disablePadding sx={{ py: 1, borderBottom: i === settlements.length -1 ? 'none' : '1px solid rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label="Settle" size="small" color="success" sx={{ borderRadius: 1 }} />
                      <Typography variant="body1">{s}</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <CardContent>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>Recent Expenses</Typography>
          </Box>
          {expenses.length === 0 ? (
            <Typography color="text.secondary">No expenses added yet.</Typography>
          ) : (
            <List disablePadding>
              {expenses.map((exp, i) => (
                <React.Fragment key={exp._id}>
                  <ListItem 
                    sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
                    disablePadding
                  >
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>{exp.name}</Typography>
                        <Chip label={exp.splitType} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.main', height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Paid by {exp.payer?.name} • {exp.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" fontWeight={700}>₹{exp.totalAmount}</Typography>
                      <IconButton color="error" onClick={() => onDeleteExpense(exp._id)}>
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
