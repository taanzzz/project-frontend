// 📁 File: src/routes/ContributorRoute.jsx
import React from 'react';
import { Navigate } from 'react-router';
import useRole from './../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';



const ContributorRoute = ({ children }) => {
    const { isContributor, isRoleLoading } = useRole();

    if (isRoleLoading) {
        return <LoadingSpinner />;
    }
    if (isContributor) {
        return children;
    }
    return <Navigate to="/" replace />;
};
export default ContributorRoute;