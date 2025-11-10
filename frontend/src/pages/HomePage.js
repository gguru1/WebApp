// pages/HomePage.js - Main Landing Page Component

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Navbar from '../components/homepages/Navbar';
import HeroSection from '../components/homepages/HeroSection';
import FeaturesSection from '../components/homepages/FeaturesSection';
import TechnologySection from '../components/homepages/TechnologySection';
import AboutSection from '../components/homepages/AboutSection';
import ContactSection from '../components/homepages/ContactSection';
import Footer from '../components/homepages/Footer';
import '../assets/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    }

    // Add scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animateElements = document.querySelectorAll('.feature-card, .about-feature, .tech-item');
    animateElements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      animateElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleLoginRedirect = () => {
    if (isAuthenticated && currentUser) {
      // Redirect to appropriate dashboard
      const dashboards = {
        admin: '/admin',
        doctor: '/doctor',
        patient: '/patient'
      };
      navigate(dashboards[currentUser.role] || '/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="homepage">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        currentUser={currentUser}
        onLoginClick={handleLoginRedirect}
      />
      
      <HeroSection onLoginClick={handleLoginRedirect} />
      
      <FeaturesSection />
      
      <TechnologySection />
      
      <AboutSection />
      
      <ContactSection onLoginClick={handleLoginRedirect} />
      
      <Footer />
    </div>
  );
};

export default HomePage;