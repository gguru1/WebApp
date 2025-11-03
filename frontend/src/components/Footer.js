// components/Footer.js - Footer Component

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h5 className="fw-bold mb-2">
              <i className="fas fa-heartbeat me-2"></i>UG HealthConnect
            </h5>
            <p className="text-muted mb-0">
              © {currentYear} HealthConnect. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <a 
              href="#privacy" 
              className="text-light me-3 text-decoration-none"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              className="text-light me-3 text-decoration-none"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>
            <a 
              href="#support" 
              className="text-light me-3 text-decoration-none"
              onClick={(e) => e.preventDefault()}
            >
              Support
            </a>
            <a 
              href="#contact" 
              className="text-light text-decoration-none"
              onClick={(e) => handleLinkClick(e, '#contact')}
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;