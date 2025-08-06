// 📁 File: src/layouts/DashboardLayout.jsx

import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import { FaBars } from "react-icons/fa";
import { AuthContext } from './../contexts/AuthProvider';
import LoadingSpinner from './../components/Shared/LoadingSpinner';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    const { loading } = useContext(AuthContext);
    if (loading) return <LoadingSpinner />;

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            
            {/* --- Main Content Area --- */}
            <div className="drawer-content flex flex-col bg-base-100">
                {/* Navbar for Mobile */}
                <div className="w-full navbar bg-base-200 lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                            <FaBars className="text-xl"/>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold">Dashboard Menu</div>
                </div>
                
                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div> 

            {/* --- Sidebar --- */}
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                <Sidebar />
            </div>
        </div>
    );
};
export default DashboardLayout;