// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material'; // Import Box for layout

// Import all pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MentorDashboardPage from './pages/MentorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import InternshipListingPage from './pages/InternshipListingPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import PostInternshipPage from './pages/PostInternshipPage'; // New import
import StudentProfilePage from './pages/StudentProfilePage';
import MentorProfilePage from './pages/MentorProfilePage';
import MatchedMentorsPage from './pages/MatchedMentorsPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';
import MentorDetailPage from './pages/MentorDetailPage'; // Assuming you'll implement this
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Import common components
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer'; // New import
import PrivateRoute from './components/Common/PrivateRoute';

// Define a custom theme for a beautiful UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A nice university blue
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e', // A complementary accent color
      light: '#ff336e',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8', // Light background for pages
      paper: '#ffffff', // White for cards/forms
    },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h4: { fontSize: '2rem', fontWeight: 600 },
    h5: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1.2rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Subtle shadow
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Slightly less rounded for chips
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS and applies baseline styles */}
      <Router>
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}> {/* Main content area takes remaining height */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/internships" element={<InternshipListingPage />} />
                <Route path="/internships/:id" element={<InternshipDetailPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}

                {/* Student-specific protected routes */}
                <Route element={<PrivateRoute allowedRoles={['STUDENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                  <Route path="/student/profile" element={<StudentProfilePage />} />
                  <Route path="/student/mentors" element={<MatchedMentorsPage />} />
                  <Route path="/student/applications" element={<StudentApplicationsPage />} />
                </Route>

                {/* Mentor-specific protected routes */}
                <Route element={<PrivateRoute allowedRoles={['MENTOR']} />}>
                  <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
                  <Route path="/mentor/profile" element={<MentorProfilePage />} />
                  <Route path="/mentors/:id" element={<MentorDetailPage />} />
                </Route>

                {/* Admin-specific protected routes */}
                <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/internships/new" element={<PostInternshipPage />} /> {/* New route for posting */}
                  <Route path="/admin/internships/edit/:id" element={<PostInternshipPage />} /> {/* New route for editing */}
                </Route>
              </Routes>
            </Box>
            <Footer />
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;