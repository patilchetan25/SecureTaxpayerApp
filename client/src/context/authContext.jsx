import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {encryptRequestBody  } from '../Services/encryption.service'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate();
    

    const checkAuth = async () => {
        try {
            const response = await axios.get('/checkAuth');
            setIsAuthenticated(response.data.authenticated);
            setUserInfo(response.data.user);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const updateUserInfo = (user) => {
        setUserInfo(user);
    }


    const login = async (credentials) => {
        try {
            const encryptedLoginCredentials = encryptRequestBody(credentials);
            const aesKey = encryptedLoginCredentials.aesKey;
            delete encryptedLoginCredentials.aesKey
            const response = await axios.post('/loginUser', encryptedLoginCredentials);
            if (response.data.error) {
                setIsAuthenticated(false);
                toast.error(response.data.error);
            } else {
                //setIsAuthenticated(true);
                toast.success('Email has been sent successfully');
                //setUserInfo(response.data.user);
                if (response.data.twoFactorRequired) {
                    return { twoFactorRequired: true };
                }
                /*if (response.data.user.isAdminUser) {
                    navigate('/admin'); // Redirect to the administration panel
                } else {
                    navigate('/'); // Redirects to the main page
                }*/
            }
        } catch (error) {
            setError("Login failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const verify2FA = async (code) => {
        try {
          const response = await axios.post('/validateTwoFactorCode', { code });
          if (response.data.error) {

            toast.error(response.data.error);

          }else{

            if (response.data.user.isAdminUser) {
                navigate('/admin'); // Redirect to the administration panel
            } else {
                navigate('/'); // Redirects to the main page
            }

          }
          //return response.data; // Expected response: { success: true/false }
        } catch (error) {
            setError("Login failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logoutUser', {});
            setIsAuthenticated(false);
            setUserInfo({})
            setError(null); // Clear any previous errors
        } catch (error) {
            setError("Logout failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const register = async (credentials) => {
        const encryptedLoginCredentials = encryptRequestBody(credentials);
        const aesKey = encryptedLoginCredentials.aesKey;
        delete encryptedLoginCredentials.aesKey
        try {
            const response = await axios.post('/registerUser', encryptedLoginCredentials);
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success('Registration Successfull');
                navigate('/login');
            }
        } catch (error) {
            setError("Registration failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout, register, error, checkAuth,updateUserInfo, verify2FA }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
    
};
