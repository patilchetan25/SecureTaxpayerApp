import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../Services/authservice';

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
    );
  };
  
  export default EmailVerification;