import React from 'react';
import { useOutletContext } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { Box, Typography, Card, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Paper } from '@mui/material';

export default function UsersPage() {
  const { users, fetchData } = useOutletContext();

  return (
    <Box sx={{ mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">Manage Users</Typography>
      </Box>
      <Box display="flex" flexDirection="row" gap={2}>
      <Box sx={{ mb: 4, width: '50%' }}>
        <UserForm onUserAdded={fetchData} />
      </Box>

      <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)', width: '50%' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight={600}>Group Members</Typography>
        </Box>
        
        {users.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No users added yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {users.map((u, i) => (
              <React.Fragment key={u._id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {u.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={u.name}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondary={`${u.email} ${u.mobile ? `• ${u.mobile}` : ''}`}
                  />
                </ListItem>
                {i < users.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
      </Box>
    </Box>
  );
}
