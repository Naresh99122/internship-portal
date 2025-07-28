// App.js (Basic Routing)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // For protected routes

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/internships/:id" element={<InternshipDetailPage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['MENTOR']} />}>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/internships/new" element={<PostInternshipPage />} />
        </Route>
        <Route path="/" element={<Home />} />
        {/* Add more routes */}
      </Routes>
    </Router>
  );
}

export default App;

