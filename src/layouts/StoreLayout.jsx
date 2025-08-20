// 📁 File: src/layouts/StoreLayout.jsx

import React, { Suspense } from 'react';
import StoreNavbar from './../components/Store/StoreNavbar';
import { Outlet } from 'react-router'; // ✅ Shothik import
import StoreFooter from './../components/Store/StoreFooter';
import ScrollToTop from './../components/Shared/ScrollToTop';
import LoadingSpinner from '../components/Shared/LoadingSpinner'; // ✅ Loading UI

const StoreLayout = () => {
    return (
        <div className='min-h-screen flex flex-col overflow-x-hidden'>
            <StoreNavbar />
            <ScrollToTop />
            {/* ✅ mt-20 bebohar kora hocche, ja shothik margin debe */}
            <main className='flex-grow pt-20'>
                <Suspense fallback={<LoadingSpinner />}>
                    <Outlet />
                </Suspense>
            </main>
            <StoreFooter />
        </div>
    );
};

export default StoreLayout;