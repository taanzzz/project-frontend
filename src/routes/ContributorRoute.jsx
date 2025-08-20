// 📁 File: src/routes/ContributorRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const ContributorRoute = ({ children }) => {
    const { isContributor, isRoleLoading } = useRole();
    const location = useLocation();

    if (isRoleLoading) {
        return <LoadingSpinner />;
    }

    if (isContributor) {
        return children;
    }

    // যদি Contributor না হয়, তবে তাকে আগের পেইজে ফেরত পাঠানো হবে
    return <Navigate to="/" state={{ from: location }} replace />;
};

export default ContributorRoute;