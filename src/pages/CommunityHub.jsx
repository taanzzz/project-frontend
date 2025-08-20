// 📁 File: src/pages/CommunityHub.jsx

import React, { useState, useEffect } from 'react';
import CreatePost from '../components/Community/CreatePost';
import NewsFeed from '../components/Community/NewsFeed';
import LeftSidebar from '../components/Community/LeftSidebar';
import RightSidebar from '../components/Community/RightSidebar';
import { FiMenu, FiUsers } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

const CommunityHub = () => {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
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

    return (
        <div className={`relative overflow-hidden min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 w-80 h-80 ${isDark ? 'bg-violet-500/15' : 'bg-orange-400/10'} rounded-full blur-3xl animate-pulse delay-500`} />
            </div>

            {/* Mobile Header */}
            <motion.header 
                className={`sticky z-10 flex items-center justify-between p-4 ${isDark ? 'bg-gray-900/80 border-white/10' : 'bg-white/80 border-pink-200/30'} backdrop-blur-md lg:hidden shadow-lg border-b`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.button 
                    onClick={() => setIsLeftSidebarOpen(true)} 
                    className={`btn btn-circle border-none ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-pink-100/80 text-gray-600 hover:bg-pink-200/80'} backdrop-blur-md transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiMenu className="text-xl" />
                </motion.button>
                
                <motion.h1 
                    className={`text-2xl font-bold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                >
                    Community Hub
                </motion.h1>
                
                <motion.button 
                    onClick={() => setIsRightSidebarOpen(true)} 
                    className={`btn btn-circle border-none ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-pink-100/80 text-gray-600 hover:bg-pink-200/80'} backdrop-blur-md transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiUsers className="text-xl" />
                </motion.button>
            </motion.header>

            <motion.div 
                className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Left Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <LeftSidebar isDark={isDark} />
                    </aside>
                    
                    {/* Left Sidebar - Mobile Drawer */}
                    <AnimatePresence>
                        {isLeftSidebarOpen && (
                            <div className="fixed inset-0 z-50 lg:hidden">
                                <motion.div 
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                                    onClick={() => setIsLeftSidebarOpen(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.div 
                                    className={`relative w-80 h-full ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-2xl border-r ${isDark ? 'border-white/10' : 'border-pink-200/50'}`}
                                    initial={{ x: -320 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: -320 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    <LeftSidebar isDark={isDark} onClose={() => setIsLeftSidebarOpen(false)} />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <motion.main 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <CreatePost isDark={isDark} />
                        <NewsFeed isDark={isDark} />
                    </motion.main>

                    {/* Right Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <RightSidebar isDark={isDark} />
                    </aside>
                    
                    {/* Right Sidebar - Mobile Drawer */}
                    <AnimatePresence>
                        {isRightSidebarOpen && (
                            <div className="fixed inset-0 z-50 lg:hidden">
                                <motion.div 
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                                    onClick={() => setIsRightSidebarOpen(false)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.div 
                                    className={`relative w-80 h-full ${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl shadow-2xl border-l ${isDark ? 'border-white/10' : 'border-pink-200/50'} ml-auto`}
                                    initial={{ x: 320 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: 320 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    <RightSidebar isDark={isDark} onClose={() => setIsRightSidebarOpen(false)} />
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default CommunityHub;