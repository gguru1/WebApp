import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const PatientNavbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-info shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">
          <i className="fas fa-user me-2"></i>
          Patient Dashboard
        </span>
        <div>
          <span className="text-white me-3">
            Welcome, {user?.firstName || user?.username}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            <i className="fas fa-sign-out-alt me-1"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PatientNavbar;