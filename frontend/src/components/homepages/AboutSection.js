// components/AboutSection.js - About Section Component

import React from 'react';

const AboutSection = () => {
  const features = [
    {
      icon: 'fa-etch fa-solid fa-circle-user',
      iconClass: 'security-icon',
      title: 'Who We Are',
      description: 'UG Health Connect is a modern, patient-centered healthcare platform designed to make managing primary care easier, faster, and more accessible. We bring patients, doctors, and clinic staff together in one secure system, offering a smooth experience from booking appointments to viewing medical information.'
    },
    {
      icon: 'fa-etch fa-solid fa-clipboard',
      iconClass: 'efficient-icon',
      title: 'What We Offer',
      description: 'We provide a streamlined digital experience with convenient online appointment scheduling, personalized patient dashboards, secure communication, and real-time updates. Our platform helps clinics improve workflow efficiency while giving patients the flexibility and confidence they need to manage their own care.'
    },
    {
      icon: 'fa-etch fa-solid fa-trophy',
      iconClass: 'scalable-icon',
      title: 'Why People Choose Us',
      description: 'People love UG Health Connect because it combines convenience, trust, and modern technology. They get shorter waiting times, easy access to appointments, clear information, and a friendly user experience. Clinics appreciate the organized system, reduced administrative workload, and improved patient satisfaction. UG Health Connect makes healthcare simple, connected, and stress-free.'
    }
  ];

  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="display-5 fw-bold mb-3">Why Choose UG HealthConnect?</h2>
            <p className="lead text-muted">
              A comprehensive solution designed for modern healthcare management
            </p>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="about-feature">
                <div className={`about-icon ${feature.iconClass} mb-3`}>
                  <i className={feature.icon}></i>
                </div>
                <h5 className="fw-bold">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm border-0 p-4">
              <h4 className="fw-bold mb-3">Project Overview</h4>
              <p className="text-muted mb-3">
                UG HealthConnect is a web-based healthcare management system developed for 
                primary care practices. This Single Page Application 
                (SPA) provides a secure, efficient platform for managing patient appointments, 
                user profiles, and healthcare workflows.
              </p>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                      <i className="fas fa-users fa-2x text-primary"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">3 User Roles</h6>
                      <small className="text-muted">Admin, Doctor, Patient</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded p-3 me-3">
                      <i className="fas fa-calendar-check fa-2x text-success"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Smart Scheduling</h6>
                      <small className="text-muted">Efficient appointments</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 rounded p-3 me-3">
                      <i className="fas fa-lock fa-2x text-info"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Secure Access</h6>
                      <small className="text-muted">JWT authentication</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;