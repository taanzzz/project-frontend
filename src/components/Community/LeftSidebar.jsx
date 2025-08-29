import React from 'react';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { Link, NavLink } from 'react-router';
import { FaEnvelope, FaBell, FaGamepad, FaTimes, FaUserCircle, FaCrown, FaFire, FaCheckCircle } from "react-icons/fa";
import useNotifications from '../../hooks/useNotifications';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUser, FiActivity } from "react-icons/fi";
import { HiOutlineStatusOnline, HiSparkles } from "react-icons/hi";

const LeftSidebar = ({ isDark, onClose }) => {
    const { user, loading: authLoading } = useAuth();
    const { data: currentUserProfile, isLoading: profileLoading } = useUserProfile();
    const { unreadCount } = useNotifications();

    const [isMobile, setIsMobile] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 768;
        }
        return true;
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const containerVariants = isMobile ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    } : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    };

    const itemVariants = isMobile ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    } : {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
    };

    const floatingVariants = isMobile ? {} : {
        animate: {
            y: [-2, 2, -2],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const pulseGlow = isMobile ? {} : {
        animate: {
            boxShadow: [
                `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`,
                `0 0 40px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`,
                `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`  
            ],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    if (authLoading || profileLoading) {
        return (
            <motion.aside 
                className={`fixed top-20 left-4 lg:left-6 xl:left-8 2xl:left-12 w-72 sm:w-80 lg:w-72 xl:w-80 ${
                    isDark 
                        ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20' 
                        : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
                } backdrop-blur-2xl rounded-3xl shadow-2xl p-6`}
                initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -100 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div className="flex justify-center py-12">
                    <div className="relative">
                        <LoadingSpinner />
                        <motion.div
                            className={`absolute inset-0 rounded-full border-2 border-transparent ${
                                isDark 
                                    ? 'border-t-indigo-400 border-r-purple-400' 
                                    : 'border-t-pink-500 border-r-rose-500'
                            } animate-spin`}
                            {...(isMobile ? {} : {
                                animate: { rotate: 360 },
                                transition: { duration: 1, repeat: Infinity, ease: "linear" }
                            })}
                        />
                    </div>
                </div>
            </motion.aside>
        );
    }

    const navigationItems = [
        { 
            to: "/messages", 
            icon: FaEnvelope, 
            label: "Messages",
            gradient: isDark ? "from-indigo-500 to-purple-500" : "from-pink-500 to-rose-500",
            hoverColor: isDark ? "text-indigo-400" : "text-pink-600"
        },
        { 
            to: "/notifications", 
            icon: FaBell, 
            label: "Notifications", 
            badge: unreadCount,
            gradient: isDark ? "from-purple-500 to-violet-500" : "from-rose-500 to-orange-500",
            hoverColor: isDark ? "text-purple-400" : "text-rose-600"
        },
        { 
            to: "/gaming-zone", 
            icon: FaGamepad, 
            label: "Gaming Zone",
            gradient: isDark ? "from-violet-500 to-blue-500" : "from-orange-500 to-amber-500",
            hoverColor: isDark ? "text-violet-400" : "text-orange-600"
        }
    ];

    return (
        <motion.aside 
            className={`fixed top-20 left-4 lg:left-6 xl:left-8 2xl:left-12 w-72 sm:w-80 lg:w-72 xl:w-80 max-h-[calc(100vh-6rem)] overflow-y-auto z-50 ${
                isDark 
                    ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20' 
                    : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
            } backdrop-blur-2xl rounded-3xl p-6 space-y-6`}
            initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -100, scale: 0.8 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            variants={pulseGlow}
        >
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <motion.div
                    className={`absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                        isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div
                    className={`absolute -bottom-16 -right-8 w-24 h-24 rounded-full blur-2xl opacity-15 ${
                        isDark ? 'bg-gradient-to-br from-purple-400 to-violet-600' : 'bg-gradient-to-br from-rose-400 to-pink-600'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: 1 }}
                />
            </div>

            {/* Mobile Close Button */}
            {onClose && (
                <motion.button
                    onClick={onClose}
                    className={`absolute top-4 right-4 z-10 btn btn-circle btn-sm border-none ${
                        isDark 
                            ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white shadow-lg' 
                            : 'bg-pink-100/80 text-gray-600 hover:bg-pink-200/80 hover:text-pink-700 shadow-lg'
                    } lg:hidden backdrop-blur-sm transition-all duration-300`}
                    whileHover={isMobile ? undefined : { scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 400, damping: 17 }}
                >
                    <FaTimes className="w-3 h-3" />
                </motion.button>
            )}

            {user && currentUserProfile ? (
                <motion.div 
                    className={`relative text-center pb-6 border-b border-dashed ${
                        isDark ? 'border-white/20' : 'border-pink-200/50'
                    }`}
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Profile Header with Premium Design */}
                    <motion.div className="relative mb-4">
                        {/* Status Ring Animation */}
                        <motion.div 
                            className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                                isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'
                            } p-1 mx-auto w-24 h-24 lg:w-28 lg:h-28`}
                            {...(isMobile ? {} : {
                                animate: { rotate: 360 },
                                transition: { duration: 20, repeat: Infinity, ease: "linear" }
                            })}
                        >
                            <div className={`w-full h-full rounded-full ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
                        </motion.div>
                        
                        {/* Profile Avatar */}
                        <motion.div 
                            className="avatar online mx-auto relative z-10"
                            whileHover={isMobile ? undefined : { scale: 1.05 }}
                            transition={isMobile ? undefined : { duration: 0.3, type: "spring", stiffness: 300 }}
                        >
                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                                <img src={currentUserProfile.image} alt={currentUserProfile.name} className="object-cover" />
                            </div>
                        </motion.div>
                        
                        {/* Premium Badge */}
                        <motion.div
                            className={`absolute -top-2 -right-2 z-20 p-2 rounded-full ${
                                isDark 
                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                                    : 'bg-gradient-to-br from-yellow-400 to-amber-500'
                            } shadow-xl border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}
                            initial={isMobile ? { scale: 0 } : { scale: 0, rotate: -180 }}
                            animate={isMobile ? { scale: 1 } : { scale: 1, rotate: 0 }}
                            transition={isMobile ? { duration: 0.3 } : { delay: 0.5, type: "spring", stiffness: 500, damping: 15 }}
                            whileHover={isMobile ? undefined : { scale: 1.1, rotate: 5 }}
                        >
                            <FaCrown className="w-4 h-4 text-white" />
                        </motion.div>

                        {/* Online Status */}
                        <motion.div
                            className={`absolute bottom-2 right-2 z-20 p-1 rounded-full ${
                                isDark 
                                    ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                            } shadow-lg border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={isMobile ? { duration: 0.3 } : { delay: 0.7, type: "spring", stiffness: 500 }}
                        >
                            <HiOutlineStatusOnline className="w-3 h-3 text-white" />
                        </motion.div>
                    </motion.div>
                    
                    {/* User Info */}
                    <motion.div className="space-y-2">
                        <motion.h3 
                            className={`text-xl lg:text-2xl font-black ${
                                isDark ? 'text-gray-100' : 'text-gray-700'
                            } flex items-center justify-center gap-2`}
                            initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3 } : { duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                            whileHover={isMobile ? undefined : { scale: 1.02 }}
                        >
                            {currentUserProfile.name}
                            <FaCheckCircle className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        </motion.h3>
                        
                        <motion.p 
                            className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            } break-all px-2 flex items-center justify-center gap-2`}
                            initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3 } : { duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                        >
                            <FiActivity className="w-3 h-3 flex-shrink-0" />
                            {currentUserProfile.email}
                        </motion.p>

                        {/* Stats Row */}
                        <motion.div 
                            className={`flex justify-center gap-4 pt-2 text-xs ${
                                isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                            initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3 } : { duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                        >
                            <div className="flex items-center gap-1">
                                <FiTrendingUp className="w-3 h-3" />
                                <span>Active</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <HiSparkles className="w-3 h-3 animate-pulse" />
                                <span>Premium</span>
                            </div>
                        </motion.div>
                    </motion.div>
                    
                    {/* Profile Button */}
                    <motion.div
                        className="mt-4"
                        initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                        animate={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        transition={isMobile ? { duration: 0.3 } : { duration: 0.6, ease: 'easeOut', delay: 0.5 }}
                        whileHover={isMobile ? undefined : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            to={`/profiles/${currentUserProfile._id}`}
                            className={`btn border-none text-white font-bold text-sm lg:text-base ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 shadow-lg shadow-indigo-500/30' 
                                    : 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 shadow-lg shadow-pink-500/30'
                            } w-full rounded-xl transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
                        >
                            {!isMobile && (
                                <motion.div
                                    className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                    whileHover={{ 
                                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                        x: [-100, 100]
                                    }}
                                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <FiUser className="w-4 h-4" />
                                View My Profile
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    className={`text-center p-6 rounded-2xl ${
                        isDark 
                            ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10' 
                            : 'bg-gradient-to-br from-pink-50/60 to-rose-50/60 border border-pink-200/30'
                    } backdrop-blur-sm relative overflow-hidden`}
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                    transition={isMobile ? { duration: 0.3 } : { duration: 0.6, ease: 'easeOut' }}
                >
                    {!isMobile && (
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${
                                isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'
                            } opacity-50`}
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    )}
                    <div className="relative z-10">
                        <FaUserCircle className={`mx-auto mb-3 text-4xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Welcome to Community
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Please log in to access your profile and connect with others.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Navigation Menu */}
            <motion.div
                initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                variants={containerVariants}
            >
                <motion.h4 
                    className={`font-black text-lg lg:text-xl mb-4 flex items-center gap-2 ${
                        isDark 
                            ? 'text-gray-200 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400' 
                            : 'text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500'
                    }`}
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    transition={isMobile ? { duration: 0.3 } : { delay: 0.6 }}
                >
                    <FaFire className={`${isDark ? 'text-orange-400' : 'text-orange-500'} text-lg`} />
                    Quick Access
                </motion.h4>
                
                <ul className="menu bg-transparent w-full rounded-box p-0 space-y-2">
                    {navigationItems.map((item, index) => (
                        <motion.li
                            key={item.to}
                            variants={itemVariants}
                            whileHover={isMobile ? undefined : { scale: 1.02, x: 4 }}
                            transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <NavLink 
                                to={item.to} 
                                className={({ isActive }) => 
                                    `text-base lg:text-lg rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 relative overflow-hidden ${
                                        isActive 
                                            ? isDark 
                                                ? `bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-violet-500/20 text-indigo-300 font-bold border border-indigo-400/30 shadow-lg shadow-indigo-500/20`
                                                : `bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-orange-500/20 text-pink-700 font-bold border border-pink-400/30 shadow-lg shadow-pink-500/20`
                                            : isDark
                                                ? 'text-gray-300 hover:bg-white/10 hover:text-indigo-400 hover:shadow-lg'
                                                : 'text-gray-600 hover:bg-pink-100/60 hover:text-pink-600 hover:shadow-lg'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Background Animation for Active */}
                                        {!isMobile && isActive && (
                                            <motion.div
                                                className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10`}
                                                initial={{ x: -100 }}
                                                animate={{ x: 100 }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                            />
                                        )}
                                        
                                        {/* Icon with Premium Effects */}
                                        <motion.div
                                            className={`relative p-2 rounded-xl ${
                                                isActive 
                                                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg` 
                                                    : isDark 
                                                        ? 'bg-white/10 text-gray-400' 
                                                        : 'bg-gray-100/60 text-gray-500'
                                            } backdrop-blur-sm transition-all duration-300`}
                                            whileHover={isMobile ? undefined : { scale: 1.1, rotate: isActive ? [0, -5, 5, 0] : 0 }}
                                            transition={isMobile ? { duration: 0.2 } : { duration: 0.3 }}
                                        >
                                            <item.icon className={`text-lg ${isActive ? 'text-white' : ''}`} />
                                            
                                            {/* Active Glow Effect */}
                                            {!isMobile && isActive && (
                                                <motion.div
                                                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-50 blur-md`}
                                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                />
                                            )}
                                        </motion.div>
                                        
                                        {/* Label */}
                                        <span className="flex-1 font-semibold relative z-10">
                                            {item.label}
                                        </span>
                                        
                                        {/* Badge with Animation */}
                                        {item.badge && item.badge > 0 && (
                                            <motion.div 
                                                className={`relative z-10`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={isMobile ? { duration: 0.3 } : { delay: 0.2 + index * 0.1, type: "spring", stiffness: 500 }}
                                            >
                                                <motion.div
                                                    className={`badge text-xs border-none text-white font-bold px-2 py-1 ${
                                                        isDark 
                                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                                            : 'bg-gradient-to-r from-pink-500 to-rose-500'
                                                    } shadow-lg relative overflow-hidden`}
                                                    {...(isMobile ? {} : {
                                                        animate: { scale: [1, 1.1, 1] },
                                                        transition: { duration: 2, repeat: Infinity }
                                                    })}
                                                >
                                                    {!isMobile && (
                                                        <motion.div
                                                            className="absolute inset-0 bg-white/30"
                                                            animate={{ x: [-100, 100] }}
                                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                                        />
                                                    )}
                                                    <span className="relative z-10">+{item.badge}</span>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                        
                                        {/* Trending Indicator */}
                                        {item.to === "/gaming-zone" && (
                                            <motion.div
                                                className={`p-1 rounded-full ${
                                                    isDark ? 'bg-orange-400/20 text-orange-400' : 'bg-orange-500/20 text-orange-600'
                                                }`}
                                                {...(isMobile ? {} : {
                                                    animate: { rotate: [0, 10, -10, 0] },
                                                    transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                                                })}
                                            >
                                                <FaFire className="w-3 h-3" />
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>

            {/* Footer with Status */}
            <motion.div
                className={`text-center pt-4 border-t border-dashed ${
                    isDark ? 'border-white/10' : 'border-pink-200/30'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={isMobile ? { duration: 0.3 } : { delay: 1.2, duration: 0.5 }}
            >
                <motion.p 
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2`}
                    whileHover={isMobile ? undefined : { scale: 1.05 }}
                >
                    <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        {...(isMobile ? {} : {
                            animate: { scale: [1, 1.2, 1] },
                            transition: { duration: 2, repeat: Infinity }
                        })}
                    />
                    Online & Connected
                    <HiSparkles className="w-3 h-3 animate-pulse" />
                </motion.p>
            </motion.div>
        </motion.aside>
    );
};

export default LeftSidebar;