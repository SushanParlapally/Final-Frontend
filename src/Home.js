import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Announcements from './Announcements';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Header />
      <div className="hero-container">
        <div className="hero-carousel">
          <div className="carousel-image image1"></div>
          <div className="carousel-image image2"></div>
          <div className="carousel-image image3"></div>
        </div>
        <div className="hero-content">
          <h2>Welcome to Trawell</h2>
          <div className="hero-text">
          <p>Your one-stop solution for all travel needs.</p>
          </div>
          <Link className="explore-link" to="/explore">Explore Now</Link>
        </div>
      </div>
      <div className="home-additional-content">
        <div id="announcements">
          <Announcements />
        </div>
      </div>
    </div>
  );
}

export default Home;
