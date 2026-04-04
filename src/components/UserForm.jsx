import React, { useState } from 'react';
import { api } from '../api';
import { Card, CardContent, CardHeader, TextField, Button, Box, Alert } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function UserForm({ onUserAdded }) {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.createUser(formData);
      setFormData({ name: '', email: '', mobile: '' });
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
      <CardHeader 
        title="Add New Participant" 
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        avatar={<PersonAddIcon color="primary" />}
        sx={{ pb: 0 }}
      />
      <CardContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="Name" 
            variant="outlined" 
            required 
            fullWidth 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            size="small"
          />
          <TextField 
            label="Email" 
            variant="outlined" 
            type="email" 
            required 
            fullWidth 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            size="small"
          />
          <TextField 
            label="Mobile" 
            variant="outlined" 
            fullWidth 
            value={formData.mobile} 
            onChange={e => setFormData({...formData, mobile: e.target.value})}
            size="small"
          />
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            disabled={loading}
            disableElevation
            sx={{ py: 1 }}
          >
            {loading ? 'Adding...' : 'Add User'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
