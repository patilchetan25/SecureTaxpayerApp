import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyEmail } from '../Services/authservice';
import './Login.css';
import secureTax from '../assets/SecureTax.png';  // Importing the icon for Questionnaire

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
    // <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
    //   {status === 'loading' && <h1>Verifying your email...</h1>}
    //   {status === 'success' && (
    //     <div>
    //       <h1 style={{ color: '#4CAF50' }}>Email Verified Successfully!</h1>
    //       <p>You can now log in to your account.</p>
    //     </div>
    //   )}
    //   {status === 'error' && (
    //     <div>
    //       <h1 style={{ color: '#FF0000' }}>Verification Failed</h1>
    //       <p>The link may have expired or is invalid.</p>
    //     </div>
    //   )}
    // </div>
    <div className="login-container">
      <div className="image-section">
        {/* Background image is set in CSS */}
      </div>
      <div className="form-section">
        <div className="login-box">
          <div className="login-redirect">
            <img src={secureTax}></img>
            {status === 'loading' && <h1>Verifying your email...</h1>}
          {status === 'success' && (
              <div>
                <h3>Email Verified Successfully!</h3>
                <p><u><Link to="/login">Sign In Now</Link></u></p>
              </div>
            )}
            {status === 'error' && (
              <div>
                <h3 style={{ color: '#FF0000' }}>Verification Failed</h3>
                <p>The link may have expired or is invalid.</p>
              </div>
            )} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;