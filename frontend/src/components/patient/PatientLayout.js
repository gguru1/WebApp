import React from "react";
import PatientNavbar from "./PatientNavbar";

const PatientLayout = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <PatientNavbar />
      <div className="container mt-5">{children}</div>
    </div>
  );
};

export default PatientLayout;