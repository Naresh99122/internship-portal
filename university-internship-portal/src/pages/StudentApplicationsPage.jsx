// src/pages/StudentApplicationsPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';

function StudentApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'STUDENT') {
      navigate('/login');
      return;
    }
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my'); // Endpoint to get logged-in student's applications
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'info';
      case 'REVIEWING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'WITHDRAWN': return 'default';
      default: return 'default';
    }
  };

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
        My Internship Applications
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Here you can track the status of all your submitted internship applications.
      </Typography>

      {applications.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          You haven't applied for any internships yet. <Button onClick={() => navigate('/internships')}>Browse Internships</Button>
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Internship Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Application Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {app.internship.title}
                  </TableCell>
                  <TableCell>{app.internship.companyName}</TableCell>
                  <TableCell>{new Date(app.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={app.status} color={getStatusColor(app.status)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<LaunchIcon />}
                      onClick={() => navigate(`/internships/${app.internship.id}`)}
                    >
                      View Internship
                    </Button>
                    {/* Add a withdraw button if applicable and backend supports it */}
                    {/* {app.status === 'PENDING' && (
                      <Button size="small" color="error">Withdraw</Button>
                    )} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default StudentApplicationsPage;