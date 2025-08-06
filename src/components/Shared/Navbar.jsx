import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../contexts/AuthProvider';
import ThemeToggle from './ThemeToggle';
import UserProfile from './UserProfile';
import { FaBrain, FaSearch, FaHome, FaBook, FaUsers, FaSpa } from 'react-icons/fa';
import { FaStore } from 'react-icons/fa6';

const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = ({ isActive }) =>
        `p-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300
         ${isActive
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
            : 'hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white'}`;

    const navLinks = (
        <>
            <NavLink to="/" className={navLinkClass}>
                <FaHome size={20} />
            </NavLink>
            <NavLink to="/library" className={navLinkClass}>
                <FaBook size={20} />
            </NavLink>
            {user && (
                <>
                    <NavLink to="/community-hub" className={navLinkClass}>
                        <FaUsers size={20} />
                    </NavLink>
                    <NavLink to="/mindfulness-zone" className={navLinkClass}>
                        <FaSpa size={20} />
                    </NavLink>
                    <NavLink to="/store" className={navLinkClass}>
                        <FaStore size={20} />
                    </NavLink>
                </>
            )}
        </>
    );

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-[100]"
                animate={{
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                    boxShadow: isScrolled ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
                <div className="navbar max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20">
                    {/* Logo */}
                    <div className="navbar-start">
                        <NavLink
                            to="/"
                            className="flex items-center gap-2 sm:gap-3 flex-wrap text-lg sm:text-xl lg:text-2xl font-extrabold"
                        >
                            <FaBrain className="text-primary shrink-0" />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap">
                                Mind Over Myth
                            </span>
                        </NavLink>
                    </div>

                    {/* Desktop Nav */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-10">
                            {navLinks}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="navbar-end gap-2">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.input
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "12rem", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    type="text"
                                    placeholder="Search..."
                                    className="input input-sm input-bordered h-10 hidden sm:block"
                                />
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="btn btn-ghost btn-circle"
                        >
                            <FaSearch size={18} />
                        </button>

                        <ThemeToggle />

                        {user ? (
                            <UserProfile />
                        ) : (
                            <div className="hidden sm:flex gap-2">
                                <NavLink to="/login" className="btn btn-sm btn-ghost">Login</NavLink>
                                <NavLink
                                    to="/register"
                                    className="btn btn-sm text-white border-none bg-gradient-to-r from-primary to-secondary hover:brightness-110"
                                >
                                    Register
                                </NavLink>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        
                    </div>
                </div>
            </motion.header>

            {/* Mobile bottom navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-md shadow-md z-[100] block sm:hidden">
                <ul className="flex justify-around items-center p-2">
                    {navLinks}
                    {!user && (
                        <>
                            <NavLink to="/login" className={navLinkClass}>
                                <FaHome size={20} />
                            </NavLink>
                            <NavLink to="/register" className={navLinkClass}>
                                <FaBook size={20} />
                            </NavLink>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Navbar;