// 📁 File: src/pages/Dashboard/Common/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useUserProfile from '../../../hooks/useUserProfile';
import { FaEnvelope, FaUserShield, FaLanguage, FaPaintBrush, FaBell, FaUser, FaCrown } from "react-icons/fa";
import { motion } from 'framer-motion';

const Profile = () => {
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

    // ✅ useUserProfile হুক দিয়ে ডাটাবেস থেকে সর্বশেষ প্রোফাইল তথ্য আনা হচ্ছে
    const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();

    // ✅ /api/settings থেকে ব্যবহারকারীর সেটিংসের তথ্য আনা হচ্ছে
    const { data: settings, isLoading: areSettingsLoading } = useQuery({
        queryKey: ['user-settings', userProfile?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/settings');
            return data;
        },
        enabled: !!userProfile?.email, // প্রোফাইল লোড হওয়ার পরেই শুধু এই API কল হবে
    });

    if (isProfileLoading || areSettingsLoading) return <LoadingSpinner />;
    if (!userProfile || !settings) {
        return (
            <div className={`text-center py-20 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Could not load profile information.
            </div>
        );
    }
    
    const { name, email, image, role } = userProfile;

    return (
        <div className={`relative overflow-hidden min-h-screen ${
            isDark 
                ? 'bg-gradient-to-b from-gray-900 to-indigo-950' 
                : 'bg-gradient-to-b from-pink-50 to-rose-50'
        }`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${
                    isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'
                } rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${
                    isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'
                } rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
                {/* Cinematic Hero Section */}
                <motion.div
                    className="relative h-80 md:h-96 rounded-b-3xl overflow-hidden shadow-2xl mb-32"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <img
                        src={image}
                        alt="Profile background"
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.3] blur-2xl scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center space-y-4 p-4">
                        <motion.div
                            className="avatar shadow-2xl"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        >
                            <div className={`w-36 md:w-40 rounded-full ring-4 ring-offset-4 ${
                                isDark 
                                    ? 'ring-indigo-400/70 ring-offset-gray-900' 
                                    : 'ring-pink-400/70 ring-offset-white'
                            }`}>
                                <img src={image} alt={name} />
                            </div>
                        </motion.div>
                        
                        <motion.h1
                            className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                                    : 'bg-gradient-to-r from-pink-500 to-rose-500'
                            } text-shadow-lg`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                        >
                            {name}
                        </motion.h1>
                        
                        <motion.div
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-none text-white ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80' 
                                    : 'bg-gradient-to-r from-pink-500/80 to-rose-500/80'
                            } backdrop-blur-md`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                        >
                            {role === 'Admin' ? <FaCrown className="text-yellow-300" /> : <FaUser />}
                            <span className="font-semibold tracking-wide">{role}</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Profile Details Section */}
                <motion.div
                    className={`p-8 md:p-10 rounded-3xl shadow-lg border transition-all duration-300 ${
                        isDark 
                            ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-indigo-900/20' 
                            : 'bg-white/80 border-pink-200/50 backdrop-blur-md shadow-pink-200/30'
                    }`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                >
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <h2 className={`text-3xl font-bold tracking-wide bg-clip-text text-transparent ${
                            isDark 
                                ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                                : 'bg-gradient-to-r from-pink-500 to-rose-500'
                        }`}>
                            Profile Details
                        </h2>
                    </div>
                    
                    <div className={`divider ${isDark ? 'border-white/20' : 'border-pink-200/50'} mb-8`}></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
                        >
                            <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'
                            }`}>
                                <div className={`p-3 rounded-full ${
                                    isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-100 text-pink-600'
                                }`}>
                                    <FaEnvelope className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Email Address
                                    </p>
                                    <p className={`font-semibold text-lg ${
                                        isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                        {email}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'
                            }`}>
                                <div className={`p-3 rounded-full ${
                                    isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-100 text-rose-600'
                                }`}>
                                    <FaUserShield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Profile Privacy
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-semibold text-lg capitalize ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            {settings.privacy}
                                        </p>
                                        <div className={`badge border-none text-white text-xs ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                                : 'bg-gradient-to-r from-rose-500 to-pink-500'
                                        }`}>
                                            {settings.privacy === 'public' ? 'Public' : 'Private'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Preferences */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
                        >
                            <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'
                            }`}>
                                <div className={`p-3 rounded-full ${
                                    isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-100 text-pink-600'
                                }`}>
                                    <FaPaintBrush className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Theme Preference
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-semibold text-lg capitalize ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            {settings.theme}
                                        </p>
                                        <div className={`badge border-none text-white text-xs ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                                : 'bg-gradient-to-r from-pink-500 to-rose-500'
                                        }`}>
                                            {settings.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'
                            }`}>
                                <div className={`p-3 rounded-full ${
                                    isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-100 text-rose-600'
                                }`}>
                                    <FaLanguage className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Language
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-semibold text-lg ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        }`}>
                                            {settings.language === 'bn' ? 'Bengali' : 'English'}
                                        </p>
                                        <div className={`badge border-none text-white text-xs ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                                                : 'bg-gradient-to-r from-rose-500 to-pink-500'
                                        }`}>
                                            {settings.language === 'bn' ? '🇧🇩 BN' : '🇺🇸 EN'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className={`divider ${isDark ? 'border-white/20' : 'border-pink-200/50'} my-8`}></div>

                    {/* Notifications */}
                    <motion.div
                        className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
                            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/50 hover:bg-white/70'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
                    >
                        <div className={`p-3 rounded-full ${
                            isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-100 text-pink-600'
                        }`}>
                            <FaBell className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                            <p className={`text-sm font-medium mb-3 ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                Notification Preferences
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {settings.notifications.email && (
                                    <motion.span
                                        className={`badge border-none text-white px-4 py-2 ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        }`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 1.0 }}
                                    >
                                        📧 Email
                                    </motion.span>
                                )}
                                {settings.notifications.push && (
                                    <motion.span
                                        className={`badge border-none text-white px-4 py-2 ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                        }`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 1.1 }}
                                    >
                                        🔔 Push
                                    </motion.span>
                                )}
                                {settings.notifications.sms && (
                                    <motion.span
                                        className={`badge border-none text-white px-4 py-2 ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-purple-500 to-violet-500' 
                                                : 'bg-gradient-to-r from-purple-500 to-violet-500'
                                        }`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 1.2 }}
                                    >
                                        📱 SMS
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;