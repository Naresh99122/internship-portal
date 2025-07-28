// src/components/UI/StyledPaper.jsx
import React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/system';

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4), // Consistent padding
  borderRadius: theme.shape.borderRadius * 2, // More rounded than default theme
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)', // More pronounced but soft shadow
  backgroundColor: theme.palette.background.paper, // Use theme's paper background
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 36px rgba(0,0,0,0.12)', // Slightly larger shadow on hover
  },
}));

function StyledPaper(props) {
  return <CustomPaper {...props}>{props.children}</CustomPaper>;
}

export default StyledPaper;