import React from 'react';
import './LoadingModal.css';

const LoadingModal = ({ loading }) => {
  if (!loading) return null; 

  return (
    <div className="loading-modal">
      <div className="loading-content">
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
