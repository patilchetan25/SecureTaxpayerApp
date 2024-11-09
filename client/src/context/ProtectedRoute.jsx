import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext'; // Adjust the path as necessary

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuth } = useAuth(); // Assuming checkAuth is a function to verify authentication
    const location = useLocation();
    const [loading, setLoading] = useState(true); // State to track loading

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth(); // Call your API to check authentication
            setLoading(false); // Update loading state
        };

        verifyAuth();
    }, []); // Empty dependency array to run the effect once on mount

    if (loading) {
        return <div>Loading...</div>; // Or a spinner/loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render children if authenticated
};

export const AdminProtectedRoute = ({ children }) => {
    const { isAuthenticated, checkAuth, userInfo } = useAuth();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const isAdmin = (userInfo && userInfo.isAdminUser == true) ? true : false // Check if the user is admin

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
            setLoading(false);
        };

        verifyAuth();
    }, []); // Empty dependency array to run the effect once on mount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};
