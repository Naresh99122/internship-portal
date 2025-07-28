// src/components/Common/Navbar.jsx
// src/components/Common/Navbar.jsx
import React, { useState } from 'react'; // <-- Add useState here
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null); // For mobile menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const renderNavLinks = () => {
    if (isAuthenticated) {
      if (user.role === 'STUDENT') {
        return (
          <>
            <Button color="inherit" component={Link} to="/student/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/internships">Internships</Button>
            <Button color="inherit" component={Link} to="/student/mentors">My Mentors</Button>
            <Button color="inherit" component={Link} to="/student/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        );
      } else if (user.role === 'MENTOR') {
        return (
          <>
            <Button color="inherit" component={Link} to="/mentor/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/mentor/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        );
      } else if (user.role === 'ADMIN') {
        return (
          <>
            <Button color="inherit" component={Link} to="/admin/dashboard">Dashboard</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        );
      }
    } else {
      return (
        <>
          <Button color="inherit" component={Link} to="/internships">Internships</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
        </>
      );
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Internship Portal
          </Link>
        </Typography>

        {isMobile ? (
          <Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {isAuthenticated ? (
                <>
                  {user.role === 'STUDENT' && [
                    <MenuItem key="student-dash" onClick={handleMenuClose} component={Link} to="/student/dashboard">Dashboard</MenuItem>,
                    <MenuItem key="internships" onClick={handleMenuClose} component={Link} to="/internships">Internships</MenuItem>,
                    <MenuItem key="my-mentors" onClick={handleMenuClose} component={Link} to="/student/mentors">My Mentors</MenuItem>,
                    <MenuItem key="student-profile" onClick={handleMenuClose} component={Link} to="/student/profile">Profile</MenuItem>
                  ]}
                  {user.role === 'MENTOR' && [
                    <MenuItem key="mentor-dash" onClick={handleMenuClose} component={Link} to="/mentor/dashboard">Dashboard</MenuItem>,
                    <MenuItem key="mentor-profile" onClick={handleMenuClose} component={Link} to="/mentor/profile">Profile</MenuItem>
                  ]}
                  {user.role === 'ADMIN' && [
                    <MenuItem key="admin-dash" onClick={handleMenuClose} component={Link} to="/admin/dashboard">Dashboard</MenuItem>
                  ]}
                  <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/internships">Internships</MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/login">Login</MenuItem>
                  <MenuItem onClick={handleMenuClose} component={Link} to="/register">Register</MenuItem>
                </>
              )}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex' }}>
            {renderNavLinks()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;