// 📁 File: src/routes/MemberRoute.jsx
import React from 'react';
import { Navigate } from 'react-router';
import useRole from './../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';


const MemberRoute = ({ children }) => {
    const { isMember, isRoleLoading } = useRole();

    if (isRoleLoading) {
        return <LoadingSpinner />;
    }
    if (isMember) {
        return children;
    }
    return <Navigate to="/" replace />;
};
export default MemberRoute;