// src/components/Internship/InternshipCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';

function InternshipCard({ internship }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/internships/${internship.id}`);
  };

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
          {internship.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {internship.companyName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">{internship.location}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
          {internship.description.substring(0, 100)}...
        </Typography>
        {internship.skillsRequired && internship.skillsRequired.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {internship.skillsRequired.slice(0, 3).map((skill, index) => ( // Show top 3 skills
              <Chip key={index} label={skill} size="small" variant="outlined" color="info" />
            ))}
            {internship.skillsRequired.length > 3 && (
              <Chip label={`+${internship.skillsRequired.length - 3}`} size="small" variant="outlined" color="info" />
            )}
          </Box>
        )}
      </CardContent>
      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="small" onClick={handleViewDetails}>
          View Details
        </Button>
      </Box>
    </Card>
  );
}

export default InternshipCard;

