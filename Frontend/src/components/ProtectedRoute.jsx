import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { state } = useAuth();
    const location = useLocation();
    const userRole = state?.user?.role?.toLowerCase();

    useEffect(() => {
        console.log('Protected Route State:', {
            user: state?.user,
            userRole,
            allowedRoles,
            currentPath: location.pathname
        });
    }, [state?.user, userRole, allowedRoles, location]);

    // If user is not logged in, redirect to login
    if (!state?.user) {
        console.log('No user found, redirecting to login');
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // If user's role is not in the allowed roles, redirect to their dashboard
    if (!allowedRoles.includes(userRole)) {
        console.log('Unauthorized access, redirecting to appropriate dashboard');
        const redirectPath = userRole === 'user' ? '/pegawai/dashboard' : '/';
        return <Navigate to={redirectPath} replace state={{ from: location }} />;
    }

    // If user is authorized, render the protected component
    return children;
};

export default ProtectedRoute; 