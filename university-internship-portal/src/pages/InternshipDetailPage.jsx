// src/pages/InternshipDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Alert, Paper, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function InternshipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user from AuthContext
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(''); // E.g., 'applied', 'error', ''

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await api.get(`/internships/${id}`);
        setInternship(response.data);
      } catch (err) {
        console.error('Error fetching internship details:', err);
        setError('Failed to load internship details. It might not exist or there was a server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== 'STUDENT') {
      alert('You must be logged in as a student to apply.');
      navigate('/login');
      return;
    }
    // You might want a modal here to ask for a cover letter or confirm
    const confirmApply = window.confirm("Are you sure you want to apply for this internship?");
    if (!confirmApply) return;

    try {
      // Backend endpoint to apply for an internship
      await api.post(`/applications/apply`, { internshipId: internship.id });
      setApplicationStatus('applied');
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for internship:', err);
      setApplicationStatus('error');
      alert(err.response?.data?.message || 'Failed to submit application. You might have already applied.');
    }
  };

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!internship) return <Container sx={{ py: 4 }}><Alert severity="info">Internship not found.</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {internship.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {internship.companyName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip icon={<LocationOnIcon />} label={internship.location} variant="outlined" />
          {internship.stipend && <Chip icon={<AttachMoneyIcon />} label={internship.stipend} variant="outlined" />}
          {internship.duration && <Chip icon={<WorkIcon />} label={internship.duration} variant="outlined" />}
          {internship.applicationDeadline && (
            <Chip icon={<CalendarTodayIcon />} label={`Apply by: ${new Date(internship.applicationDeadline).toLocaleDateString()}`} variant="outlined" />
          )}
        </Box>

        <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>Description</Typography>
        <Typography variant="body1" paragraph>{internship.description}</Typography>

        <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>Requirements</Typography>
        <Typography variant="body1" paragraph>{internship.requirements}</Typography>

        {internship.responsibilities && (
          <>
            <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>Responsibilities</Typography>
            <Typography variant="body1" paragraph>{internship.responsibilities}</Typography>
          </>
        )}

        {internship.skillsRequired && internship.skillsRequired.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>Skills Required</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {internship.skillsRequired.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" size="small" />
              ))}
            </Box>
          </>
        )}

        {user && user.role === 'STUDENT' ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, px: 5, py: 1.5, borderRadius: 1 }}
            onClick={handleApply}
            disabled={applicationStatus === 'applied'}
          >
            {applicationStatus === 'applied' ? 'Applied!' : 'Apply Now'}
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Please <Button onClick={() => navigate('/login')}>log in as a Student</Button> to apply for this internship.
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default InternshipDetailPage;