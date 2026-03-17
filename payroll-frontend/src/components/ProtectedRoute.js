import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
        return <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
