// src/components/Common/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // Take up most of the viewport height
        color: 'primary.main',
      }}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
}

export default LoadingSpinner;