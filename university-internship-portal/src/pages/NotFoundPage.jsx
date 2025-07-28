// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={6} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'warning.main', mb: 3 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)} // Go back to previous page
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default NotFoundPage;