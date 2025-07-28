// src/components/UI/CustomButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme, variant, color }) => ({
  borderRadius: theme.shape.borderRadius, // Use theme's border radius
  textTransform: 'none', // Prevent uppercase by default
  fontWeight: 600,
  padding: '10px 20px',
  boxShadow: 'none', // Remove default Material-UI shadow
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Add subtle shadow on hover
  },
  ...(variant === 'contained' && color === 'primary' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
    color: '#fff',
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    },
  }),
  // Add more custom styles based on variant/color props
}));

function CustomButton(props) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}

export default CustomButton;