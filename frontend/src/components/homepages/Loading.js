// components/Loading.js - Loading Spinner Component

import React from 'react';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="d-flex justify-content-center align-items-center" 
           style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" 
               style={{ width: '3rem', height: '3rem' }} 
               role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
};

export default Loading;