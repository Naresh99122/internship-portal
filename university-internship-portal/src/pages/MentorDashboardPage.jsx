// src/pages/MentorDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, CircularProgress, Alert, Paper, Avatar } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LinkIcon from '@mui/icons-material/Link';

function MentorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentorProfile, setMentorProfile] = useState(null);
  const [assignedStudents, setAssignedStudents] = useState([]); // Or 'matchedStudents' based on backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'MENTOR') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [profileRes, studentsRes] = await Promise.all([
          api.get('/mentors/profile'),
          api.get('/mentors/assigned-students') // Backend endpoint for students assigned/matched to this mentor
        ]);
        setMentorProfile(profileRes.data);
        setAssignedStudents(studentsRes.data);
      } catch (err) {
        console.error('Error fetching mentor dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!mentorProfile) return <Container sx={{ py: 4 }}><Alert severity="info">Mentor profile not found. Please complete your profile.</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
        Welcome, {mentorProfile.firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your portal to connect with students and manage your mentorship activities.
      </Typography>

      <Grid container spacing={4}>
        {/* Mentor Profile Snapshot */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={mentorProfile.profilePictureUrl}
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'secondary.main' }}
              >
                {mentorProfile.firstName?.[0]}{mentorProfile.lastName?.[0]}
              </Avatar>
              <Typography variant="h6" gutterBottom>{mentorProfile.firstName} {mentorProfile.lastName}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{mentorProfile.jobTitle} at {mentorProfile.company}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon fontSize="small" /> Availability: {mentorProfile.availability || 'Not specified'}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/mentor/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Assigned Students */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIndIcon /> Your Assigned Students
              </Typography>
              {assignedStudents.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No students assigned yet. New matches will appear here!
                </Alert>
              ) : (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {assignedStudents.map((match) => ( // 'match' object likely contains student and match details
                    <Grid item xs={12} sm={6} key={match.id}>
                      <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={match.student.profilePictureUrl} sx={{ bgcolor: 'primary.light' }}>
                          {match.student.firstName?.[0]}{match.student.lastName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {match.student.firstName} {match.student.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {match.student.major} (Match Score: {match.matchScore.toFixed(0)}%)
                          </Typography>
                          <Button size="small" startIcon={<LinkIcon />} onClick={() => navigate(`/students/${match.student.id}`)} sx={{ mt: 1 }}>
                            View Student Profile
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Placeholder for mentorship resources or analytics */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Mentorship Resources & Analytics</Typography>
              <Typography variant="body2" color="text.secondary">
                (Future feature: Access mentorship guides, track engagement, or view impact metrics here.)
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>Explore Resources</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MentorDashboardPage;