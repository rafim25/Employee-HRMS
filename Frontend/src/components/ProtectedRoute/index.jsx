import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { state } = useAuth();
    const userRole = state?.user?.role;

    // If user is not logged in, redirect to login
    if (!state?.user) {
        return <Navigate to="/" replace />;
    }

    // If user's role is not in the allowed roles, redirect to their dashboard
    if (!allowedRoles.includes(userRole?.toLowerCase())) {
        return <Navigate to={userRole?.toLowerCase() === 'user' ? '/pegawai/dashboard' : '/'} replace />;
    }

    // If user is authorized, render the protected component
    return children;
};

export default ProtectedRoute; 