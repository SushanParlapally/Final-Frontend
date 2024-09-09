import React from 'react';
import { Route, Routes, useLocation, Link } from 'react-router-dom';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TravelAdminDashboard from './TravelAdminDashboard';
import Header from './Header';
import DashboardHeader from './DashboardHeader'; // New DashboardHeader
import Footer from './Footer';
import Home from './Home';
import './App.css';

function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="error-link" to="/">Go to Home</Link>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Define the paths that should use the DashboardHeader
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="app-container">
      {/* Conditional Header based on the current path */}
      {isDashboard ? <DashboardHeader /> : <Header />}
      
      <React.Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="dashboard/employee" element={<EmployeeDashboard />} />
          <Route path="dashboard/manager" element={<ManagerDashboard />} />
          <Route path="dashboard/travel-admin" element={<TravelAdminDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/contact" element={<div className="page-content">Contact Page</div>} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </React.Suspense>

      <Footer />
    </div>
  );
}

export default App;
