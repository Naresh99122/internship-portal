// src/pages/InternshipListingPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress, Box, TextField, InputAdornment, Button, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import api from '../services/api';
import InternshipCard from '../components/Internship/InternshipCard'; // Reusable component

function InternshipListingPage() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    skills: [],
    company: ''
  });

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await api.get('/internships');
        setInternships(response.data);
        setFilteredInternships(response.data);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to load internships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  useEffect(() => {
    // Apply search and filters
    let currentFiltered = internships.filter(internship => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.companyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation = filters.location === '' || internship.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCompany = filters.company === '' || internship.companyName.toLowerCase().includes(filters.company.toLowerCase());

      const matchesSkills = filters.skills.length === 0 ||
        (internship.skillsRequired && filters.skills.every(skill =>
          internship.skillsRequired.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        ));

      return matchesSearch && matchesLocation && matchesCompany && matchesSkills;
    });
    setFilteredInternships(currentFiltered);
  }, [searchTerm, filters, internships]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !filters.skills.includes(skill)) {
      setFilters(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSkillDelete = (skillToDelete) => {
    setFilters(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToDelete) }));
  };

  if (loading) return <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 4 }}><Typography color="error">{error}</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
        Internship Opportunities
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search Internships"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Location"
          variant="outlined"
          size="small"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          sx={{ width: '150px' }}
        />
        <TextField
          label="Company"
          variant="outlined"
          size="small"
          name="company"
          value={filters.company}
          onChange={handleFilterChange}
          sx={{ width: '150px' }}
        />
        <TextField
          label="Add Skill Filter (e.g., React)"
          variant="outlined"
          size="small"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              handleSkillAdd(e.target.value.trim());
              e.target.value = ''; // Clear input
            }
          }}
          sx={{ width: '200px' }}
        />
        <Button variant="outlined" startIcon={<FilterListIcon />}>
          More Filters
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        {filters.skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            onDelete={() => handleSkillDelete(skill)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {filteredInternships.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No internships found matching your criteria.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredInternships.map((internship) => (
            <Grid item xs={12} sm={6} md={4} key={internship.id}>
              <InternshipCard internship={internship} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default InternshipListingPage;