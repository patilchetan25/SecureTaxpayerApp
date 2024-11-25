import React, { useState } from 'react';
import { useAuth } from './../context/authContext';
import { useNavigate } from 'react-router-dom';
import secureTax from '../assets/SecureTax.png';  // Importing the icon for Questionnaire


export default function Login() {
  const { isAuthenticated, login, error } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const loginUser = async (e) => {
    e.preventDefault();
    await login(data);
  };

  const goToRegister = ()=>{
    navigate('/registration')
  }

  return (
    <div className="login-container">
      <div className="image-section">
        {/* Background image is set in CSS */}
      </div>
      <div className="form-section">
        <div className="login-box">
          <img src={secureTax}></img>
          <h4>Please Log In</h4>
          <img></img>
          <form onSubmit={loginUser}>
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
            <button type="submit">Login</button>
            {/* Add a class to the Register button */}
            <button type="button" className="register-button" onClick={goToRegister}>
              Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
