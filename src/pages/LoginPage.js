import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, Stack } from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://localhost:7176/api/Admin/login', {
        username,
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/customers');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
      <Card sx={{ minWidth: 350, boxShadow: 6, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom fontWeight={700}>
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} required fullWidth autoFocus />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 3, boxShadow: 3 }}>
                Login
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;