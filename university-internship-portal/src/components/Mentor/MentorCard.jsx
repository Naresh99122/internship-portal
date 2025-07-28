// src/components/Mentor/MentorCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, LinearProgress, Chip } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import ScienceIcon from '@mui/icons-material/Science';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';

function MentorCard({ mentor, matchScore }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    // Navigate to a mentor detail page, or open a modal
    navigate(`/mentors/${mentor.id}`); // Assuming you'll add this route
  };

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.2s ease-in-out' } }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Avatar
          sx={{ bgcolor: deepPurple[500], width: 80, height: 80, mb: 2, fontSize: '2rem' }}
          src={mentor.profilePictureUrl}
          alt={`${mentor.firstName} ${mentor.lastName}`}
        >
          {mentor.firstName && mentor.firstName[0]}{mentor.lastName && mentor.lastName[0]}
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
          {mentor.firstName} {mentor.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {mentor.jobTitle} at {mentor.company}
        </Typography>
        {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5, mb: 1 }}>
            {mentor.expertiseAreas.slice(0, 2).map((area, index) => ( // Show top 2 expertise areas
              <Chip key={index} icon={<ScienceIcon fontSize="small" />} label={area} size="small" color="secondary" variant="outlined" />
            ))}
            {mentor.expertiseAreas.length > 2 && (
              <Chip label={`+${mentor.expertiseAreas.length - 2}`} size="small" color="secondary" variant="outlined" />
            )}
          </Box>
        )}
        {matchScore !== undefined && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
              Match Score: {matchScore.toFixed(0)}%
            </Typography>
            <LinearProgress variant="determinate" value={matchScore} sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.300', '& .MuiLinearProgress-bar': { bgcolor: matchScore > 75 ? 'success.main' : matchScore > 50 ? 'warning.main' : 'error.main' } }} />
          </Box>
        )}
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="small" onClick={handleViewProfile}>
          View Profile
        </Button>
      </Box>
    </Card>
  );
}

export default MentorCard;