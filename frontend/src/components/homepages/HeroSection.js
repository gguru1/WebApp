// components/HeroSection.js - Hero Section Component

import React from 'react';

const HeroSection = ({ onLoginClick }) => {
  const handleLearnMore = (e) => {
    e.preventDefault();
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Inline styles for background image (using PUBLIC_URL for public folder)
  const heroStyle = {
    backgroundImage: `linear-gradient(
      135deg,
      rgba(44, 90, 160, 0.85) 0%,
      rgba(32, 201, 151, 0.75) 50%,
      rgba(30, 126, 52, 0.85) 100%
    ), url(${process.env.PUBLIC_URL}/images/healthcare-blocks.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingTop: '80px'
  };

  return (
    <section 
      id="home" 
      className="hero-section"
      style={heroStyle}
    >
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-4 fw-bold text-white mb-4">
                UG HealthConnect
              </h1>
              <h2 className="display-6 fw-semibold text-white mb-4">
                Simplifying Primary Care Management
              </h2>
              <p className="lead text-white-75 mb-4">
                Secure, efficient, and role-based healthcare management system designed for primary care practices. Streamlined workflows for administrators, seamless access for patients, and comprehensive scheduling for doctors.
              </p>
              <div className="hero-buttons">
                <button 
                  onClick={onLoginClick}
                  className="btn btn-light btn-lg px-5 py-3 me-3 fw-semibold"
                >
                  <i className="fas fa-sign-in-alt me-2"></i>Access Dashboard
                </button>
                <a 
                  href="#features" 
                  onClick={handleLearnMore}
                  className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold"
                >
                  <i className="fas fa-info-circle me-2"></i>Learn More
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6 d-none d-lg-block">
            <div className="hero-image">
              <div className="hero-card">
                <div className="text-center">
                  <div className="hero-icon mb-4">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <h5 className="fw-bold mb-3">Healthcare Management</h5>
                  <p className="text-muted mb-0">
                    Connecting patients, doctors, and administrators in one secure platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;