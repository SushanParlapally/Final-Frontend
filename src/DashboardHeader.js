import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './Header.css';
import logo from './assets/logo.jpg'; // Adjust the path if needed

function DashboardHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="Trawell Logo" className="logo" />
          <span className="logo-text">Trawell</span>
        </div>
        <nav className="header-nav">
          <Link className="header-link" to="/">Home</Link>
          <Link className="header-link" to="/contact">Contact</Link>
          <a className="header-link" href="#announcements">Announcements</a>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}

export default DashboardHeader;
