// components/FeaturesSection.js - Features Section Component

import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      id: 'admin',
      icon: 'fas fa-user-cog',
      iconClass: 'admin-icon',
      title: 'Admin Dashboard',
      titleColor: 'text-primary',
      items: [
        'Create and manage user profiles',
        'Schedule and modify appointments',
        'Search appointments by patient or doctor',
        'View comprehensive patient and doctor lists',
        'Full CRUD operations on all data'
      ]
    },
    {
      id: 'patient',
      icon: 'fas fa-user',
      iconClass: 'patient-icon',
      title: 'Patient Dashboard',
      titleColor: 'text-success',
      items: [
        'View upcoming appointments',
        'Review appointment history',
        'Cancel appointments when needed',
        'Update personal information',
        'Change password securely'
      ]
    },
    {
      id: 'doctor',
      icon: 'fas fa-stethoscope',
      iconClass: 'doctor-icon',
      title: 'Doctor Dashboard',
      titleColor: 'text-info',
      items: [
        'View daily appointment schedule',
        'Access weekly schedule overview',
        'Review monthly appointments',
        'Patient information at a glance',
        'Secure password management'
      ]
    }
  ];

  return (
    <section id="features" className="py-5 bg-light">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="display-5 fw-bold text-dark mb-3">
              Designed for Every Role
            </h2>
            <p className="lead text-muted">
              Role-based dashboards tailored to your specific needs and responsibilities
            </p>
          </div>
        </div>
        
        <div className="row g-4">
          {features.map((feature) => (
            <div key={feature.id} className="col-lg-4 col-md-4">
              <div className="card feature-card h-100 shadow-sm border-0">
                <div className="card-body p-4 text-center">
                  <div className={`feature-icon ${feature.iconClass} mb-3`}>
                    <i className={feature.icon}></i>
                  </div>
                  <h4 className={`fw-bold ${feature.titleColor} mb-3`}>
                    {feature.title}
                  </h4>
                  <ul className="list-unstyled text-start">
                    {feature.items.map((item, index) => (
                      <li key={index} className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;