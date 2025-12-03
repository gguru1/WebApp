// components/patient/DoctorsList.js

import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      console.log('Loading doctors...');
      const data = await userService.getUsersByRole('doctor');
      console.log('Doctors data received:', data);
      const doctorsList = data.users || data || [];
      console.log('Doctors list:', doctorsList);
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">
      <div className="spinner-border text-primary"></div>
    </div>;
  }

  return (
    <>
      <div className="page-header">
        <h2>Our Doctors</h2>
        <p>Meet our healthcare professionals</p>
      </div>

      <div className="row">
        {doctors.length === 0 ? (
          <div className="col-12">
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-user-md fa-3x text-muted mb-3"></i>
                <h5>No doctors available</h5>
              </div>
            </div>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.user_id} className="col-md-6 col-lg-4 mb-4">
              <div className="doctor-card">
                <div className="text-center mb-3">
                  <div className="doctor-avatar mx-auto">
                    {doctor.first_name?.charAt(0)}{doctor.last_name?.charAt(0)}
                  </div>
                </div>
                
                <h5 className="text-center">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h5>
                
                <div className="mt-3">
                  <p className="text-muted mb-2">
                    <i className="fas fa-envelope me-2"></i>
                    {doctor.email}
                  </p>
                </div>

                <div className="text-center mt-3">
                  <div className="alert alert-info mb-0">
                    <small>
                      <i className="fas fa-phone me-1"></i>
                      Contact clerk to book
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DoctorsList;