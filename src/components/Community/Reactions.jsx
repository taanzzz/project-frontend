import React, { useState, useEffect } from 'react';
import axiosSecure from '../../api/Axios';
import { FaThumbsUp, FaHeart, FaSadCry, FaGrinStars, FaHandHoldingHeart } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

// Reaction types with enhanced styling properties
const reactionTypes = [
    { 
        type: 'like', 
        icon: FaThumbsUp, 
        color: 'text-blue-500', 
        bg: 'bg-blue-500/20',
        hoverBg: 'hover:bg-blue-500/30',
        shadow: 'shadow-blue-500/30',
        gradient: 'from-blue-400 to-blue-600'
    },
    { 
        type: 'love', 
        icon: FaHeart, 
        color: 'text-red-500', 
        bg: 'bg-red-500/20',
        hoverBg: 'hover:bg-red-500/30',
        shadow: 'shadow-red-500/30',
        gradient: 'from-red-400 to-red-600'
    },
    { 
        type: 'care', 
        icon: FaHandHoldingHeart, 
        color: 'text-yellow-500', 
        bg: 'bg-yellow-500/20',
        hoverBg: 'hover:bg-yellow-500/30',
        shadow: 'shadow-yellow-500/30',
        gradient: 'from-yellow-400 to-orange-500'
    },
    { 
        type: 'wow', 
        icon: FaGrinStars, 
        color: 'text-pink-500', 
        bg: 'bg-pink-500/20',
        hoverBg: 'hover:bg-pink-500/30',
        shadow: 'shadow-pink-500/30',
        gradient: 'from-pink-400 to-pink-600'
    },
    { 
        type: 'sad', 
        icon: FaSadCry, 
        color: 'text-gray-500', 
        bg: 'bg-gray-500/20',
        hoverBg: 'hover:bg-gray-500/30',
        shadow: 'shadow-gray-500/30',
        gradient: 'from-gray-400 to-gray-600'
    },
];

