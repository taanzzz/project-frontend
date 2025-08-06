// 📁 File: src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';


const AdminRoute = ({ children }) => {
    const { isAdmin, isRoleLoading } = useRole();

    if (isRoleLoading) {
        return <LoadingSpinner />;
    }
    if (isAdmin) {
        return children;
    }
    return <Navigate to="/" replace />;
};
export default AdminRoute;