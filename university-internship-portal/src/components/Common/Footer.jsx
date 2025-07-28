// src/components/Common/Footer.jsx
import React from 'react';
import { Box, Typography, Container, Link, IconButton } from '@mui/material'; // <-- Add IconButton here
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // Pushes footer to the bottom
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} University Internship Portal. All rights reserved.
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Terms of Service
          </Link>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Contact Us
          </Link>
        </Box>
        <Box sx={{ mt: 2 }}>
          <IconButton // This IconButton was not defined
            color="inherit"
            aria-label="GitHub"
            component={Link}
            href="https://github.com/your-repo" // Replace with your GitHub
            target="_blank"
            rel="noopener"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton // This IconButton was not defined
            color="inherit"
            aria-label="LinkedIn"
            component={Link}
            href="https://linkedin.com/in/your-profile" // Replace with your LinkedIn
            target="_blank"
            rel="noopener"
          >
            <LinkedInIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;