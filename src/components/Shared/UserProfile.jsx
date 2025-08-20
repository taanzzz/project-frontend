// 📁 File: src/components/Shared/UserProfile.jsx

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiDashboardFill } from "react-icons/ri";
import { NavLink } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';

const UserProfile = () => {
    const { logout, loading: authLoading } = useAuth();
    const { data: userProfile, isLoading: profileLoading } = useUserProfile(); 
    
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => clearTimeout(timeoutRef.current, setOpen(true));
    const handleMouseLeave = () => timeoutRef.current = setTimeout(() => setOpen(false), 300);
    const handleClick = () => setOpen((prev) => !prev);
    
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('👋 Successfully logged out!');
            setOpen(false);
        } catch (err) {
            toast.error('⚠️ Failed to logout!');
        }
    };

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }
    };
    
    // ✅ authLoading এবং profileLoading উভয়ই শেষ হওয়ার জন্য অপেক্ষা করা হচ্ছে
    if (authLoading || profileLoading) {
        return (
            <div className="w-10 h-10 flex items-center justify-center">
                <span className="loading loading-spinner loading-sm"></span>
            </div>
        );
    }

    if (!userProfile) return null;

    const defaultPhoto = `https://ui-avatars.com/api/?name=${userProfile.name}&background=0D9488&color=fff`;

    return (
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar" onClick={handleClick}>
                <div className="w-10 rounded-full ring-2 ring-offset-base-100 ring-offset-2 ring-primary/50 hover:ring-primary transition-all">
                    <img src={userProfile.image || defaultPhoto} alt="User profile" />
                </div>
            </label>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow-2xl bg-base-100 rounded-box w-60 absolute right-0 border border-base-300/20"
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <li className="p-2 border-b border-base-300/50">
                            <div className="flex flex-col items-start pointer-events-none">
                                <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{userProfile.name}</span>
                                <span className="text-xs text-base-content/70">{userProfile.email}</span>
                            </div>
                        </li>
                        <li>
                            <NavLink to="/dashboard" onClick={() => setOpen(false)} className="hover:text-primary">
                                <RiDashboardFill className="text-primary" />
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="text-error hover:bg-error/10">
                                <FaSignOutAlt />
                                Logout
                            </a>
                        </li>
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfile;