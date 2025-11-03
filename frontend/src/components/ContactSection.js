// components/ContactSection.js - Contact Section Component

import React from 'react';

const ContactSection = ({ onLoginClick }) => {
  const handleContactSupport = () => {
    alert('Contact support feature coming soon!');
  };

  return (
    <section id="contact" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="contact-card">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h3 className="fw-bold mb-4">UG HealthConnect Hours</h3>
                  <p className="text-muted mb-4">
                    System available 24/7 for secure access
                  </p>
                  <p className="mb-3">
                    <strong>Technical Support:</strong><br />
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Weekend: Emergency support available
                  </p>
                  <div className="contact-buttons">
                    <button 
                      onClick={handleContactSupport}
                      className="btn btn-primary me-3 mb-2"
                    >
                      <i className="fas fa-envelope me-2"></i>Contact Support
                    </button>
                    <button 
                      onClick={onLoginClick}
                      className="btn btn-outline-primary mb-2"
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>Access System
                    </button>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="hours-table">
                    <h5 className="fw-bold mb-3">System Availability</h5>
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <tbody>
                          <tr>
                            <td className="fw-medium">Patient Access:</td>
                            <td className="text-end">24/7</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Doctor Access:</td>
                            <td className="text-end">24/7</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Admin Access:</td>
                            <td className="text-end">24/7</td>
                          </tr>
                          <tr className="border-top">
                            <td className="fw-medium text-success">Status:</td>
                            <td className="text-end">
                              <span className="badge bg-success">
                                <i className="fas fa-circle me-1"></i>Online
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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

export default ContactSection;