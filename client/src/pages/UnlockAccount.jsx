import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { unlockAccount } from '../Services/authservice';
import secureTax from '../assets/SecureTax.png';  // Importing the icon for Questionnaire


const UnlockAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  let hasRun = false;

  useEffect(() => {
    if (!hasRun) {
      hasRun = true; // is executed

      const handleUnlockAccount = async () => {
        try {
          const response = await unlockAccount(token);
          if (response.message === 'Account unlocked successfully. You can now log in.') {
            setStatus('success');
          } else {
            setStatus('error');
          }
        } catch (error) {
          setStatus('error');
        }
      };

      handleUnlockAccount();
    }
  }, [token]);

  return (
    // <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
    //   {status === 'loading' && <h1>Unlocking your account...</h1>}
    //   {status === 'success' && (
    //     <div>
    //       <h1 style={{ color: '#4CAF50' }}>Account Unlocked Successfully!</h1>
    //       <p>You can now log in to your account.</p>
    //     </div>
    //   )}
    //   {status === 'error' && (
    //     <div>
    //       <h1 style={{ color: '#FF0000' }}>Unlock Failed</h1>
    //       <p>The link may have expired or is invalid. Please contact support.</p>
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
           {status === 'loading' && <h3>Unlocking your account...</h3>}
         {status === 'success' && (
             <div>
               <h3>Account Unlocked Successfully!</h3>
               <p><u><Link to="/login">Sign In Now</Link></u></p>
             </div>
           )}
           {status === 'error' && (
             <div>
               <h3 style={{ color: '#FF0000' }}>Unlock Failed</h3>
               <p>The link may have expired or is invalid. Please contact support.</p>
               <p><u><Link to="/login">Sign In</Link></u></p>
             </div>
           )} 
         </div>
       </div>
     </div>
   </div>
  );
};

export default UnlockAccount;
