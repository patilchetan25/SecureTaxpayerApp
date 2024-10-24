import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext'; // Adjust the path as necessary

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect them to the login page if not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render children if authenticated
};

export default ProtectedRoute;
