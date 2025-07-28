// src/pages/PostInternshipPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, Chip, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PostInternshipPage() {
  const { id } = useParams(); // For editing an existing internship
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internshipForm, setInternshipForm] = useState({
    title: '', companyName: '', location: '', description: '', requirements: '',
    responsibilities: '', skillsRequired: [], stipend: '', duration: '',
    startDate: '', endDate: '', applicationDeadline: '', contactEmail: '',
    companyWebsite: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true); // For initial fetch if editing
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/login'); // Redirect if not admin
      return;
    }

    if (id) { // If ID is present, we are editing
      const fetchInternship = async () => {
        try {
          const response = await api.get(`/internships/${id}`);
          const data = response.data;
          setInternshipForm({
            title: data.title || '',
            companyName: data.companyName || '',
            location: data.location || '',
            description: data.description || '',
            requirements: data.requirements || '',
            responsibilities: data.responsibilities || '',
            skillsRequired: data.skillsRequired || [],
            stipend: data.stipend || '',
            duration: data.duration || '',
            startDate: data.startDate ? data.startDate.split('T')[0] : '', // Format date for input type="date"
            endDate: data.endDate ? data.endDate.split('T')[0] : '',
            applicationDeadline: data.applicationDeadline ? data.applicationDeadline.split('T')[0] : '',
            contactEmail: data.contactEmail || '',
            companyWebsite: data.companyWebsite || ''
          });
        } catch (err) {
          console.error('Error fetching internship for edit:', err);
          setError('Failed to load internship details for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchInternship();
    } else {
      setLoading(false); // No ID, so it's a new post, no loading needed
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInternshipForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !internshipForm.skillsRequired.includes(newSkill.trim())) {
      setInternshipForm(prev => ({ ...prev, skillsRequired: [...prev.skillsRequired, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setInternshipForm(prev => ({ ...prev, skillsRequired: prev.skillsRequired.filter(s => s !== skillToDelete) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Ensure date fields are null if empty strings, as backend might expect LocalDate/LocalDateTime
      const dataToSend = {
        ...internshipForm,
        startDate: internshipForm.startDate || null,
        endDate: internshipForm.endDate || null,
        applicationDeadline: internshipForm.applicationDeadline || null
      };

      if (id) {
        await api.put(`/internships/${id}`, dataToSend);
        setSuccess('Internship updated successfully!');
      } else {
        await api.post('/internships', dataToSend);
        setSuccess('Internship posted successfully!');
        // Clear form for new entry after successful post
        setInternshipForm({
          title: '', companyName: '', location: '', description: '', requirements: '',
          responsibilities: '', skillsRequired: [], stipend: '', duration: '',
          startDate: '', endDate: '', applicationDeadline: '', contactEmail: '',
          companyWebsite: ''
        });
      }
      setTimeout(() => navigate('/admin/dashboard'), 2000); // Redirect after success
    } catch (err) {
      console.error('Error saving internship:', err);
      setError(err.response?.data?.message || 'Failed to save internship. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
          {id ? 'Edit Internship' : 'Post New Internship'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Job Title" name="title" value={internshipForm.title} onChange={handleChange} variant="outlined" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Name" name="companyName" value={internshipForm.companyName} onChange={handleChange} variant="outlined" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" name="location" value={internshipForm.location} onChange={handleChange} variant="outlined" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={internshipForm.description} onChange={handleChange} multiline rows={4} variant="outlined" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Requirements" name="requirements" value={internshipForm.requirements} onChange={handleChange} multiline rows={3} variant="outlined" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Responsibilities (Optional)" name="responsibilities" value={internshipForm.responsibilities} onChange={handleChange} multiline rows={3} variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Required Skill (e.g., Python, SQL)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>Add</Button>
                  ),
                }}
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {internshipForm.skillsRequired.map((skill, index) => (
                  <Chip key={index} label={skill} onDelete={() => handleDeleteSkill(skill)} color="primary" variant="outlined" size="small" />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Stipend (e.g., Paid, Unpaid, $15/hr)" name="stipend" value={internshipForm.stipend} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Duration (e.g., 3 months, Summer)" name="duration" value={internshipForm.duration} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Start Date" name="startDate" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.startDate} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="End Date" name="endDate" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.endDate} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Application Deadline" name="applicationDeadline" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.applicationDeadline} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Email" name="contactEmail" type="email" value={internshipForm.contactEmail} onChange={handleChange} variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Website" name="companyWebsite" value={internshipForm.companyWebsite} onChange={handleChange} variant="outlined" />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 4, py: 1.5, px: 5, borderRadius: 1 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : (id ? 'Update Internship' : 'Post Internship')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PostInternshipPage;