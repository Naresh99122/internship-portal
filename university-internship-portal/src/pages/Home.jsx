// src/pages/Home.jsx
import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, useTheme } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const theme = useTheme();

  const getStartedText = isAuthenticated
    ? `Welcome back, ${user.username}! Navigate to your dashboard.`
    : "Ready to streamline your internship journey?";
  const getStartedButtonText = isAuthenticated ? "Go to Dashboard" : "Get Started";
  const getStartedButtonPath = isAuthenticated
    ? (user.role === 'STUDENT' ? '/student/dashboard' : user.role === 'MENTOR' ? '/mentor/dashboard' : '/admin/dashboard')
    : '/register';

  // --- Common Styles for Reusability and Consistency ---
  // Styles for the individual feature cards (Student, Mentor, Admin)
  const commonFeatureCardStyles = {
    p: theme.spacing(4), // Ample and consistent padding inside cards
    textAlign: 'center',
    height: '100%', // Essential for Grid's alignItems="stretch" to ensure equal row height
    borderRadius: theme.shape.borderRadius * 2, // Consistent, slightly more rounded corners
    boxShadow: theme.shadows[4], // Subtle initial shadow for depth
    display: 'flex', // Enable Flexbox for precise internal layout
    flexDirection: 'column', // Stack children vertically
    justifyContent: 'space-between', // Distributes space evenly, pushing button to bottom
    alignItems: 'center', // Centers content horizontally within the card
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth hover effects
    '&:hover': {
      transform: 'translateY(-10px)', // Distinct lift effect on hover
      boxShadow: theme.shadows[10], // More pronounced shadow on hover
    },
    backgroundColor: theme.palette.background.paper, // Ensure clean white background
  };

  // Styles for icons within the feature cards
  const commonIconStyles = {
    fontSize: { xs: 70, sm: 80, md: 90 }, // Larger, more impactful icons
    mb: theme.spacing(3), // Consistent margin below icons
  };

  // Styles for the description text within feature cards, ensuring consistent height
  const commonDescriptionStyles = {
    mb: theme.spacing(3),
    flexGrow: 1, // Allows description to take up available vertical space
    lineHeight: 1.6, // Improves text readability
    // CRITICAL for vertical alignment: set a min-height for the text block.
    // Adjust these pixel values based on the *longest* description content to ensure all cards match.
    minHeight: { xs: 'auto', sm: '80px', md: '120px' }, // Increased minHeight for better alignment
    display: 'flex', // Enable flexbox for inner text centering if content is short
    alignItems: 'center', // Vertically center text within its minHeight box
    justifyContent: 'center', // Horizontally center text
  };

  // Styles for the buttons within feature cards
  const commonCardButtonStyles = {
    borderRadius: theme.shape.borderRadius,
    mt: 'auto', // Push button to the bottom (redundant if flexGrow on text works, but good fallback)
    fontWeight: 'bold',
    px: theme.spacing(3), // Moderate horizontal padding
    py: theme.spacing(1.5), // Moderate vertical padding
    fontSize: { xs: '0.9rem', md: '1rem' }, // Consistent font size
  };
  // --- End Common Styles ---


  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, minHeight: '80vh' }}> {/* Increased overall page padding */}
      {/* Hero Section */}
      <Box sx={{
        textAlign: 'center',
        mb: { xs: 8, md: 12 }, // More margin below hero for separation
        py: { xs: 6, md: 8 }, // More vertical padding
        px: { xs: 3, md: 6 }, // More horizontal padding
        borderRadius: theme.shape.borderRadius * 3, // Very rounded corners for soft look
        background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
        color: 'white',
        boxShadow: theme.shadows[8], // Stronger shadow for prominence
        transition: 'box-shadow 0.3s ease-in-out', // Subtle transition on hero
        '&:hover': {
          boxShadow: theme.shadows[12],
        },
      }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: theme.spacing(2),
            fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' }, // Larger hero title for impact
            letterSpacing: '0.02em', // Subtle letter spacing
            lineHeight: 1.2, // Tighter line height for large titles
          }}
        >
          Your University Internship & Mentor Portal
        </Typography>
        <Typography variant="h6" sx={{
          mb: theme.spacing(5), // More margin below subtitle
          maxWidth: '850px', // Wider subtitle for longer descriptions
          mx: 'auto',
          fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.5rem' }, // Larger subtitle text
          opacity: 0.9, // Slightly transparent for depth
          lineHeight: 1.6, // Better readability
        }}>
          Connecting Students with Opportunities and Guidance for Success,
          streamlining pathways to professional growth within our vibrant academic community.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            py: { xs: 1.8, md: 2.2 }, // Even larger button padding
            px: { xs: 5, md: 7 }, // Even larger horizontal padding
            borderRadius: theme.shape.borderRadius * 2, // Consistent with hero, very rounded
            backgroundColor: theme.palette.secondary.main, // Accent color for main CTA
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
              boxShadow: theme.shadows[8], // Add hover shadow for consistency
            },
            fontSize: { xs: '1.1rem', md: '1.3rem' }, // Larger font for CTA
            fontWeight: 'bold',
          }}
          onClick={() => navigate(getStartedButtonPath)}
        >
          {getStartedButtonText}
        </Button>
      </Box>

      {/* "How It Works" Section Title */}
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'primary.dark', mb: { xs: 5, md: 8 } }} // Ample margin below section title
      >
        How It Works
      </Typography>

      {/* Feature Cards Grid - Ensure Grid item heights are stretched */}
      <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch" sx={{ mb: { xs: 8, md: 12 } }}>
        {/* Card 1: For Students */}
        <Grid item xs={12} md={4}>
          <Paper elevation={8} sx={commonFeatureCardStyles}>
            <SchoolIcon color="primary" sx={commonIconStyles} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: theme.spacing(1.5) }}>
              For Students
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={commonDescriptionStyles}>
              Discover curated internship listings, apply seamlessly, and get matched with experienced mentors based on your skills and interests.
              Access tailored support to kickstart your professional journey.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={commonCardButtonStyles}
              onClick={() => navigate('/internships')}
            >
              Find Internships
            </Button>
          </Paper>
        </Grid>

        {/* Card 2: For Mentors */}
        <Grid item xs={12} md={4}>
          <Paper elevation={8} sx={commonFeatureCardStyles}>
            <PeopleAltIcon color="secondary" sx={commonIconStyles} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: theme.spacing(1.5) }}>
              For Mentors
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={commonDescriptionStyles}>
              Share your expertise, guide the next generation, and make a real impact on student careers through personalized mentorship.
              Connect with eager minds and foster future talent.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={commonCardButtonStyles}
              onClick={() => navigate('/register')}
            >
              Become a Mentor
            </Button>
          </Paper>
        </Grid>

        {/* Card 3: For Admins */}
        <Grid item xs={12} md={4}>
          <Paper elevation={8} sx={commonFeatureCardStyles}>
            <WorkOutlineIcon sx={{ ...commonIconStyles, color: 'success.main' }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: theme.spacing(1.5) }}>
              For Admins
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={commonDescriptionStyles}>
              Efficiently manage internships, users, and leverage smart matching to optimize placements and track progress.
              Streamline operations for successful student outcomes.
            </Typography>
            <Button
              variant="outlined"
              size="large"
              sx={commonCardButtonStyles}
              onClick={() => navigate('/admin/dashboard')}
            >
              Admin Login
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Final Call to Action Section */}
      <Box sx={{
        textAlign: 'center',
        py: { xs: 6, md: 9 }, // More vertical padding for final CTA
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius * 3, // Very rounded corners for elegance
        boxShadow: theme.shadows[8], // Stronger shadow for a lifted, important feel
        px: { xs: 3, md: 8 },
        transition: 'box-shadow 0.3s ease-in-out', // Subtle transition on CTA
        '&:hover': {
          boxShadow: theme.shadows[12],
        },
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          mb: theme.spacing(3),
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Larger title
        }}>
          Ready to take the next step?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{
          mb: theme.spacing(6),
          maxWidth: '800px', // Wider text area
          mx: 'auto',
          fontSize: { xs: '1.1rem', md: '1.25rem' }, // Larger text
          lineHeight: 1.7,
        }}>
          Join our university's exclusive portal to find your perfect internship or connect with a mentor who can guide your career path.
          Your future starts now!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            py: { xs: 1.8, md: 2.2 },
            px: { xs: 5, md: 7 },
            borderRadius: theme.shape.borderRadius * 2, // Very rounded
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: theme.shadows[8], // Add hover shadow for consistency
            },
          }}
          onClick={() => navigate(getStartedButtonPath)}
        >
          {getStartedButtonText}
        </Button>
      </Box>
    </Container>
  );
}

export default Home;