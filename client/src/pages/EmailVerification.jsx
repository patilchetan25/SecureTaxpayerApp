import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../Services/authservice';
import './Login.css';

const EmailVerification = () => {
    const { token } = useParams(); // 
    const [status, setStatus] = useState('loading'); // state
  
    useEffect(() => {
      const handleEmailVerification = async () => {
        try {
          await verifyEmail(token); 
          setStatus('success'); 
        } catch (error) {
          setStatus('error');
        }
      };
  
      handleEmailVerification();
    }, [token]);
  
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
        {status === 'loading' && <h1>Verifying your email...</h1>}
        {status === 'success' && (
          <div>
            <h1 style={{ color: '#4CAF50' }}>Email Verified Successfully!</h1>
            <p>You can now log in to your account.</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h1 style={{ color: '#FF0000' }}>Verification Failed</h1>
            <p>The link may have expired or is invalid.</p>
          </div>
        )}
      </div>
    //    <div className="login-container">
    //    <div className="image-section">
    //      {/* Background image is set in CSS */}
    //    </div>
    //    <div className="form-section">
    //      <div className="login-box">
    //        <h2>Login</h2>
    //        <form onSubmit={loginUser}>
    //          <div className="input-group">
    //            <label htmlFor="email">Email</label>
    //            <input
    //              type="email"
    //              id="email"
    //              name="email"
    //              value={data.email}
    //              onChange={(e) => setData({ ...data, email: e.target.value })}
    //              required
    //            />
    //          </div>
    //          <div className="input-group">
    //            <label htmlFor="password">Password</label>
    //            <input
    //              type="password"
    //              id="password"
    //              name="password"
    //              value={data.password}
    //              onChange={(e) => setData({ ...data, password: e.target.value })}
    //              required
    //            />
    //          </div>
    //          <button type="submit">Login</button>
    //          {/* Add a class to the Register button */}
    //          <button type="button" className="register-button" onClick={goToRegister}>
    //            Register</button>
    //        </form>
    //      </div>
    //    </div>
    //  </div>
    );
  };
  
  export default EmailVerification;