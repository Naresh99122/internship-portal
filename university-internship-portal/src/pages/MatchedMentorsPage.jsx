// src/pages/MatchedMentorsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Alert, Box } from '@mui/material';
import api from '../services/api';
import MentorCard from '../components/Mentor/MentorCard'; // Reusable component
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function MatchedMentorsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'STUDENT') {
      navigate('/login');
      return;
    }
    const fetchMatchedMentors = async () => {
      try {
        // This endpoint would fetch MentorStudentMatch objects for the logged-in student
        const response = await api.get('/students/mentors/matched');
        setMatchedMentors(response.data);
      } catch (err) {
        console.error('Error fetching matched mentors:', err);
        setError('Failed to load matched mentors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatchedMentors();
  }, [user, navigate]);

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
        Your Matched Mentors
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        These mentors have been matched with you based on your skills and interests.
      </Typography>

      {matchedMentors.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No mentors matched yet. Make sure your profile is complete with skills and interests!
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {matchedMentors.map((match) => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              {/* MentorCard expects 'mentor' object and 'matchScore' */}
              <MentorCard mentor={match.mentor} matchScore={match.matchScore} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default MatchedMentorsPage;