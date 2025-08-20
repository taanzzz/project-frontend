import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthProvider';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import { 
    FaSignInAlt, 
    FaUserPlus, 
    FaHome, 
    FaBook, 
    FaUsers, 
    FaBrain, 
    FaStore,
    FaSearch
} from 'react-icons/fa';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

    // Handle scroll for header background
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDark = theme === 'dark';
    const navLinkClass = ({ isActive }) =>
        `flex flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 min-w-0 ${
            isActive
                ? isDark
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white shadow-lg shadow-indigo-500/30 scale-105'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                : isDark
                    ? 'hover:bg-gradient-to-r hover:from-indigo-400 hover:to-purple-400 hover:text-white text-gray-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
                    : 'hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 hover:text-white text-gray-600 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105'
        }`;

    const navLinks = (
        <>
            <NavLink to="/" className={navLinkClass}>
                <motion.div 
                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1"
                >
                    <FaHome className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                        isDark ? 'text-current' : 'text-current'
                    } drop-shadow-sm`} />
                </motion.div>
                <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${
                    isDark ? 'text-current' : 'text-current'
                } drop-shadow-sm truncate max-w-full`}>
                    Home
                </span>
            </NavLink>

            <NavLink to="/library" className={navLinkClass}>
                <motion.div 
                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1"
                >
                    <FaBook className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                        isDark ? 'text-current' : 'text-current'
                    } drop-shadow-sm`} />
                </motion.div>
                <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${
                    isDark ? 'text-current' : 'text-current'
                } drop-shadow-sm truncate max-w-full`}>
                    Library
                </span>
            </NavLink>

            <NavLink to="/community-hub" className={navLinkClass}>
                <motion.div 
                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1"
                >
                    <FaUsers className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                        isDark ? 'text-current' : 'text-current'
                    } drop-shadow-sm`} />
                </motion.div>
                <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${
                    isDark ? 'text-current' : 'text-current'
                } drop-shadow-sm truncate max-w-full`}>
                    Community
                </span>
            </NavLink>

            <NavLink to="/mindfulness-zone" className={navLinkClass}>
                <motion.div 
                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1"
                >
                    <FaBrain className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                        isDark ? 'text-current' : 'text-current'
                    } drop-shadow-sm`} />
                </motion.div>
                <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${
                    isDark ? 'text-current' : 'text-current'
                } drop-shadow-sm truncate max-w-full`}>
                    Mindfulness
                </span>
            </NavLink>

            <NavLink to="/store" className={navLinkClass}>
                <motion.div 
                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-1"
                >
                    <FaStore className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                        isDark ? 'text-current' : 'text-current'
                    } drop-shadow-sm`} />
                </motion.div>
                <span className={`text-xs sm:text-sm font-semibold leading-tight text-center ${
                    isDark ? 'text-current' : 'text-current'
                } drop-shadow-sm truncate max-w-full`}>
                    Store
                </span>
            </NavLink>
        </>
    );

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-[100] ${
                    isDark ? 'bg-gray-900/80' : 'bg-white/80'
                } backdrop-blur-xl ${isScrolled ? 'rounded-b-2xl shadow-2xl' : ''} border-b border-opacity-20 ${
                    isDark ? 'border-indigo-500' : 'border-pink-300'
                }`}
                animate={{
                    backgroundColor: isScrolled
                        ? isDark
                            ? 'rgba(17, 24, 39, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)'
                        : isDark
                            ? 'rgba(17, 24, 39, 0.8)'
                            : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isScrolled
                        ? isDark
                            ? '0 8px 32px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.1)'
                            : '0 8px 32px rgba(244, 114, 182, 0.2), 0 0 0 1px rgba(244, 114, 182, 0.1)'
                        : 'none',
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div className="navbar max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 lg:h-20">
                    {/* Logo */}
                    <div className="navbar-start">
                        <NavLink
                            to="/"
                            className="flex items-center gap-2 sm:gap-3 flex-nowrap text-base sm:text-lg lg:text-2xl font-black"
                        >
                            <motion.div
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${
                                    isDark 
                                        ? 'from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30' 
                                        : 'from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30'
                                } flex-shrink-0`}
                            >
                                <FaBrain className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white drop-shadow-md`} />
                            </motion.div>
                            <motion.span
                                className={`relative bg-clip-text text-transparent whitespace-nowrap font-black bg-gradient-to-r ${
                                    isDark ? 'from-indigo-400 via-purple-400 to-pink-400' : 'from-pink-600 via-rose-600 to-orange-500'
                                } ${
                                    !isDark
                                        ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-pink-500 after:to-rose-500 after:opacity-60 after:blur-[1px]'
                                        : 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:opacity-60 after:blur-[1px]'
                                } ${
                                    user ? 'inline-block' : 'hidden sm:inline-block'
                                } drop-shadow-sm`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                Mind Over Myth
                            </motion.span>
                        </NavLink>
                    </div>

                    {/* Desktop Nav */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-6">{navLinks}</ul>
                    </div>

                    {/* Actions */}
                    <div className="navbar-end gap-1 sm:gap-2">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.input
                                    initial={{ width: 0, opacity: 0, scale: 0.8 }}
                                    animate={{ width: '10rem', opacity: 1, scale: 1 }}
                                    exit={{ width: 0, opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    type="text"
                                    placeholder="Search..."
                                    className={`input input-sm input-bordered h-8 sm:h-10 rounded-xl text-xs sm:text-sm ${
                                        isDark
                                            ? 'bg-gray-800/60 text-gray-200 border-indigo-400/30 placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-400/20'
                                            : 'bg-white/60 text-gray-700 border-pink-300/50 placeholder-gray-500 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 focus:shadow-lg focus:shadow-pink-400/20'
                                    } transition-all duration-300 focus:outline-none backdrop-blur-sm`}
                                />
                            )}
                        </AnimatePresence>
                        
                        <motion.button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`btn btn-ghost btn-circle btn-sm sm:btn-md ${
                                isDark
                                    ? 'text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20'
                                    : 'text-gray-600 hover:bg-pink-400/20 hover:text-pink-600 hover:shadow-lg hover:shadow-pink-400/20'
                            } rounded-xl border border-opacity-20 ${
                                isDark ? 'border-indigo-500 hover:border-indigo-400' : 'border-pink-300 hover:border-pink-400'
                            } transition-all duration-300`}
                        >
                            <FaSearch className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.button>

                        <ThemeToggle />

                        {user ? (
                            <UserProfile />
                        ) : (
                            <div className="flex gap-1 sm:gap-2">
                                <NavLink
                                    to="/login"
                                    className={`btn btn-xs sm:btn-sm text-white border-none bg-gradient-to-r rounded-xl font-semibold transition-all duration-300 ${
                                        isDark
                                            ? 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105'
                                            : 'from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105'
                                    }`}
                                >
                                    <FaSignInAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    <span className="hidden sm:inline">Login</span>
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={`btn btn-xs sm:btn-sm text-white border-none bg-gradient-to-r rounded-xl font-semibold transition-all duration-300 ${
                                        isDark
                                            ? 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105'
                                            : 'from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-105'
                                    }`}
                                >
                                    <FaUserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    <span className="hidden sm:inline">Register</span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* Mobile bottom navigation */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`lg:hidden fixed bottom-0 left-0 right-0 ${
                    isDark
                        ? 'bg-gradient-to-t from-gray-900/95 to-gray-800/90 border-t border-indigo-500/20 shadow-[0_-8px_32px_rgba(99,102,241,0.2)]'
                        : 'bg-gradient-to-t from-white/95 to-gray-50/90 border-t border-pink-300/30 shadow-[0_-8px_32px_rgba(244,114,182,0.2)]'
                } backdrop-blur-xl rounded-t-3xl z-[100] safe-area-bottom`}
            >
                <ul className="flex justify-around items-center px-2 py-2 sm:py-3 gap-1">
                    {!user ? (
                        <>
                            {/* Home */}
                            <NavLink to="/" className={navLinkClass}>
                                <motion.div 
                                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mb-1"
                                >
                                    <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-current drop-shadow-sm" />
                                </motion.div>
                                <span className="text-xs sm:text-sm font-semibold leading-tight text-center text-current drop-shadow-sm truncate max-w-full">
                                    Home
                                </span>
                            </NavLink>

                            {/* Library */}
                            <NavLink to="/library" className={navLinkClass}>
                                <motion.div 
                                    whileHover={{ scale: 1.2, rotateY: 15 }} 
                                    whileTap={{ scale: 0.9 }}
                                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 mb-1"
                                >
                                    <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-current drop-shadow-sm" />
                                </motion.div>
                                <span className="text-xs sm:text-sm font-semibold leading-tight text-center text-current drop-shadow-sm truncate max-w-full">
                                    Library
                                </span>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {/* Logged-in: Show all navLinks */}
                            {navLinks}
                        </>
                    )}
                </ul>
            </motion.div>
        </>
    );
};

export default Navbar;