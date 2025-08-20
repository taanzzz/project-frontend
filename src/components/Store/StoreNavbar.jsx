import React, { useState, useEffect } from 'react';
// ✅ Using 'react-router-dom' for modern React projects
import { NavLink, Link } from 'react-router'; 
import { FaSearch, FaShoppingCart, FaHome, FaBookOpen, FaTshirt, FaPenFancy, FaArrowCircleLeft, FaShoppingBag } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import UserProfile from '../Shared/UserProfile';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../Shared/ThemeToggle';
import { useCart } from '../../Providers/CartProvider';
import { motion, AnimatePresence } from 'framer-motion';

const StoreNavbar = () => {
    const { user } = useAuth();
    const { totalItems } = useCart();
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

    // ✅ Enhanced NavLink classes with premium styling
    const navLinkClass = ({ isActive }) =>
        `p-4 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 transform hover:scale-110 backdrop-blur-md
         ${isActive
            ? isDark 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40'
                : 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/40'
            : isDark
                ? 'bg-white/10 text-gray-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-500 hover:text-white border border-white/20'
                : 'bg-white/60 text-gray-600 hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 hover:text-white border border-pink-200/50'}`;

    // ✅ Special styling for the back button to make it more prominent
    const backButtonClass = ({ isActive }) =>
        `p-4 rounded-2xl text-sm font-medium tracking-wide transition-all duration-300 transform hover:scale-110 backdrop-blur-md relative overflow-hidden group
         ${isActive
            ? isDark 
                ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/40'
                : 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/40'
            : isDark
                ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 text-red-400 hover:bg-gradient-to-br hover:from-red-500 hover:to-orange-500 hover:text-white border border-red-400/30 shadow-red-500/20'
                : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-600 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 hover:text-white border border-orange-300/50 shadow-orange-500/20'} shadow-lg`;

    const navLinks = (
        <>
            <NavLink to="/store" end className={navLinkClass}>
                <FaHome size={22} />
            </NavLink>
            <NavLink to="/store/books" className={navLinkClass}>
                <FaBookOpen size={22} />
            </NavLink>
            <NavLink to="/store/affiliates" className={navLinkClass}>
                <FaTshirt size={22} />
            </NavLink>
            <NavLink to="/store/stationery" className={navLinkClass}>
                <FaPenFancy size={22} />
            </NavLink>
            <NavLink to="/store/bag" className={navLinkClass}>
                <FaShoppingBag size={22} />
            </NavLink>
            {/* Enhanced Back Button with special styling and tooltip */}
            <div className="relative group">
                <NavLink to="/" className={backButtonClass}>
                    <motion.div
                        className="relative z-10"
                        whileHover={{ rotate: -15 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IoArrowBack size={22} />
                    </motion.div>
                    {/* Animated background pulse */}
                    <motion.div
                        className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-br from-red-400/30 to-orange-400/30' : 'bg-gradient-to-br from-orange-400/30 to-red-400/30'} opacity-0 group-hover:opacity-100`}
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </NavLink>
                {/* Tooltip */}
                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${isDark ? 'bg-gray-800 text-gray-200 border-white/20' : 'bg-white text-gray-700 border-gray-200'} px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md border whitespace-nowrap shadow-lg z-20`}>
                    Back to Main Site
                    <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 ${isDark ? 'bg-gray-800' : 'bg-white'} border-r border-b ${isDark ? 'border-white/20' : 'border-gray-200'} rotate-45 -mt-1`}></div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-[100] ${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-white/10' : 'border-pink-200/50'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-0 left-1/4 w-96 h-24 ${isDark ? 'bg-indigo-500/10' : 'bg-pink-400/10'} rounded-full blur-3xl`} />
                    <div className={`absolute top-0 right-1/4 w-96 h-24 ${isDark ? 'bg-purple-500/10' : 'bg-rose-400/10'} rounded-full blur-3xl`} />
                </div>

                <div className="navbar max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-20 relative z-10">
                    <div className="navbar-start">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link
                                to="/store"
                                className="flex flex-nowrap items-center gap-3 text-lg sm:text-xl lg:text-2xl font-extrabold transition-all duration-300 whitespace-nowrap"
                            >
                                <img
                                    src="https://i.ibb.co/R4Sct8y4/book.png"
                                    alt="Mind Over Myth Store Logo"
                                    className="w-8 h-8 shrink-0"
                                />
                                <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                                    Mind Over Myth Store
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-3">
                            {navLinks}
                        </ul>
                    </div>
                    <div className="navbar-end gap-2 sm:gap-4">
                        <AnimatePresence>
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className={`h-10 rounded-full shadow-lg hidden sm:flex items-center backdrop-blur-md ${isDark ? 'bg-white/10 border border-white/20' : 'bg-white/80 border border-pink-200/50'}`}
                            >
                                <FaSearch size={18} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-3`} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className={`w-32 h-full bg-transparent outline-none ml-2 placeholder:${isDark ? 'text-gray-500' : 'text-gray-400'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                />
                            </motion.div>
                        </AnimatePresence>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                                to="/store/cart" 
                                className={`btn btn-circle border-none transition-all duration-300 ${isDark ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-white/60 hover:bg-white/80 text-gray-600'} backdrop-blur-md shadow-lg`}
                            >
                                <div className="indicator">
                                    <FaShoppingCart size={20} />
                                    {totalItems > 0 && (
                                        <motion.span 
                                            className={`badge badge-sm indicator-item text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                        
                        <ThemeToggle />
                        {user ? (
                            <UserProfile />
                        ) : (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/login" 
                                    className={`btn btn-sm text-white border-none shadow-lg rounded-2xl px-6 transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}`}
                                >
                                    Login
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Enhanced Mobile bottom navigation */}
            <motion.div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] block sm:hidden ${isDark ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-xl shadow-lg border-t ${isDark ? 'border-white/10' : 'border-pink-200/50'}`}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute bottom-0 left-1/4 w-48 h-16 ${isDark ? 'bg-indigo-500/10' : 'bg-pink-400/10'} rounded-full blur-2xl`} />
                    <div className={`absolute bottom-0 right-1/4 w-48 h-16 ${isDark ? 'bg-purple-500/10' : 'bg-rose-400/10'} rounded-full blur-2xl`} />
                </div>
                
                <ul className="flex justify-around items-center p-3 relative z-10">
                    {navLinks}
                </ul>
            </motion.div>
        </>
    );
};

export default StoreNavbar;