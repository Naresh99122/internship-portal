// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { useNavigate } from 'react-router-dom';

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <BlockIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.dark' }}>
          Access Denied!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don't have the necessary permissions to view this page.
          Please ensure you are logged in with the correct account role.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default UnauthorizedPage;