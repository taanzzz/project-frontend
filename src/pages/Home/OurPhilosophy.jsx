import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaBrain, FaHeart, FaCompass } from 'react-icons/fa';
import { useMediaQuery } from '@react-hook/media-query';

const OurPhilosophy = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [imageLoaded, setImageLoaded] = useState(false);
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const philosophyPoints = [
        {
            icon: FaLightbulb,
            title: "Ancient Wisdom",
            description: "Timeless teachings from philosophical traditions across cultures"
        },
        {
            icon: FaBrain,
            title: "Modern Psychology",
            description: "Evidence-based approaches to mental wellness and growth"
        },
        {
            icon: FaHeart,
            title: "Self-Discovery",
            description: "Tools and guidance for your personal transformation journey"
        },
        {
            icon: FaCompass,
            title: "Life Purpose",
            description: "Building clarity and direction for a meaningful existence"
        }
    ];

    return (
        <div className={`relative py-16 sm:py-20 lg:py-24 overflow-hidden ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950' 
                : 'bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50'
        }`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Orbs */}
                {!isMobile && (
                    <>
                        <motion.div 
                            className={`absolute top-20 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 ${
                                isDark ? 'bg-indigo-500/15' : 'bg-pink-400/10'
                            } rounded-full blur-3xl`}
                            animate={{
                                scale: [1, 1.3, 1],
                                x: [0, 60, 0],
                                y: [0, -40, 0],
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className={`absolute bottom-20 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 ${
                                isDark ? 'bg-purple-500/15' : 'bg-rose-400/10'
                            } rounded-full blur-3xl`}
                            animate={{
                                scale: [1.3, 1, 1.3],
                                x: [0, -60, 0],
                                y: [0, 40, 0],
                            }}
                            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                        />
                    </>
                )}
                
                {/* Grid Pattern */}
                <div className={`absolute inset-0 opacity-3 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                }`} style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                    initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -50 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        initial={isMobile ? { scale: 0.95, opacity: 0 } : { scale: 0.8, opacity: 0 }}
                        whileInView={isMobile ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                        transition={isMobile ? { delay: 0.1, duration: 0.3 } : { delay: 0.2, duration: 0.6 }}
                        className="mb-6"
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
                            isDark 
                                ? 'from-indigo-400 via-purple-400 to-pink-400' 
                                : 'from-pink-600 via-rose-600 to-orange-500'
                        } drop-shadow-2xl leading-tight tracking-tight`}>
                            Our Philosophy
                        </h2>
                    </motion.div>
                    
                    <motion.p 
                        className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        } drop-shadow-sm`}
                        initial={isMobile ? { y: 10, opacity: 0 } : { y: 20, opacity: 0 }}
                        whileInView={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                        transition={isMobile ? { delay: 0.2, duration: 0.3 } : { delay: 0.4, duration: 0.6 }}
                    >
                        Bridging ancient wisdom with modern psychology for a transformative journey of self-discovery and personal growth.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
                    {/* Left Column: Premium Image */}
                    <motion.div
                        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl ${
                            isDark 
                                ? 'bg-white/5 border-white/10 shadow-2xl shadow-indigo-500/10' 
                                : 'bg-white/60 border-pink-200/30 shadow-2xl shadow-pink-500/10'
                        } border backdrop-blur-xl p-4 sm:p-6 lg:p-8 group`}
                        initial={isMobile ? { opacity: 0, x: -10, scale: 0.98 } : { opacity: 0, x: -50, scale: 0.95 }}
                        whileInView={isMobile ? { opacity: 1, x: 0, scale: 1 } : { opacity: 1, x: 0, scale: 1 }}
                        whileHover={isMobile ? {} : { scale: 1.02, y: -5 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                    >
                        {/* Loading Shimmer */}
                        {!imageLoaded && (
                            <div className={`absolute inset-4 sm:inset-6 lg:inset-8 ${
                                isDark ? 'bg-gray-700' : 'bg-gray-200'
                            } animate-pulse rounded-xl`}>
                                <div className={`absolute inset-0 bg-gradient-to-r ${
                                    isDark 
                                        ? 'from-transparent via-gray-600/50 to-transparent' 
                                        : 'from-transparent via-white/70 to-transparent'
                                } animate-shimmer`}></div>
                            </div>
                        )}
                        
                        {/* Main Image */}
                        <img
                            src="https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755163919/undraw_counting-stars_onv6_nhk7px.png"
                            alt="Philosophy Illustration - Counting Stars"
                            className={`w-full h-auto max-h-80 sm:max-h-96 lg:max-h-[400px] object-contain object-center transition-all duration-300 group-hover:scale-105 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isDark ? 'opacity-90 group-hover:opacity-100' : 'opacity-95 group-hover:opacity-100'} drop-shadow-lg`}
                            onLoad={() => setImageLoaded(true)}
                            loading="lazy"
                        />

                        {/* Glow Effect */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${
                            isDark 
                                ? 'from-indigo-500/5 to-purple-500/5' 
                                : 'from-pink-500/5 to-rose-500/5'
                        } transition-opacity duration-300 rounded-2xl sm:rounded-3xl`}></div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                            <motion.div
                                animate={isMobile ? {} : { rotate: 360 }}
                                transition={isMobile ? {} : { duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <FaBrain className={`w-6 h-6 ${isDark ? 'text-indigo-300' : 'text-pink-500'}`} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Column: Content */}
                    <motion.div
                        className="space-y-6 lg:space-y-8"
                        initial={isMobile ? { opacity: 0, x: 10 } : { opacity: 0, x: 50 }}
                        whileInView={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.1 } : { duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        {/* Mission Card */}
                        <motion.div
                            className={`${
                                isDark 
                                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                    : 'bg-white/60 border-pink-200/30 hover:bg-white/80'
                            } backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border shadow-xl transition-all duration-300 group`}
                            whileHover={isMobile ? {} : { scale: 1.02, y: -5 }}
                        >
                            <motion.h3 
                                className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-4 sm:mb-6 ${
                                    isDark 
                                        ? 'text-white drop-shadow-lg' 
                                        : 'bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent drop-shadow-sm'
                                } leading-tight`}
                                initial={isMobile ? { y: 10, opacity: 0 } : { y: 20, opacity: 0 }}
                                whileInView={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                                transition={isMobile ? { delay: 0.2 } : { delay: 0.3 }}
                            >
                                Our Mission
                            </motion.h3>
                            
                            <motion.div 
                                className="space-y-4 sm:space-y-6"
                                initial={isMobile ? { y: 10, opacity: 0 } : { y: 30, opacity: 0 }}
                                whileInView={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                                transition={isMobile ? { delay: 0.3 } : { delay: 0.4 }}
                            >
                                <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
                                    isDark ? 'text-gray-200' : 'text-gray-600'
                                } drop-shadow-sm`}>
                                    We bridge the gap between ancient wisdom and modern psychology. Our mission is to provide you with the tools to navigate the complexities of your mind, challenge your own myths, and build a life of clarity and purpose.
                                </p>
                                <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
                                    isDark ? 'text-gray-200' : 'text-gray-600'
                                } drop-shadow-sm`}>
                                    At Mind Over Myth, we believe that self-discovery is a lifelong journey, not a destination.
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Philosophy Points Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            initial={isMobile ? { y: 10, opacity: 0 } : { y: 50, opacity: 0 }}
                            whileInView={isMobile ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
                            transition={isMobile ? { delay: 0.4, duration: 0.3 } : { delay: 0.5, duration: 0.6 }}
                        >
                            {philosophyPoints.map((point, index) => (
                                <motion.div
                                    key={point.title}
                                    className={`${
                                        isDark 
                                            ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                                            : 'bg-white/50 border-pink-200/30 hover:bg-white/70'
                                    } backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 group/card`}
                                    initial={isMobile ? { scale: 0.95, opacity: 0 } : { scale: 0.8, opacity: 0 }}
                                    whileInView={isMobile ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
                                    whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
                                    transition={isMobile ? { delay: 0.4 + index * 0.05, duration: 0.2 } : { delay: 0.6 + index * 0.1, duration: 0.4 }}
                                >
                                    <motion.div 
                                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${
                                            isDark 
                                                ? 'bg-indigo-500/20 text-indigo-300' 
                                                : 'bg-pink-500/20 text-pink-600'
                                        } mb-3 group-hover/card:scale-110 transition-transform duration-300`}
                                        whileHover={isMobile ? {} : { rotate: 15 }}
                                    >
                                        <point.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </motion.div>
                                    <h4 className={`font-bold text-sm sm:text-base mb-2 ${
                                        isDark ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        {point.title}
                                    </h4>
                                    <p className={`text-xs sm:text-sm leading-relaxed ${
                                        isDark ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {point.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default OurPhilosophy;