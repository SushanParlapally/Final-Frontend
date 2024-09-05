import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from './assets/logo.jpg'; // Make sure to adjust the path if needed

function Header() {
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
          <Link className="login-button" to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
