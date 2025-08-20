// 📁 File: src/components/Community/LeftSidebar.jsx

import React from 'react';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Link, NavLink } from 'react-router';
import { FaEnvelope, FaBell, FaGamepad, FaTimes } from "react-icons/fa";
import useNotifications from '../../hooks/useNotifications';
import { motion } from 'framer-motion';

const LeftSidebar = ({ isDark, onClose }) => {
    const { user, loading: authLoading } = useAuth();
    const { data: currentUserProfile, isLoading: profileLoading } = useUserProfile();
    const { unreadCount } = useNotifications();

    if (authLoading || profileLoading) {
        return (
            <motion.aside 
                className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-xl border rounded-3xl shadow-2xl p-6 fixed top-24 w-72`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="flex justify-center py-8">
                    <LoadingSpinner />
                </div>
            </motion.aside>
        );
    }

    const navigationItems = [
        { to: "/messages", icon: FaEnvelope, label: "Messages" },
        { to: "/notifications", icon: FaBell, label: "Notifications", badge: unreadCount },
        { to: "/gaming-zone", icon: FaGamepad, label: "Gaming Zone" }
    ];

    return (
        <motion.aside 
            className={`fixed ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-xl border rounded-3xl shadow-2xl top-24 space-y-6 w-72 p-6 max-h-[calc(100vh-7rem)] overflow-y-auto`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Mobile Close Button */}
            {onClose && (
                <motion.button
                    onClick={onClose}
                    className={`absolute top-4 right-4 btn btn-circle btn-sm border-none ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-pink-100/80 text-gray-600 hover:bg-pink-200/80'} lg:hidden`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaTimes />
                </motion.button>
            )}

            {user && currentUserProfile ? (
                <motion.div 
                    className={`text-center pb-6 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* Profile Avatar with Gradient Ring */}
                    <motion.div 
                        className={`avatar online mx-auto p-1 bg-gradient-to-br ${isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'} rounded-full`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={`w-20 h-20 rounded-full border-4 ${isDark ? 'border-gray-900' : 'border-white'}`}>
                            <img src={currentUserProfile.image} alt={currentUserProfile.name} />
                        </div>
                    </motion.div>
                    
                    {/* User Info */}
                    <motion.h3 
                        className={`mt-4 text-xl font-extrabold ${isDark ? 'text-gray-100' : 'text-gray-600'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    >
                        {currentUserProfile.name}
                    </motion.h3>
                    
                    <motion.p 
                        className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} break-all mb-4`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                    >
                        {currentUserProfile.email}
                    </motion.p>
                    
                    {/* Profile Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to={`/profiles/${currentUserProfile._id}`}
                            className={`btn border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} btn-sm w-full rounded-xl transition-all duration-300 shadow-lg`}
                        >
                            View My Profile
                        </Link>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    className={`text-center p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-sm`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Please log in to access your profile.</p>
                </motion.div>
            )}

            {/* Navigation Menu */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            >
                <ul className="menu bg-transparent w-full rounded-box p-0 space-y-2">
                    {navigationItems.map((item, index) => (
                        <motion.li
                            key={item.to}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * index }}
                        >
                            <NavLink 
                                to={item.to} 
                                className={({ isActive }) => 
                                    `text-lg rounded-xl p-3 flex items-center gap-3 transition-all duration-300 ${
                                        isActive 
                                            ? isDark 
                                                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 font-bold border border-indigo-500/30'
                                                : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600 font-bold border border-pink-500/30'
                                            : isDark
                                                ? 'text-gray-300 hover:bg-white/10 hover:text-indigo-400'
                                                : 'text-gray-600 hover:bg-pink-100/60 hover:text-pink-600'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <item.icon className={`text-xl ${isActive ? (isDark ? 'text-indigo-400' : 'text-pink-500') : ''}`} />
                                        </motion.span>
                                        <span>{item.label}</span>
                                        {item.badge && item.badge > 0 && (
                                            <motion.div 
                                                className={`badge text-xs border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} animate-pulse`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            >
                                                +{item.badge}
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </motion.aside>
    );
};

export default LeftSidebar;