// components/Navbar.js - Navigation Bar Component

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, currentUser, onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e, target) => {
    e.preventDefault();
    setNavOpen(false);
    
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          <i className="fas fa-heartbeat me-2"></i>UG HealthConnect
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-controls="navbarNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a 
                className="nav-link fw-medium active" 
                href="#home"
                onClick={(e) => handleNavLinkClick(e, '#home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link fw-medium" 
                href="#features"
                onClick={(e) => handleNavLinkClick(e, '#features')}
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link fw-medium" 
                href="#about"
                onClick={(e) => handleNavLinkClick(e, '#about')}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <a 
                className="nav-link fw-medium" 
                href="#contact"
                onClick={(e) => handleNavLinkClick(e, '#contact')}
              >
                Contact
              </a>
            </li>
            <li className="nav-item ms-2">
              <button 
                onClick={onLoginClick}
                className="btn btn-primary px-4"
              >
                {isAuthenticated && currentUser ? (
                  <>
                    <i className="fas fa-user me-1"></i>
                    {currentUser.firstName || currentUser.username}
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;