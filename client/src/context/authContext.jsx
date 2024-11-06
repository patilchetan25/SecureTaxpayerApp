import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const response = await axios.get('/checkAuth');
            console.log(response.data)
            setIsAuthenticated(response.data.authenticated);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };


    const login = async (credentials) => {
        try {
            const response = await axios.post('/loginUser', credentials);
            console.log("info");
            if (response.data.error) {
                setIsAuthenticated(false);
                toast.error(response.data.error);
            } else {
                setIsAuthenticated(true);
                toast.success('Login Successfull');
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAdmin', response.data.user.isAdmin); // Guarda si el usuario es admin o no
            
                if (response.data.user.isAdmin) {
                    navigate('/admin'); // Redirect to the administration panel
                } else {
                    navigate('/'); // Redirects to the main page
                }
            }
        } catch (error) {
            setError("Login failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logoutUser', {});
            setIsAuthenticated(false);
            setError(null); // Clear any previous errors

            localStorage.removeItem('user');
            localStorage.removeItem('isAdmin');
        } catch (error) {
            setError("Logout failed: " + error.response?.data?.error || "An error occurred.");
        }
    };

    const register = async (credentials) => {
        try {
            const response = await axios.post('/registerUser', credentials);
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
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, error, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
