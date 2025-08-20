import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
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

    // Size variants for responsiveness
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-32 h-32',
        xl: 'w-48 h-48',
    };

    return (
        <div className={`${fullScreen ? 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50' : 'flex items-center justify-center'} ${size === 'md' && !fullScreen ? 'min-h-[200px]' : ''}`}>
            <motion.div
                className={`relative ${sizeClasses[size] || sizeClasses.md}`}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Outer pulsing orb */}
                <motion.div
                    className={`absolute inset-0 rounded-full blur-xl ${isDark ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30' : 'bg-gradient-to-br from-pink-500/30 to-rose-500/30'} animate-pulse`}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Inner spinner ring */}
                <motion.div
                    className={`absolute inset-1 rounded-full border-4 ${isDark ? 'border-indigo-400/50' : 'border-pink-400/50'} border-dashed`}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                {/* Central book icon */}
                <motion.div
                    className={`absolute inset-0 flex items-center justify-center text-4xl ${isDark ? 'text-indigo-300' : 'text-pink-500'}`}
                    animate={{
                        rotateY: [0, 180, 360],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    📖
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;