import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading authentication status...</div>; 
    }

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // User is logged in but does not have the right role
        // Navigate to a generic dashboard or a more specific "unauthorized" page
       console.warn(`Access denied for role "${user.role}" to route requiring roles: ${allowedRoles.join(', ')}`);
        // Redirect to their default page or a generic dashboard
        if (user.role === 'Admin') return <Navigate to="/admin/create-software" replace />;
        if (user.role === 'Manager') return <Navigate to="/manager/pending-requests" replace />;
        if (user.role === 'Employee') return <Navigate to="/employee/request-access" replace />;
        return <Navigate to="/dashboard" replace />; // Fallback dashboard
    }

    return <Outlet />; 
};

export default ProtectedRoute;
