// components/TechnologySection.js - Technology Stack Section Component

import React from 'react';

const TechnologySection = () => {
  const technologies = [
    {
      name: 'Standard Sick Visit',
      description: 'Fast, convenient care for common illnesses like colds, fevers, and minor infections.',
      icon: 'fas fa-id-card-alt',
      iconClass: 'react-color'
    },
    {
      name: 'Wound Care Clinic',
      description: 'Expert treatment for both minor and complex wounds to support safe and effective healing.',
      icon: 'fas fa-user-md',
      iconClass: 'node-color'
    },
    {
      name: 'Timely Service',
      description: 'We offer quick appointments and efficient check-ins to minimize wait times and keep your visit smooth.',
      icon: 'fas fa-clock',
      iconClass: 'mongo-color'
    },
    {
      name: 'Accepted Insurances',
      description: 'We accept many major insurance plans',
      icon: 'fas fa-receipt',
      iconClass: 'bootstrap-color'
    }
  ];

  return (
    <section id="technology" className="py-5">
      <div className="container">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="display-5 fw-bold mb-3">Built With a Commitment to Health + Technology</h2>
            <p className="lead text-muted">
              UG Health Connect is developed with a strong focus on combining healthcare expertise with modern technology, creating a smarter and more efficient experience for patients and providers.
            </p>
          </div>
        </div>
        
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            {technologies.map((tech, index) => (
              <div key={index} className="tech-item mb-3">
                <div className={`tech-icon ${tech.iconClass}`}>
                  <i className={tech.icon}></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-1">{tech.name}</h5>
                  <p className="text-muted mb-0">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="col-lg-6">
            <div className="tech-visual">
              <div className="tech-card">
                <div className="text-center">
                  <div className="tech-main-icon mb-4">
                    <i className="fas fa-code"></i>
                  </div>
                  <h5 className="fw-bold mb-3">MERN Stack Architecture</h5>
                  <p className="text-muted mb-4">
                    Full-stack JavaScript development with PostgreSQL, Express.js, React, and Node.js
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <i className="fab fa-react fa-2x text-primary"></i>
                    <i className="fab fa-node-js fa-2x text-success"></i>
                    <i className="fas fa-database fa-2x text-info"></i>
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

export default TechnologySection;