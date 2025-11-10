// components/admin/StatisticsCards.js - Dashboard Statistics Cards

import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import appointmentService from '../../services/appointmentService';

const StatisticsCards = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    loading: true
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      // Fetch all users
      const usersData = await userService.getAllUsers();
      const users = usersData.users || usersData;

      // Count by role
      const admins = users.filter(u => u.role === 'admin').length;
      const doctors = users.filter(u => u.role === 'doctor').length;
      const patients = users.filter(u => u.role === 'patient').length;

      // Fetch all appointments
      const appointmentsData = await appointmentService.getAllAppointments();
      const appointments = appointmentsData.appointments || appointmentsData;

      // Count today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayAppts = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate >= today && apptDate < tomorrow;
      }).length;

      // Count this week's appointments
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const weekAppts = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate >= weekStart && apptDate < weekEnd;
      }).length;

      setStats({
        totalUsers: users.length,
        totalAdmins: admins,
        totalDoctors: doctors,
        totalPatients: patients,
        totalAppointments: appointments.length,
        todayAppointments: todayAppts,
        weekAppointments: weekAppts,
        loading: false
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) {
    return <div>Loading statistics...</div>;
  }

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'fas fa-users',
      color: 'primary',
      change: null
    },
    {
      title: 'Doctors',
      value: stats.totalDoctors,
      icon: 'fas fa-user-md',
      color: 'success',
      change: null
    },
    {
      title: 'Patients',
      value: stats.totalPatients,
      icon: 'fas fa-user',
      color: 'info',
      change: null
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: 'fas fa-calendar',
      color: 'warning',
      change: null
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: 'fas fa-calendar-day',
      color: 'primary',
      change: null
    },
    {
      title: "This Week",
      value: stats.weekAppointments,
      icon: 'fas fa-calendar-week',
      color: 'success',
      change: null
    }
  ];

  return (
    <div className="statistics-cards">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card ${card.color}`}>
          <div className="stat-card-header">
            <div className={`stat-card-icon ${card.color}`}>
              <i className={card.icon}></i>
            </div>
          </div>
          <div className="stat-card-title">{card.title}</div>
          <div className="stat-card-value">{card.value}</div>
          {card.change && (
            <div className={`stat-card-change ${card.change > 0 ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${card.change > 0 ? 'up' : 'down'} me-1`}></i>
              {Math.abs(card.change)}% from last month
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;