const Reactions = ({ post }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [hoveredReaction, setHoveredReaction] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
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

    const currentUserReaction = post.whoReacted?.find(r => r.userEmail === user?.email);

    const handleReactClick = async (reactionType) => {
        if (!user) {
            return toast.error("You must be logged in to react.");
        }
        
        setIsAnimating(true);
        
        try {
            const typeToSend = reactionType === 'sad' ? 'dislike' : reactionType;
            await axiosSecure.patch(`/api/posts/${post._id}/react`, { reactionType: typeToSend });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (error) {
            console.error("Failed to react:", error);
            toast.error(error.response?.data?.message || "Failed to submit reaction.");
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    };

    // Animation variants
    const containerVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const buttonVariants = {
        initial: { 
            opacity: 0, 
            scale: 0.8,
            y: 20
        },
        animate: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: { 
                duration: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        hover: { 
            scale: 1.08,
            y: -3,
            transition: { 
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 15
            }
        },
        tap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const iconVariants = {
        initial: { rotate: 0 },
        hover: { 
            rotate: [0, -10, 10, 0],
            transition: { 
                duration: 0.5,
                ease: "easeInOut"
            }
        },
        active: {
            scale: [1, 1.3, 1],
            rotate: [0, 15, -15, 0],
            transition: { 
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const countVariants = {
        initial: { opacity: 0, scale: 0.5 },
        animate: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.3,
                type: "spring",
                stiffness: 400
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.5,
            transition: { duration: 0.2 }
        }
    };
    
    return (
        <motion.div 
            className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full justify-start px-3 sm:px-4 md:px-6 lg:px-8 py-2"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                <motion.div
                    className={`absolute inset-0 ${
                        isDark 
                            ? 'bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5' 
                            : 'bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-red-500/5'
                    } blur-xl`}
                    animate={{ 
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                />
            </div>

            {reactionTypes.map(({ type, icon: Icon, color, bg, hoverBg, shadow, gradient }, index) => {
                const isActive = currentUserReaction?.reactionType === type || (type === 'sad' && currentUserReaction?.reactionType === 'dislike');
                const count = post.reactions[type === 'sad' ? 'dislike' : type] || 0;
                const isHovered = hoveredReaction === type;

                return (
                    <motion.div
                        key={type}
                        className="relative"
                        variants={buttonVariants}
                        onHoverStart={() => setHoveredReaction(type)}
                        onHoverEnd={() => setHoveredReaction(null)}
                    >
                        {/* Pulse Effect for Active Reaction */}
                        {isActive && (
                            <motion.div
                                className={`absolute inset-0 rounded-full blur-sm ${bg}`}
                                variants={pulseVariants}
                                animate="animate"
                            />
                        )}

                        <motion.button
                            onClick={() => handleReactClick(type)}
                            className={`relative flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full transition-all duration-400 backdrop-blur-md overflow-hidden ${
                                isActive 
                                    ? `${bg} ${color} shadow-lg ${shadow}` 
                                    : `${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100/80'} ${hoverBg} shadow-lg hover:${shadow}`
                            } group`}
                            aria-label={`React with ${type}`}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            disabled={isAnimating}
                        >
                            {/* Button Background Animation */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 rounded-full`}
                                animate={{ 
                                    opacity: isHovered ? (isDark ? 0.15 : 0.1) : 0,
                                    scale: isHovered ? 1.1 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Shine Effect on Hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0"
                                animate={{ 
                                    x: isHovered ? ['0%', '200%'] : '0%',
                                    opacity: isHovered ? [0, 0.6, 0] : 0
                                }}
                                transition={{ 
                                    duration: 0.8,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Icon */}
                            <motion.div
                                className="relative z-10"
                                variants={iconVariants}
                                animate={isActive && isAnimating ? "active" : isHovered ? "hover" : "initial"}
                            >
                                <Icon className={`text-base sm:text-lg md:text-xl lg:text-2xl transition-all duration-400 ${
                                    isActive ? `${color} drop-shadow-lg` : `group-hover:${color}`
                                }`} />
                            </motion.div>

                            {/* Count */}
                            <AnimatePresence mode="wait">
                                {count > 0 && (
                                    <motion.span 
                                        className={`relative z-10 text-xs sm:text-sm md:text-base font-bold transition-all duration-400 ${
                                            isActive 
                                                ? `${color} drop-shadow-sm` 
                                                : isDark ? 'text-gray-400 group-hover:text-current' : 'text-gray-500 group-hover:text-current'
                                        }`}
                                        variants={countVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        key={count}
                                    >
                                        {count}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Ripple Effect on Click */}
                            {isAnimating && (
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full opacity-30`}
                                    initial={{ scale: 0, opacity: 0.5 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            )}

                            {/* Tooltip */}
                            <motion.div
                                className={`absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap backdrop-blur-md ${
                                    isDark 
                                        ? 'bg-slate-800/95 border border-white/20 text-gray-200 shadow-lg' 
                                        : 'bg-white/95 border border-gray-200/50 text-gray-700 shadow-lg'
                                } pointer-events-none capitalize`}
                                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                animate={{ 
                                    opacity: isHovered ? 1 : 0,
                                    y: isHovered ? 0 : 5,
                                    scale: isHovered ? 1 : 0.9
                                }}
                                transition={{ duration: 0.2, delay: 0.3 }}
                            >
                                {type === 'sad' ? 'Dislike' : type}
                                <motion.div
                                    className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 ${
                                        isDark ? 'bg-slate-800' : 'bg-white'
                                    } rotate-45 border-r border-b ${
                                        isDark ? 'border-white/20' : 'border-gray-200/50'
                                    }`}
                                />
                            </motion.div>
                        </motion.button>
                    </motion.div>
                )
            })}
        </motion.div>
    );
};

export default Reactions;