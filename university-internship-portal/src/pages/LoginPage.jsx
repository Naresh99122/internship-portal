// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Your AuthContext for login logic
import api from '../services/api'; // Your configured Axios instance for API calls

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // To show loading state on button
  const navigate = useNavigate();
  const { login } = useAuth(); // Destructure the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role } = response.data;

      login(token, role); // Use the login function from AuthContext to set user state and token

      // Redirect based on the user's role
      if (role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (role === 'MENTOR') {
        navigate('/mentor/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        // Fallback for unexpected roles
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, borderRadius: 2 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to access your internship and mentorship opportunities.
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username or Email"
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 1 }}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Button onClick={() => navigate('/register')} size="small">Register now</Button>
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            <Button onClick={() => alert('Forgot password functionality not yet implemented.')} size="small">Forgot password?</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;