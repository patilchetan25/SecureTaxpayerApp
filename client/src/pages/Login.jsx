import React, { useState } from 'react';
import { useAuth } from './../context/authContext';
import { useNavigate } from 'react-router-dom';
import secureTax from '../assets/SecureTax.png';  // Importing the icon for Questionnaire
import LoadingModal from '../components/LoadingModal'; // Import the modal component

export default function Login() {
  const { isAuthenticated, login, error, verify2FA } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [isTwoFactorRequired, setIsTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loading, setLoading] = useState(false); // Status to show loading

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading
    const result = await login(data);
    setLoading(false); // hide loading
    if (result.twoFactorRequired) {
      setIsTwoFactorRequired(true); // show form 2FA
      console.log(isTwoFactorRequired); 
    }
  };

  const goToRegister = () => {
    navigate('/registration');
  };

  const handle2FACodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading
    const result = await verify2FA(twoFactorCode);
    setLoading(false); // hide loading

    
  };

  return (
    <div className="login-container">
      {/* loading modal */}
      <LoadingModal loading={loading} />

      <div className="image-section">
        {/* Background image is set in CSS */}
      </div>
      <div className="form-section">
        <div className="login-box">
          <img src={secureTax} alt="SecureTax Logo" />
          <h4>{isTwoFactorRequired ? "Enter 2FA Code" : "Please Log In"}</h4>
          {isTwoFactorRequired ? (
            <form onSubmit={handle2FACodeSubmit}>
              <div className="input-group">
                <label htmlFor="twoFactorCode">
                  We have implemented a new Two-Factor Authentication (2FA) system. Please check your email for the verification code to complete your login process.
                </label>
                <input
                  type="text"
                  id="twoFactorCode"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Verify Code</button>
            </form>
          ) : (
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
              <button
                type="button"
                className="register-button"
                onClick={() => navigate('/registration')}
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}