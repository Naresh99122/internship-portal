// src/pages/StudentDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material'; // Ensure Alert is imported
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InternshipCard from '../components/Internship/InternshipCard'; // Make sure this component exists
import MentorCard from '../components/Mentor/MentorCard'; // Make sure this component exists


function StudentDashboardPage() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [matchedInternships, setMatchedInternships] = useState([]); // Initialize as empty array
  const [matchedMentors, setMatchedMentors] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Initialize as null for no error

  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming useAuth provides user data

  useEffect(() => {
    // Basic redirection if user is not a student (or not logged in)
    if (!user || user.role !== 'STUDENT') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true); // Set loading true at the start of fetch
      setError(null); // Clear any previous errors

      try {
        // Use Promise.all to fetch all data concurrently
        // const [profileRes, internshipsRes, mentorsRes] = await Promise.all([
        //   api.get('/students/profile'),
        //   api.get('/students/internships/matched'),
        //   api.get('/students/mentors/matched')
        // ]);

        const [profileRes, mentorsRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/students/mentors/matched')
        ]);


        setStudentProfile(profileRes.data);
        // Ensure data is an array, even if API returns null/undefined/empty
        // setMatchedInternships(internshipsRes.data || []);
        setMatchedMentors(mentorsRes.data || []);

      } catch (err) {
        console.log("came ");
        console.error("Error fetching dashboard data:", err);
        // Set a more specific error message based on response if available
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false); // Always set loading to false after fetch
      }
    };
    fetchData();
  }, [user, navigate]); // Re-run if user or navigate changes

  // Display loading state
  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  // Display a global error message if any API call failed
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // If loading is false and no error, but profile is null (shouldn't happen if API returns 200 OK)
  if (!studentProfile) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Student profile not found. Please complete your profile or check your account status.</Alert>
        <Button sx={{mt:2}} onClick={() => navigate('/student/profile')}>Go to Profile</Button>
      </Container>
    );
  }


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
        Welcome, {studentProfile?.firstName || 'Student'}!
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Snapshot */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Your Profile</Typography>
              {/* Ensure studentProfile is not null before accessing its properties */}
              <Box>
                  <Typography variant="body1">Major: {studentProfile.major || 'N/A'}</Typography>
                  {/* Join array for display, handle empty array case */}
                  <Typography variant="body1">Skills: {studentProfile.skills?.length > 0 ? studentProfile.skills.join(', ') : 'N/A'}</Typography>
                  <Typography variant="body1">Interests: {studentProfile.interests?.length > 0 ? studentProfile.interests.join(', ') : 'N/A'}</Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/student/profile')}
                  >
                    Edit Profile
                  </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommended Internships */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recommended Internships</Typography>
              {matchedInternships.length > 0 ? (
                <Grid container spacing={2}>
                  {/* Limit display to a few, provide link to all */}
                  {matchedInternships.slice(0, 3).map((internship) => (
                    <Grid item xs={12} sm={6} md={4} key={internship.id}>
                      <InternshipCard internship={internship} />
                    </Grid>
                  ))}
                  {matchedInternships.length > 3 && (
                    <Grid item xs={12} sx={{textAlign:'center', mt:2}}>
                      <Button variant="contained" onClick={() => navigate('/internships')}>View All Internships</Button>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Alert severity="info" sx={{width: '100%', mt:2}}>
                    No recommended internships yet. Update your profile with skills/interests or check for new listings!
                    <Button size="small" onClick={() => navigate('/internships')} sx={{ml:1}}>Browse All</Button>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Suggested Mentors */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Suggested Mentors</Typography>
              {matchedMentors.length > 0 ? (
                <Grid container spacing={2}>
                  {/* Limit display to a few, provide link to all */}
                  {matchedMentors.slice(0, 3).map((match) => (
                    <Grid item xs={12} sm={6} md={4} key={match.id}>
                      <MentorCard mentor={match.mentor} matchScore={match.matchScore} />
                    </Grid>
                  ))}
                   {matchedMentors.length > 3 && (
                    <Grid item xs={12} sx={{textAlign:'center', mt:2}}>
                      <Button variant="contained" onClick={() => navigate('/student/mentors')}>View All Matches</Button>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Alert severity="info" sx={{width: '100%', mt:2}}>
                    No mentor suggestions yet. Make sure your profile is complete with skills and interests.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Applications (simplified) */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Applications</Typography>
              <Typography variant="body2" color="text.secondary">
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