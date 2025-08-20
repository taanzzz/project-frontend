import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router';
import { FaBars, FaArrowCircleLeft, FaTimes, FaBook, FaUsers, FaPlusSquare, FaListAlt, FaFeatherAlt, FaShoppingBag, FaShieldAlt, FaBrain } from "react-icons/fa";
import { ImProfile } from 'react-icons/im';
import { FiSettings } from 'react-icons/fi';
import { RxDashboard } from "react-icons/rx";
import { IoAnalyticsSharp } from 'react-icons/io5';
import { FaUserCheck } from 'react-icons/fa6';
import { AuthContext } from './../contexts/AuthProvider';
import LoadingSpinner from './../components/Shared/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import useRole from './../hooks/useRole';
import useAuth from './../hooks/useAuth';
import useUserProfile from './../hooks/useUserProfile';

// Enhanced ThemeToggle Component
const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <motion.button
            onClick={handleToggle}
            className={`relative w-14 h-7 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-300 to-gray-400'} rounded-full p-1 cursor-pointer transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme === 'dark' ? 'focus:ring-indigo-400/40' : 'focus:ring-pink-400/40'} hover:shadow-md`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className={`w-5 h-5 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-full shadow-md flex items-center justify-center transform transition-all duration-500`}
                animate={{ x: theme === "dark" ? 24 : 0, rotate: theme === "dark" ? 360 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {theme === "dark" ? (
                    <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg className="w-3 h-3 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                )}
            </motion.div>
        </motion.button>
    );
};

// Enhanced Sidebar Component
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const { logout } = useAuth();
    const { isAdmin, isContributor, isMember } = useRole();
    const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Sync theme with localStorage and data-theme
    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    const navLinkClass = ({ isActive }) =>
        `group relative flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md w-full truncate
         ${isActive
            ? `${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white shadow-lg border-l-4 border-white/30`
            : `${isDark ? 'hover:bg-white/10 text-gray-300 hover:text-indigo-400' : 'hover:bg-white/10 text-gray-600 hover:text-pink-500'} hover:bg-gradient-to-r hover:from-transparent hover:to-transparent`}`;

    const adminLinks = (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
        >
            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                Administration
            </div>
            <li><NavLink to="/dashboard/admin-dashboard" className={navLinkClass}>
                <RxDashboard className="w-5 h-5 mr-3 flex-shrink-0" /> Dashboard
                <span className="ml-auto px-2 py-1 text-xs bg-white/20 rounded-full">3</span>
            </NavLink></li>
            <li><NavLink to="/dashboard/manage-users" className={navLinkClass}>
                <FaUsers className="w-5 h-5 mr-3 flex-shrink-0" /> Manage Users
            </NavLink></li>
            <li><NavLink to="/dashboard/manage-content" className={navLinkClass}>
                <FaBook className="w-5 h-5 mr-3 flex-shrink-0" /> Manage Content
            </NavLink></li>
            <li><NavLink to="/dashboard/community-moderation" className={navLinkClass}>
                <FaShieldAlt className="w-5 h-5 mr-3 flex-shrink-0" /> Moderation
                <span className="ml-auto px-2 py-1 text-xs bg-red-500/80 rounded-full">!</span>
            </NavLink></li>
            <li><NavLink to="/dashboard/manage-applications" className={navLinkClass}>
                <FaUserCheck className="w-5 h-5 mr-3 flex-shrink-0" /> Applications
                <span className="ml-auto px-2 py-1 text-xs bg-yellow-500/80 rounded-full">7</span>
            </NavLink></li>
        </motion.div>
    );

    const contributorLinks = (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1"
        >
            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                Content Management
            </div>
            <li><NavLink to="/dashboard/contributor-dashboard" className={navLinkClass}>
                <RxDashboard className="w-5 h-5 mr-3 flex-shrink-0" /> Dashboard
            </NavLink></li>
            <li><NavLink to="/dashboard/add-content" className={navLinkClass}>
                <FaPlusSquare className="w-5 h-5 mr-3 flex-shrink-0" /> Add Content
            </NavLink></li>
            <li><NavLink to="/dashboard/my-content" className={navLinkClass}>
                <FaListAlt className="w-5 h-5 mr-3 flex-shrink-0" /> My Content
            </NavLink></li>
            <li><NavLink to="/dashboard/content-analytics" className={navLinkClass}>
                <IoAnalyticsSharp className="w-5 h-5 mr-3 flex-shrink-0" /> Analytics
            </NavLink></li>
        </motion.div>
    );

    const memberLinks = (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
        >
            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                Personal Space
            </div>
            <li><NavLink to="/dashboard/my-shelf" className={navLinkClass}>
                <FaBook className="w-5 h-5 mr-3 flex-shrink-0" /> My Shelf
            </NavLink></li>
            <li><NavLink to="/dashboard/my-activity" className={navLinkClass}>
                <FaListAlt className="w-5 h-5 mr-3 flex-shrink-0" /> My Activity
            </NavLink></li>
            <li><NavLink to="/dashboard/order-history" className={navLinkClass}>
                <FaShoppingBag className="w-5 h-5 mr-3 flex-shrink-0" /> Order History
            </NavLink></li>
        </motion.div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                className={`hidden lg:flex flex-col w-80 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-xl shadow-xl border-r text-${isDark ? 'gray-300' : 'gray-600'} overflow-x-hidden`}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Logo & Brand */}
                <motion.div 
                    className={`px-6 py-8 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center">
                        <div className={`w-12 h-12 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <FaBrain className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                            <h1 className={`text-xl font-bold ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} bg-clip-text text-transparent truncate`}>
                                Mind Over Myth
                            </h1>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>Dashboard</p>
                        </div>
                    </div>
                </motion.div>

                {/* User Profile Section */}
                {isProfileLoading ? (
                    <div className="flex justify-center px-6 py-6">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : userProfile && (
                    <motion.div 
                        className={`px-6 py-6 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={`${isDark ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' : 'bg-gradient-to-br from-white/60 to-gray-100/60'} backdrop-blur-sm rounded-2xl p-4 border ${isDark ? 'border-white/20' : 'border-pink-200/30'} shadow-md`}>
                            <div className="flex items-center">
                                <div className="relative flex-shrink-0">
                                    <div className="avatar">
                                        <div className={`w-14 h-14 rounded-2xl ring-2 ${isDark ? 'ring-indigo-400/30 ring-offset-gray-900' : 'ring-pink-400/30 ring-offset-white'} ring-offset-2`}>
                                            <img 
                                                src={userProfile.image} 
                                                alt={userProfile.name} 
                                                className="rounded-2xl object-cover w-full h-full" 
                                            />
                                        </div>
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isDark ? 'bg-green-400' : 'bg-green-500'} border-2 border-base-100 rounded-full shadow-sm`}></div>
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h3 className={`font-semibold text-base truncate ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>{userProfile.name}</h3>
                                    <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{userProfile.email}</p>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden">
                    <ul className="space-y-2">
                        {isAdmin && adminLinks}
                        {isContributor && contributorLinks}
                        {isMember && memberLinks}
                        
                        <div className="divider my-6"></div>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-1"
                        >
                            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                Account
                            </div>
                            <li><NavLink to="/dashboard/profile" className={navLinkClass}>
                                <ImProfile className="w-5 h-5 mr-3 flex-shrink-0" /> Profile
                            </NavLink></li>
                            <li><NavLink to="/dashboard/settings" className={navLinkClass}>
                                <FiSettings className="w-5 h-5 mr-3 flex-shrink-0" /> Settings
                            </NavLink></li>
                            <li><NavLink to="/" className={navLinkClass}>
                                <FaArrowCircleLeft className="w-5 h-5 mr-3 flex-shrink-0" /> Back to Home
                            </NavLink></li>
                        </motion.div>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className={`px-4 py-4 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                    <motion.button 
                        onClick={logout} 
                        className={`w-full flex items-center px-4 py-3 rounded-xl ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-500/10'} transition-all duration-300 group hover:scale-[1.02] hover:shadow-md truncate`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium truncate">Sign Out</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                        />
                        
                        {/* Mobile Sidebar Panel */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] ${isDark ? 'bg-gray-900/98 border-white/20' : 'bg-white/98 border-pink-200/50'} backdrop-blur-2xl shadow-2xl z-50 flex flex-col border-l overflow-x-hidden`}
                        >
                            {/* Mobile Header */}
                            <div className={`flex items-center justify-between px-6 py-6 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <FaBrain className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h1 className={`text-lg font-bold ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} bg-clip-text text-transparent truncate`}>
                                            Mind Over Myth
                                        </h1>
                                    </div>
                                </div>
                                <motion.button
                                    className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/20' : 'hover:bg-white/10'} transition-colors duration-200`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaTimes className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* Mobile User Profile */}
                            {isProfileLoading ? (
                                <div className="flex justify-center px-6 py-6">
                                    <span className="loading loading-spinner text-primary"></span>
                                </div>
                            ) : userProfile && (
                                <div className={`px-6 py-6 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                                    <div className={`${isDark ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60' : 'bg-gradient-to-br from-white/60 to-gray-100/60'} backdrop-blur-sm rounded-2xl p-4 border ${isDark ? 'border-white/20' : 'border-pink-200/30'} shadow-md overflow-hidden`}>
                                        <div className="flex items-center">
                                            <div className="avatar flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-xl ring-2 ${isDark ? 'ring-indigo-400/30' : 'ring-pink-400/30'} ring-offset-2 ring-offset-base-100`}>
                                                    <img src={userProfile.image} alt={userProfile.name} className="object-cover rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="ml-3 flex-1 min-w-0">
                                                <h3 className={`font-semibold text-sm ${isDark ? 'text-gray-100' : 'text-gray-600'} truncate`}>{userProfile.name}</h3>
                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>{userProfile.email}</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2">
                                                <ThemeToggle />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Navigation - Scrollable */}
                            <div className="flex-1 px-6 py-4 overflow-y-auto overflow-x-hidden">
                                <ul className="space-y-2 w-full">
                                    {isAdmin && adminLinks}
                                    {isContributor && contributorLinks}
                                    {isMember && memberLinks}
                                    
                                    <div className="divider my-6"></div>
                                    
                                    <div className="space-y-1">
                                        <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                            Account
                                        </div>
                                        <li><NavLink to="/dashboard/profile" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                                            <ImProfile className="w-5 h-5 mr-3 flex-shrink-0" /> Profile
                                        </NavLink></li>
                                        <li><NavLink to="/dashboard/settings" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                                            <FiSettings className="w-5 h-5 mr-3 flex-shrink-0" /> Settings
                                        </NavLink></li>
                                        <li><NavLink to="/" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                                            <FaArrowCircleLeft className="w-5 h-5 mr-3 flex-shrink-0" /> Back to Home
                                        </NavLink></li>
                                    </div>
                                </ul>
                            </div>

                            {/* Mobile Footer */}
                            <div className={`px-6 py-4 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                                <motion.button 
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-500/10'} transition-all duration-300 group hover:shadow-md truncate`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="font-medium truncate">Sign Out</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// Main Dashboard Layout Component
const DashboardLayout = () => {
    const { loading } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isDark = theme === 'dark';

    // Sync theme with localStorage and data-theme
    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-100'} transition-all duration-300`}>
            {/* Enhanced Mobile Header */}
            <motion.div
                className={`lg:hidden fixed top-0 left-0 right-0 z-30 ${isDark ? 'bg-gray-900/90 border-white/20' : 'bg-white/90 border-pink-200/50'} backdrop-blur-2xl shadow-xl border-b`}
                animate={{ y: 0, opacity: 1 }}
                initial={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                                <FaBrain className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3">
                                <h1 className={`text-lg font-bold ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} bg-clip-text text-transparent truncate`}>
                                    Dashboard
                                </h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <Link 
                                to="/" 
                                className={`hidden sm:flex items-center px-3 py-2 rounded-xl text-sm font-medium ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-white/20' : 'text-gray-600 hover:text-pink-500 hover:bg-white/10'} transition-all duration-200 hover:shadow-sm truncate`}
                            >
                                <FaArrowCircleLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                                Home
                            </Link>
                            
                            <motion.button
                                className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/20' : 'hover:bg-white/10'} transition-colors duration-200`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaBars className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sidebar Component */}
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Enhanced Main Content Area */}
            <motion.main
 className="flex-1 lg:ml-0 mt-20 lg:mt-0 overflow-x-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* Desktop Header */}
                <div className={`hidden lg:flex items-center justify-between px-8 py-6 ${isDark ? 'bg-gray-900/60 border-white/20' : 'bg-white/60 border-pink-200/50'} backdrop-blur-xl border-b shadow-sm`}>
                    <div>
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-600'} truncate`}>Dashboard</h1>
                        <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1 truncate`}>Welcome back! Here's your overview.</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link 
                            to="/" 
                            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium ${isDark ? 'text-gray-300 hover:text-indigo-400 hover:bg-white/20' : 'text-gray-600 hover:text-pink-500 hover:bg-white/10'} transition-all duration-300 hover:scale-105 hover:shadow-sm truncate`}
                        >
                            <FaArrowCircleLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 lg:p-8">
                    <div className={`min-h-[calc(100vh-12rem)] ${isDark ? 'bg-gray-900/40 border-white/20' : 'bg-white/40 border-pink-200/30'} backdrop-blur-sm rounded-3xl border shadow-2xl p-6 overflow-x-hidden`}>
                        <Outlet />
                    </div>
                </div>
            </motion.main>
        </div>
    );
};

export default DashboardLayout;