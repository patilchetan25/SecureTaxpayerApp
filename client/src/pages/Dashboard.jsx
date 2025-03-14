import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link for routing
import questionnaireImg from '../assets/Questionnaire.png';  // Importing the icon for Questionnaire
import documentsImg from '../assets/questions and documents.png';  // Importing the icon for Documents
import './Dashboard.css';  // Add custom styles for the dashboard
import { useAuth } from '../context/authContext';

const Dashboard = () => {
  const [user, setUserData] = useState({});
  const { userInfo } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h3>Welcome, <span className="client-name">{userInfo.firstName} {userInfo.lastName}!</span></h3>
        <p>You are now connected to Secure Tax</p>
        <p className="fw-bold">Let's get started!</p>
      </div>

      {/* Icons Section - Questions and Documents */}
      <div className="icons-section">
        {/* Questionnaire Icon */}
        <div className="dashboard-icons-wrap">
          <Link to="/questions">
            <img className="icon" src={questionnaireImg} alt="Questionnaire" />
          </Link>
          <p className="icon-label">Questions</p>
        </div>

        {/* Documents Icon */}
        <div className="dashboard-icons-wrap">
          <Link to="/documents">
            <img className="icon" src={documentsImg} alt="Documents" />
          </Link>
          <p className="icon-label">Documents</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
