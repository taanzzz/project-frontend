// 📁 File: src/components/Community/LeftSidebar.jsx

import React from 'react';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Link, NavLink } from 'react-router';
import { FaEnvelope, FaBell, FaGamepad } from "react-icons/fa";
import useNotifications from './../../hooks/useNotifications';

const LeftSidebar = () => {
    const { user, loading: authLoading } = useAuth();
    const { data: currentUserProfile, isLoading: profileLoading } = useUserProfile();
    const { unreadCount } = useNotifications();

    if (authLoading || profileLoading) {
        return (
            <aside className="bg-base-100/50 backdrop-blur-xl p-4 rounded-2xl shadow-xl fixed top-24 w-72">
                <LoadingSpinner />
            </aside>
        );
    }

    return (
        <aside className="fixed bg-base-100/50 backdrop-blur-xl border border-base-300/20 p-4 rounded-2xl shadow-xl top-24 space-y-4 w-72">
            {user && currentUserProfile ? (
                // --- Enhanced User Profile Section ---
                <div className="text-center pb-4 border-b border-base-300/60">
                    <div className="avatar online mx-auto p-1 bg-gradient-to-br from-primary to-secondary rounded-full">
                        <div className="w-24 rounded-full border-4 border-base-100">
                            <img src={currentUserProfile.image} alt={currentUserProfile.name} />
                        </div>
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold">{currentUserProfile.name}</h3>
                    <p className="text-sm text-base-content/70 break-all">{currentUserProfile.email}</p>
                    <Link 
                        to={`/profiles/${currentUserProfile._id}`} 
                        className="btn border-none text-white bg-gradient-to-r from-primary to-secondary btn-sm mt-4 w-full transform transition-transform hover:scale-105"
                    >
                        View My Profile
                    </Link>
                </div>
            ) : (
                <p>Please log in.</p>
            )}

            {/* --- Enhanced Navigation Menu --- */}
            <ul className="menu bg-transparent w-full rounded-box p-0">
                <li>
                    <NavLink to="/messages" className={({isActive}) => `text-lg rounded-lg ${isActive && 'bg-primary/10 text-primary font-bold'}`}>
                        <FaEnvelope /> Messages
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/notifications" className={({isActive}) => `text-lg rounded-lg ${isActive && 'bg-primary/10 text-primary font-bold'}`}>
                        <FaBell /> Notifications
                        {unreadCount > 0 && <div className="badge badge-secondary animate-pulse">+{unreadCount}</div>}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/gaming-zone" className={({isActive}) => `text-lg rounded-lg ${isActive && 'bg-primary/10 text-primary font-bold'}`}>
                        <FaGamepad /> Gaming Zone
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default LeftSidebar;