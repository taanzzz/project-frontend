import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBookOpen, FaUsers, FaSpa, FaStore, FaArrowRight } from 'react-icons/fa';
import { useMediaQuery } from '@react-hook/media-query';

// --- Pillar Card Component ---
const PillarCard = ({ pillar, isDark, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Animation variants for mobile and desktop
    const cardVariants = isMobile
        ? {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              hover: { scale: 1, y: 0 },
              tap: { scale: 0.98 }
          }
        : {
              initial: { opacity: 0, y: 50, scale: 0.9 },
              animate: { opacity: 1, y: 0, scale: 1 },
              hover: { 
                  scale: 1.03, 
                  y: -8,
                  boxShadow: isDark 
                      ? "0 20px 40px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.2)" 
                      : "0 20px 40px rgba(244, 114, 182, 0.4), 0 0 0 1px rgba(244, 114, 182, 0.2)"
              },
              tap: { scale: 0.98 }
          };

    const iconVariants = isMobile
        ? {
              initial: { scale: 0.8 },
              animate: { scale: 1 }
          }
        : {
              initial: { scale: 0, rotate: -180 },
              animate: { scale: 1, rotate: 0 }
          };

    const textVariants = isMobile
        ? {
              initial: { y: 10, opacity: 0 },
              animate: { y: 0, opacity: 1 }
          }
        : {
              initial: { y: 30, opacity: 0 },
              animate: { y: 0, opacity: 1 }
          };

    return (
        <motion.div
            className={`relative h-80 sm:h-96 lg:h-[420px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer ${
                isDark 
                    ? 'bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-white/10' 
                    : 'bg-gradient-to-br from-white/95 to-gray-50/95 border border-pink-200/30'
            } backdrop-blur-xl`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            viewport={{ once: true, amount: 0.3 }}
            transition={isMobile 
                ? { duration: 0.3, ease: 'easeOut' } 
                : { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.15 }
            }
        >
            {/* Premium Image Container */}
            <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full overflow-hidden">
                    {/* Loading Shimmer */}
                    {!imageLoaded && (
                        <div className={`absolute inset-0 ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                        } ${isMobile ? 'animate-pulse' : 'animate-pulse'}`}>
                            <div className={`absolute inset-0 bg-gradient-to-r ${
                                isDark 
                                    ? 'from-transparent via-gray-600/50 to-transparent' 
                                    : 'from-transparent via-white/70 to-transparent'
                            } ${isMobile ? 'animate-shimmer-mobile' : 'animate-shimmer'}`}></div>
                        </div>
                    )}
                    
                    {/* Main Image */}
                    <img 
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        className={`w-full h-full object-cover object-center transition-all ${
                            isMobile ? 'duration-300' : 'duration-700'
                        } ${isMobile ? '' : 'group-hover:scale-110'} ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        } ${isDark ? 'opacity-80 group-hover:opacity-90' : 'opacity-90 group-hover:opacity-95'}`}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />
                    
                    {/* Premium Overlay Gradients */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                        isDark 
                            ? 'from-gray-900/95 via-gray-900/60 to-gray-900/20 group-hover:from-indigo-900/90 group-hover:via-indigo-900/50' 
                            : 'from-gray-900/80 via-gray-800/40 to-transparent group-hover:from-pink-900/85 group-hover:via-pink-800/45'
                    } ${isMobile ? '' : 'transition-all duration-500'}`}></div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t ${
                        isDark 
                            ? 'from-indigo-500/20 to-transparent' 
                            : 'from-pink-500/20 to-transparent'
                    } ${isMobile ? '' : 'transition-opacity duration-500'}`}></div>
                </div>
            </div>
            
            {/* Content Overlay */}
            <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 z-10">
                {/* Top Section - Icon */}
                <motion.div 
                    className="flex justify-start"
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                    transition={isMobile 
                        ? { duration: 0.2 } 
                        : { delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }
                    }
                >
                    <div className={`p-3 sm:p-4 ${
                        isDark 
                            ? 'bg-white/15 border-indigo-400/40 shadow-lg shadow-indigo-500/20' 
                            : 'bg-white/80 border-pink-400/40 shadow-lg shadow-pink-500/20'
                    } backdrop-blur-xl rounded-xl sm:rounded-2xl border ${isMobile ? '' : 'transition-all duration-300 group-hover:scale-110'}`}>
                        <pillar.icon className={`text-2xl sm:text-3xl ${
                            isDark ? 'text-indigo-300' : 'text-pink-500'
                        } drop-shadow-lg`} />
                    </div>
                </motion.div>

                {/* Bottom Section - Text & CTA */}
                <div className="space-y-3 sm:space-y-4">
                    <motion.div
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={isMobile 
                            ? { duration: 0.3 } 
                            : { delay: index * 0.15 + 0.4 }
                        }
                    >
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 sm:mb-3 ${
                            isDark 
                                ? 'text-white drop-shadow-2xl' 
                                : 'text-white drop-shadow-2xl'
                        } leading-tight`}>
                            {pillar.title}
                        </h2>
                        
                        <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${
                            isDark ? 'text-gray-200' : 'text-gray-100'
                        } drop-shadow-lg max-w-xs sm:max-w-sm opacity-90 ${isMobile ? '' : 'group-hover:opacity-100 transition-opacity duration-300'}`}>
                            {pillar.description}
                        </p>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={isMobile 
                            ? { duration: 0.3 } 
                            : { delay: index * 0.15 + 0.5 }
                        }
                        className="flex justify-end"
                    >
                        <Link 
                            to={pillar.link}
                            className={`group/btn inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-white ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50' 
                                    : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/50'
                            } ${isMobile ? '' : 'transition-all duration-300 hover:scale-105 active:scale-95'} backdrop-blur-sm border border-white/20`}
                        >
                            <span className="text-xs sm:text-sm lg:text-base font-bold">Explore</span>
                            <FaArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isMobile ? '' : 'transition-transform duration-300 group-hover/btn:translate-x-1'}`} />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Premium Shimmer Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none ${
                isDark 
                    ? 'bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent' 
                    : 'bg-gradient-to-r from-transparent via-pink-400/10 to-transparent'
            } ${isMobile ? '' : 'animate-shimmer transition-opacity duration-500'}`}></div>
        </motion.div>
    );
};

