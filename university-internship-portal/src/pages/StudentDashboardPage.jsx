import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import api from '../services/api';
import InternshipCard from '../components/Internship/InternshipCard';
import MentorCard from '../components/Mentor/MentorCard';
import { useNavigate } from 'react-router-dom';

function StudentDashboardPage() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [matchedInternships, setMatchedInternships] = useState([]);
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, internshipsRes, mentorsRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/students/internships/matched'),
          api.get('/students/mentors/matched')
        ]);
        setStudentProfile(profileRes.data);
        setMatchedInternships(internshipsRes.data);
        setMatchedMentors(mentorsRes.data);
      } catch (err) {
        console.error("Error fetching student dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading dashboard...</Typography></Container>;
  if (error) return <Container sx={{ py: 4 }}><Typography color="error">{error}</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Welcome, {studentProfile?.firstName || 'Student'}!
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Snapshot */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Profile</Typography>
              {studentProfile ? (
                <Box>
                  <Typography variant="body1">Major: {studentProfile.major}</Typography>
                  <Typography variant="body1">Skills: {studentProfile.skills?.join(', ') || 'N/A'}</Typography>
                  <Typography variant="body1">Interests: {studentProfile.interests?.join(', ') || 'N/A'}</Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/student/profile')}
                  >
                    Edit Profile
                  </Button>
                </Box>
              ) : (
                <Typography>Please complete your profile to get better matches.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Matched Internships */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recommended Internships</Typography>
              {matchedInternships.length > 0 ? (
                <Grid container spacing={2}>
                  {matchedInternships.slice(0, 3).map((internship) => ( // Show top 3
                    <Grid item xs={12} sm={6} md={4} key={internship.id}>
                      <InternshipCard internship={internship} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/internships')}>View All Internships</Button>
                  </Grid>
                </Grid>
              ) : (
                <Typography>No recommended internships yet. Update your profile!</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Matched Mentors */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Suggested Mentors</Typography>
              {matchedMentors.length > 0 ? (
                <Grid container spacing={2}>
                  {matchedMentors.slice(0, 3).map((match) => ( // Show top 3
                    <Grid item xs={12} sm={6} md={4} key={match.id}>
                      <MentorCard mentor={match.mentor} matchScore={match.matchScore} />
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/student/mentors')}>View All Matches</Button>
                  </Grid>
                </Grid>
              ) : (
                <Typography>No mentor suggestions yet. Make sure your profile is complete.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Applications (simplified) */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Applications</Typography>
              <Typography variant="body2">
                (Feature to be implemented: View your application status here.)
              </Typography>
              <Button variant="outlined" sx={{mt:2}} onClick={() => navigate('/student/applications')}>View All Applications</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboardPage;