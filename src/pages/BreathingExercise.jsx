// 📁 File: src/pages/BreathingExercise.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

const BreathingExercise = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('Get Ready...');
    const [counter, setCounter] = useState(3); // Start countdown from 3
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

    const { data: exercise, isLoading } = useQuery({
        queryKey: ['breathing-exercise', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/mindfulness/${id}`);
            return data;
        }
    });

    useEffect(() => {
        if (!exercise) return;

        const { inhale, hold, exhale } = exercise.breathingPattern;
        const totalCycleTime = inhale + hold + exhale;
        let timer;
        
        const startCountdown = () => {
            let count = 3;
            setStatus('Get Ready...');
            setCounter(count);
            timer = setInterval(() => {
                count--;
                setCounter(count);
                if (count <= 0) {
                    clearInterval(timer);
                    startBreathingCycle();
                }
            }, 1000);
        };
        
        const startBreathingCycle = () => {
            const cycle = () => {
                setStatus('Inhale');
                setTimeout(() => setStatus('Hold'), inhale * 1000);
                setTimeout(() => setStatus('Exhale'), (inhale + hold) * 1000);
            };
            cycle(); // Start the first cycle immediately
            timer = setInterval(cycle, totalCycleTime * 1000);
        };
        
        startCountdown();

        return () => clearInterval(timer);
    }, [exercise]);

    if (isLoading) return <LoadingSpinner />;
    if (!exercise) return (
        <div className={`text-center py-20 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Exercise not found.
        </div>
    );
    
    const { inhale, hold, exhale } = exercise.breathingPattern;

    return (
        <div className={`relative w-full h-screen overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50'}`}>
            {/* Enhanced Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 left-1/6 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-1/4 right-1/6 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isDark ? 'bg-blue-500/10' : 'bg-orange-300/10'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            {/* Glass Background Layer */}
            <div className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-white/30'} backdrop-blur-sm`} />
            
            {/* Back Button */}
            <motion.div
                className="absolute top-6 left-6 z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <Link 
                    to="/mindfulness" 
                    className={`btn btn-circle border-none ${isDark ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/80 hover:bg-white/90 text-gray-600'} backdrop-blur-md shadow-lg transition-all duration-300`}
                >
                    <IoArrowBack className="text-2xl" />
                </Link>
            </motion.div>

            {/* Main Content */}
            <motion.div
                className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                {/* Animated Circle Visualizer */}
                <motion.div
                    className="relative w-80 h-80 flex items-center justify-center mb-12"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                >
                    {/* Outer Ring */}
                    <motion.div
                        className={`absolute w-full h-full rounded-full ${isDark ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20' : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-300/30'} backdrop-blur-md shadow-2xl`}
                        animate={{ 
                            scale: [1, 1.08, 1], 
                            rotate: [0, 360]
                        }}
                        transition={{ 
                            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    
                    {/* Middle Ring */}
                    <motion.div
                        className={`absolute w-3/4 h-3/4 rounded-full ${isDark ? 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30' : 'bg-gradient-to-r from-rose-400/30 to-pink-400/30'} backdrop-blur-sm`}
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, -360]
                        }}
                        transition={{ 
                            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 45, repeat: Infinity, ease: "linear" }
                        }}
                    />
                    
                    {/* Inner Breathing Circle */}
                    <motion.div
                        className={`absolute w-1/2 h-1/2 rounded-full shadow-2xl ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-400 to-rose-400'}`}
                        animate={{
                            scale: status === 'Inhale' ? 1.8 : (status === 'Hold' ? 1.8 : 1),
                            opacity: status === 'Inhale' ? 1 : (status === 'Hold' ? 0.9 : 0.7)
                        }}
                        transition={{ duration: status === 'Inhale' ? inhale : exhale, ease: "easeInOut" }}
                    />
                    
                    {/* Central Text */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={status.startsWith('Get Ready') ? counter : status}
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <p className={`text-7xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-gray-700'} text-shadow-lg`}>
                                    {status.startsWith('Get Ready') ? counter : status}
                                </p>
                                {!status.startsWith('Get Ready') && (
                                    <motion.div
                                        className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {status === 'Inhale' && '• Breathe in slowly •'}
                                        {status === 'Hold' && '• Hold your breath •'}
                                        {status === 'Exhale' && '• Breathe out gently •'}
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Exercise Info Card */}
                <motion.div
                    className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-md w-full`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                >
                    <motion.h1
                        className={`text-3xl font-bold mb-4 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    >
                        {exercise.title}
                    </motion.h1>
                    
                    <motion.p
                        className={`mb-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Follow the breathing pattern and let yourself relax.
                    </motion.p>
                    
                    <motion.div
                        className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-pink-200/40'} backdrop-blur-sm rounded-2xl p-4 border`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.9 }}
                    >
                        <p className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            Breathing Pattern
                        </p>
                        <div className={`flex justify-between items-center text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}>{inhale}s</div>
                                <div className="text-xs opacity-75">Inhale</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-rose-500'}`}>{hold}s</div>
                                <div className="text-xs opacity-75">Hold</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-orange-500'}`}>{exhale}s</div>
                                <div className="text-xs opacity-75">Exhale</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BreathingExercise;