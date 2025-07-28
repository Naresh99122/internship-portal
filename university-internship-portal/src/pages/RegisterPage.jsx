// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import api from '../services/api'; // Your configured Axios instance
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // Default role
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      setSuccess(response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      // Optionally redirect to login after a short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, borderRadius: 2 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Register Account
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Register As</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Register As"
              onChange={(e) => setRole(e.target.value)}
              disabled // Admins should typically be created manually or through a separate admin page
            >
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="MENTOR">Mentor</MenuItem>
              {/* <MenuItem value="ADMIN">Admin</MenuItem> Admins typically aren't self-registered */}
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 1 }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Button onClick={() => navigate('/login')} size="small">Login here</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;