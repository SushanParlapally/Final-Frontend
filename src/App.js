import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TravelAdminDashboard from './TravelAdminDashboard';
import './App.css';
// Import Header and Footer components
import Header from './Header';
import Footer from './Footer';

import Home from './Home';

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
  return (
    <Router>
      <div className="app-container">
        <Header />
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
    </Router>
  );
}

export default App;
