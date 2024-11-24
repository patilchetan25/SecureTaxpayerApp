// services/authService.js
import axios from 'axios';
import config from '../../config';

// Verify email with token
export const verifyEmail = async (token) => {
    try {
        const response = await axios.get(`${config.apiUrl}/verify-email`, {
            params: { token }, 
        });
        return response.data; 
    } catch (error) {
        console.error("Error verifying email:", error);
        throw error; 
    }
};

// Unlock account with token
export const unlockAccount = async (token) => {
    try {
        const response = await axios.get(`${config.apiUrl}/unlock-account`, {
            params: { token }, 
        });
        return response.data;
    } catch (error) {
        console.error("Error unlocking account:", error);
        throw error;
    }
};
