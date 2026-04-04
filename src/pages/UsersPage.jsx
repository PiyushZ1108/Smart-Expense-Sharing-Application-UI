import React from 'react';
import { useOutletContext } from 'react-router-dom';
import UserForm from '../components/UserForm';
import { Box, Typography, Card, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Paper } from '@mui/material';

export default function UsersPage() {
  const { users, fetchData } = useOutletContext();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">Manage Users</Typography>
        <Typography variant="body1" color="text.secondary">Add new participants to the group before splitting expenses.</Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <UserForm onUserAdded={fetchData} />
      </Box>

      <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
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
  );
}
