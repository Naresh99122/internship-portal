// src/pages/AdminDashboardPage.jsx
// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react'; // Correct: React hooks
import { // Correct: ONE Material-UI import statement with all necessary components
  Container, Typography, Box, Paper, Button, Tab, Tabs, Chip,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ... rest of your code ...
function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0); // 0 for Internships, 1 for Users
  const [internships, setInternships] = useState([]);
  const [users, setUsers] = useState([]); // This would contain all users (students, mentors, admins)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Internship Dialog State
  const [openInternshipDialog, setOpenInternshipDialog] = useState(false);
  const [currentInternship, setCurrentInternship] = useState(null); // For edit
  const [internshipForm, setInternshipForm] = useState({
    title: '', companyName: '', location: '', description: '', requirements: '',
    responsibilities: '', skillsRequired: [], stipend: '', duration: '',
    startDate: '', endDate: '', applicationDeadline: '', contactEmail: '',
    companyWebsite: ''
  });
  const [newSkill, setNewSkill] = useState('');

  // User Management Dialog State
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // For editing user role/status
  const [userForm, setUserForm] = useState({
    role: '', // 'STUDENT', 'MENTOR', 'ADMIN'
    status: '' // Not directly from User entity, but for deactivation/activation
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/login'); // Redirect if not admin
      return;
    }
    fetchData();
  }, [user, navigate, tabIndex]); // Refetch data when tab changes

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (tabIndex === 0) { // Internships
        const res = await api.get('/internships/all'); // Admin specific endpoint to get all, including inactive
        setInternships(res.data);
      } else if (tabIndex === 1) { // Users
        const res = await api.get('/admin/users'); // Admin specific endpoint to get all users
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Internship Management Handlers ---
  const handleOpenInternshipDialog = (internship = null) => {
    setCurrentInternship(internship);
    if (internship) {
      setInternshipForm({
        title: internship.title,
        companyName: internship.companyName,
        location: internship.location,
        description: internship.description,
        requirements: internship.requirements,
        responsibilities: internship.responsibilities || '',
        skillsRequired: internship.skillsRequired || [],
        stipend: internship.stipend || '',
        duration: internship.duration || '',
        startDate: internship.startDate || '',
        endDate: internship.endDate || '',
        applicationDeadline: internship.applicationDeadline || '',
        contactEmail: internship.contactEmail || '',
        companyWebsite: internship.companyWebsite || ''
      });
    } else {
      setInternshipForm({
        title: '', companyName: '', location: '', description: '', requirements: '',
        responsibilities: '', skillsRequired: [], stipend: '', duration: '',
        startDate: '', endDate: '', applicationDeadline: '', contactEmail: '',
        companyWebsite: ''
      });
    }
    setOpenInternshipDialog(true);
  };

  const handleCloseInternshipDialog = () => {
    setOpenInternshipDialog(false);
    setCurrentInternship(null);
    setInternshipForm({});
    setNewSkill('');
    setError('');
    setSuccess('');
  };

  const handleInternshipFormChange = (e) => {
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

  const handleSubmitInternship = async () => {
    setError('');
    setSuccess('');
    try {
      const dataToSend = {
        ...internshipForm,
        startDate: internshipForm.startDate ? internshipForm.startDate : null,
        endDate: internshipForm.endDate ? internshipForm.endDate : null,
        applicationDeadline: internshipForm.applicationDeadline ? internshipForm.applicationDeadline : null
      };

      if (currentInternship) {
        await api.put(`/internships/${currentInternship.id}`, dataToSend);
        setSuccess('Internship updated successfully!');
      } else {
        await api.post('/internships', dataToSend);
        setSuccess('Internship posted successfully!');
      }
      await fetchData(); // Refresh list
      handleCloseInternshipDialog();
    } catch (err) {
      console.error('Error saving internship:', err);
      setError(err.response?.data?.message || 'Failed to save internship. Check your input.');
    }
  };

  const handleDeleteInternship = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/internships/${id}`);
        setSuccess('Internship deleted successfully!');
        await fetchData();
      } catch (err) {
        console.error('Error deleting internship:', err);
        setError(err.response?.data?.message || 'Failed to delete internship.');
      }
    }
  };

  // --- User Management Handlers ---
  const handleOpenUserDialog = (userToEdit) => {
    setCurrentUser(userToEdit);
    setUserForm({
      role: userToEdit.role,
      // Assume a 'status' field on user object, e.g., 'ACTIVE', 'INACTIVE'
      // This needs backend support
      status: 'ACTIVE' // Placeholder
    });
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setCurrentUser(null);
    setUserForm({});
    setError('');
    setSuccess('');
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitUserUpdate = async () => {
    setError('');
    setSuccess('');
    try {
      // Backend endpoint to update user role/status (requires admin privileges)
      await api.put(`/admin/users/${currentUser.id}`, userForm);
      setSuccess('User updated successfully!');
      await fetchData();
      handleCloseUserDialog();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleTriggerMatching = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/matching/run'); // Endpoint to trigger matching
      setSuccess('Matching algorithm triggered successfully!');
    } catch (err) {
      console.error('Error triggering matching:', err);
      setError(err.response?.data?.message || 'Failed to trigger matching algorithm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} aria-label="Admin Dashboard Tabs" sx={{ mb: 3 }}>
          <Tab label="Manage Internships" />
          <Tab label="Manage Users" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
        ) : (
          <Box>
            {tabIndex === 0 && ( // Manage Internships
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Internship Listings</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenInternshipDialog()}>
                    Post New Internship
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Deadline</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {internships.length === 0 ? (
                        <TableRow><TableCell colSpan={6} align="center">No internships found.</TableCell></TableRow>
                      ) : (
                        internships.map((internship) => (
                          <TableRow key={internship.id}>
                            <TableCell>{internship.title}</TableCell>
                            <TableCell>{internship.companyName}</TableCell>
                            <TableCell>{internship.location}</TableCell>
                            <TableCell><Chip label={internship.status} color={internship.status === 'ACTIVE' ? 'success' : 'default'} size="small" /></TableCell>
                            <TableCell>{internship.applicationDeadline ? new Date(internship.applicationDeadline).toLocaleDateString() : 'N/A'}</TableCell>
                            <TableCell align="right">
                              <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenInternshipDialog(internship)}>Edit</Button>
                              <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteInternship(internship.id)}>Delete</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {tabIndex === 1 && ( // Manage Users
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>User Management</Typography>
                  <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleTriggerMatching}>
                    Run Mentor Matching
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow><TableCell colSpan={5} align="center">No users found.</TableCell></TableRow>
                      ) : (
                        users.map((userItem) => (
                          <TableRow key={userItem.id}>
                            <TableCell>{userItem.username}</TableCell>
                            <TableCell>{userItem.email}</TableCell>
                            <TableCell><Chip label={userItem.role} color={userItem.role === 'ADMIN' ? 'error' : userItem.role === 'MENTOR' ? 'info' : 'primary'} size="small" /></TableCell>
                            <TableCell>{new Date(userItem.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell align="right">
                              <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenUserDialog(userItem)}>Edit User</Button>
                              {/* <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteUser(userItem.id)}>Delete</Button> */}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Internship Dialog */}
      <Dialog open={openInternshipDialog} onClose={handleCloseInternshipDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentInternship ? 'Edit Internship' : 'Post New Internship'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Job Title" name="title" value={internshipForm.title} onChange={handleInternshipFormChange} margin="dense" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Name" name="companyName" value={internshipForm.companyName} onChange={handleInternshipFormChange} margin="dense" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" name="location" value={internshipForm.location} onChange={handleInternshipFormChange} margin="dense" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={internshipForm.description} onChange={handleInternshipFormChange} margin="dense" multiline rows={4} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Requirements" name="requirements" value={internshipForm.requirements} onChange={handleInternshipFormChange} margin="dense" multiline rows={3} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Responsibilities (Optional)" name="responsibilities" value={internshipForm.responsibilities} onChange={handleInternshipFormChange} margin="dense" multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Required Skill (e.g., Python, SQL)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                margin="dense"
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
              <TextField fullWidth label="Stipend (e.g., Paid, Unpaid, $15/hr)" name="stipend" value={internshipForm.stipend} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Duration (e.g., 3 months, Summer)" name="duration" value={internshipForm.duration} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Start Date" name="startDate" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.startDate} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="End Date" name="endDate" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.endDate} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Application Deadline" name="applicationDeadline" type="date" InputLabelProps={{ shrink: true }} value={internshipForm.applicationDeadline} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Email" name="contactEmail" type="email" value={internshipForm.contactEmail} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Website" name="companyWebsite" value={internshipForm.companyWebsite} onChange={handleInternshipFormChange} margin="dense" />
            </Grid>
          </Grid>
        </DialogContent>
      

<DialogContent dividers>
  {currentUser && (
    <Box>
      <Typography variant="body1" sx={{mb: 2}}>
        **Username:** {currentUser.username} <br/>
        **Email:** {currentUser.email}
      </Typography>

      <TextField fullWidth label="Role" name="role" value={userForm.role} onChange={handleUserFormChange} margin="dense" select>
        <MenuItem value="STUDENT">Student</MenuItem>
        <MenuItem value="MENTOR">Mentor</MenuItem>
        <MenuItem value="ADMIN">Admin</MenuItem>
      </TextField>

      {/* Conditional rendering for Student/Mentor specific fields */}
      {currentUser.role === 'STUDENT' && (
        <Box sx={{mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1}}>
          <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb:1}}>Student Details</Typography>
          {/* You'd fetch and display student-specific data here, or allow editing */}
          <TextField fullWidth label="Major" name="major" value={userForm.major || ''} onChange={handleUserFormChange} margin="dense" />
          <TextField fullWidth label="Graduation Year" name="graduationYear" type="number" value={userForm.graduationYear || ''} onChange={handleUserFormChange} margin="dense" />
          {/* ... add more student fields as needed, ensure userForm state can hold them */}
        </Box>
      )}

      {currentUser.role === 'MENTOR' && (
        <Box sx={{mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1}}>
          <Typography variant="subtitle1" sx={{fontWeight: 'bold', mb:1}}>Mentor Details</Typography>
          {/* You'd fetch and display mentor-specific data here, or allow editing */}
          <TextField fullWidth label="Industry" name="industry" value={userForm.industry || ''} onChange={handleUserFormChange} margin="dense" />
          <TextField fullWidth label="Company" name="company" value={userForm.company || ''} onChange={handleUserFormChange} margin="dense" />
          {/* ... add more mentor fields as needed */}
        </Box>
      )}

      {/* General user status management (e.g., enable/disable account) */}
      <TextField fullWidth label="Account Status" name="status" value={userForm.status} onChange={handleUserFormChange} margin="dense" select sx={{mt:2}}>
        <MenuItem value="ACTIVE">Active</MenuItem>
        <MenuItem value="INACTIVE">Inactive</MenuItem>
      </TextField>
    </Box>
  )}
</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInternshipDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitInternship} variant="contained" color="primary">
            {currentInternship ? 'Update Internship' : 'Post Internship'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Management Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User: {currentUser?.username}</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth label="Role" name="role" value={userForm.role} onChange={handleUserFormChange} margin="dense" select>
            <MenuItem value="STUDENT">Student</MenuItem>
            <MenuItem value="MENTOR">Mentor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>
          {/* Add more fields here like account status (active/inactive) if backend supports it */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSubmitUserUpdate} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminDashboardPage;