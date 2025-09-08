import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requireAdmin = false, redirectPath = '/login' }) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    const hasAccess = isAuthenticated && (!requireAdmin || isAdmin);

    return hasAccess ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;