// --- Main Platform Pillars Section ---
const PlatformPillars = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const pillars = [
        {
            title: "The Library",
            description: "Immerse yourself in a vast collection of timeless wisdom and knowledge.",
            icon: FaBookOpen,
            link: "/library",
            imageUrl: "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755162332/IMG_20250814_150103_eyzqpv.jpg"
        },
        {
            title: "Community Hub",
            description: "Connect and collaborate with like-minded seekers on your journey.",
            icon: FaUsers,
            link: "/community-hub",
            imageUrl: "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755160387/undraw_messages_okui_qmap0h.png"
        },
        {
            title: "Mindfulness Zone",
            description: "Discover serenity, inner peace, and mindful living practices.",
            icon: FaSpa,
            link: "/mindfulness-zone",
            imageUrl: "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755162332/IMG_20250814_150036_qmrtwi.jpg"
        },
        {
            title: "The Store",
            description: "Curated goods and resources for a thoughtful, meaningful lifestyle.",
            icon: FaStore,
            link: "/store",
            imageUrl: "https://res.cloudinary.com/dwkj2w1ds/image/upload/v1755160387/undraw_app-installation_3czh_wyrvip.png"
        }
    ];

    // Animation variants for section
    const sectionVariants = isMobile
        ? {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
          }
        : {
              initial: { opacity: 0, y: 60, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 },
              hover: { scale: 1.01 }
          };

    const headerVariants = isMobile
        ? {
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 }
          }
        : {
              initial: { opacity: 0, y: -50 },
              animate: { opacity: 1, y: 0 }
          };

    const subheaderVariants = isMobile
        ? {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 }
          }
        : {
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 }
          };

    const textVariants = isMobile
        ? {
              initial: { y: 10, opacity: 0 },
              animate: { y: 0, opacity: 1 }
          }
        : {
              initial: { y: 20, opacity: 0 },
              animate: { y: 0, opacity: 1 }
          };

    return (
        <div className={`relative py-16 sm:py-20 lg:py-24 overflow-hidden min-h-screen ${
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
                                isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'
                            } rounded-full blur-3xl`}
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 50, 0],
                                y: [0, -30, 0],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className={`absolute bottom-20 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 ${
                                isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'
                            } rounded-full blur-3xl`}
                            animate={{
                                scale: [1.2, 1, 1.2],
                                x: [0, -50, 0],
                                y: [0, 30, 0],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        />
                    </>
                )}
                
                {/* Grid Pattern */}
                <div className={`absolute inset-0 opacity-5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                }`} style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                    variants={headerVariants}
                    initial="initial"
                    animate="animate"
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.4 } : { duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        variants={subheaderVariants}
                        initial="initial"
                        animate="animate"
                        transition={isMobile ? { duration: 0.3, delay: 0.1 } : { duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                    >
                        <h2 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${
                            isDark 
                                ? 'from-indigo-400 via-purple-400 to-pink-400' 
                                : 'from-pink-600 via-rose-600 to-orange-500'
                        } drop-shadow-2xl leading-tight tracking-tight`}>
                            Explore Our Sanctuaries
                        </h2>
                    </motion.div>
                    
                    <motion.p 
                        className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto ${
                            isDark ? 'text-gray-300' : 'text-gray-600'
                        } drop-shadow-sm`}
                        variants={textVariants}
                        initial="initial"
                        animate="animate"
                        transition={isMobile ? { duration: 0.3, delay: 0.2 } : { duration: 0.6, delay: 0.4 }}
                    >
                        Four pillars of wisdom carefully crafted to inspire and guide your transformative journey of self-discovery and growth.
                    </motion.p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 ${
                        isDark 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-white/60 border-pink-200/30'
                    } rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border backdrop-blur-xl shadow-2xl`}
                    variants={sectionVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={isMobile ? {} : { scale: 1.01 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={isMobile ? { duration: 0.4 } : { duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                >
                    {pillars.map((pillar, index) => (
                        <PillarCard 
                            key={pillar.title} 
                            pillar={pillar} 
                            isDark={isDark} 
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes shimmer-mobile {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 3s infinite;
                }
                .animate-shimmer-mobile {
                    animation: shimmer-mobile 1.5s infinite;
                }
            `}</style>
        </div>
    );
};

export default PlatformPillars;