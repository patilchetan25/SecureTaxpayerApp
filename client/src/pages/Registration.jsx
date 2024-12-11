import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../context/authContext';
import { Link } from 'react-router-dom';  // Import Link from React Router
import './Registration.css';
import secureTax from '../assets/SecureTax.png';  // Importing the icon for Questionnaire
import LoadingModal from '../pages/LoadingModal'; // Import the modal component

export default function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Status to show loading
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register(data);
    setLoading(false); 
  };

  return (
    <div className="registration-container">
      {/* loading modal */}
      <LoadingModal loading={loading} />
      <div className="image-section">
        {/* Background image is set in CSS */}
      </div>
      <div className="form-section">
        <div className="registration-box">
        <img src={secureTax}></img>
          <h4>Create Your Account</h4>
          <form onSubmit={registerUser}>
            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit">Register</button>
          </form>

          {/* Sign In Link */}
          <div className="login-redirect">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
