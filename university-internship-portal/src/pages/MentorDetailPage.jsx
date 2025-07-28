// src/pages/MentorDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Avatar, Chip, Button, Link as MuiLink } from '@mui/material';
import api from '../services/api';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function MentorDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await api.get(`/mentors/${id}`); // Backend endpoint to get a single mentor by ID
        setMentor(response.data);
      } catch (err) {
        console.error('Error fetching mentor details:', err);
        setError('Failed to load mentor details. This mentor might not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!mentor) return <Container sx={{ py: 4 }}><Alert severity="info">Mentor not found.</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          src={mentor.profilePictureUrl}
          sx={{ width: 120, height: 120, mb: 3, bgcolor: 'secondary.main', fontSize: '3rem' }}
        >
          {mentor.firstName?.[0]}{mentor.lastName?.[0]}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {mentor.firstName} {mentor.lastName}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon /> {mentor.jobTitle} at {mentor.company}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon /> Industry: {mentor.industry || 'N/A'}
        </Typography>

        {mentor.bio && (
          <Box sx={{ my: 3, textAlign: 'left', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>About Me</Typography>
            <Typography variant="body1" paragraph>{mentor.bio}</Typography>
          </Box>
        )}

        {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
          <Box sx={{ my: 3, textAlign: 'left', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>Areas of Expertise</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mentor.expertiseAreas.map((area, index) => (
                <Chip key={index} label={area} icon={<SchoolIcon />} color="primary" variant="outlined" size="medium" />
              ))}
            </Box>
          </Box>
        )}

        {mentor.skills && mentor.skills.length > 0 && (
          <Box sx={{ my: 3, textAlign: 'left', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mentor.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="secondary" variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
        )}

        {mentor.interests && mentor.interests.length > 0 && (
          <Box sx={{ my: 3, textAlign: 'left', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>Interests</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mentor.interests.map((interest, index) => (
                <Chip key={index} label={interest} color="info" variant="outlined" size="small" />
              ))}
            </Box>
          </Box>
        )}

        {mentor.availability && (
          <Box sx={{ my: 3, textAlign: 'left', width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>Availability</Typography>
            <Typography variant="body1" paragraph>{mentor.availability}</Typography>
          </Box>
        )}

        {mentor.linkedinProfileUrl && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<LinkedInIcon />}
            href={mentor.linkedinProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 3, px: 3, py: 1.2, borderRadius: 1 }}
          >
            View LinkedIn Profile
          </Button>
        )}
      </Paper>
    </Container>
  );
}

export default MentorDetailPage;