// 📁 File: src/layouts/StoreLayout.jsx
import React from 'react';
import StoreNavbar from './../components/Store/StoreNavbar';
import { Outlet } from 'react-router';
import StoreFooter from './../components/Store/StoreFooter';
import ScrollToTop from './../components/Shared/ScrollToTop';

const StoreLayout = () => {
    return (
        <div className='min-h-screen flex flex-col overflow-x-hidden'>
            <StoreNavbar />
             <ScrollToTop />
            <main className='mt-17'>
                <Outlet />
            </main>
            <StoreFooter />
        </div>
    );
};
export default StoreLayout;