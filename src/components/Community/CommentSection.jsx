import React, { useState, useEffect } from 'react';
import { FaRegCommentDots } from "react-icons/fa";
import { motion } from 'framer-motion';
import CommentModal from './CommentModal';

const CommentSection = ({ post, highlightedCommentId }) => { 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isHovered, setIsHovered] = useState(false);
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

    // This logic remains unchanged: automatically opens the modal if a specific comment is highlighted.
    useEffect(() => {
        if (highlightedCommentId) {
            setIsModalOpen(true);
        }
    }, [highlightedCommentId]);
    
    // Animation variants
    const buttonVariants = {
        initial: { 
            scale: 1,
            y: 0
        },
        hover: { 
            scale: 1.08,
            y: -2,
            transition: { 
                duration: 0.3,
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
        initial: { 
            rotate: 0,
            scale: 1
        },
        hover: { 
            rotate: 5,
            scale: 1.1,
            transition: { 
                duration: 0.3,
                type: "spring",
                stiffness: 300
            }
        }
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                `0 4px 20px ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`,
                `0 8px 30px ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`,
                `0 4px 20px ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`
            ],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <div className="w-full flex justify-end">
            {/* Background Effects */}
            <div className="relative">
                <motion.div
                    className={`absolute inset-0 rounded-full blur-xl opacity-0 ${
                        isDark ? 'bg-gradient-to-r from-violet-500 to-indigo-600' : 'bg-gradient-to-r from-pink-500 to-rose-600'
                    }`}
                    animate={{ opacity: isHovered ? 0.15 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                
                <motion.button 
                    onClick={() => setIsModalOpen(true)} 
                    className={`relative p-4 lg:p-5 rounded-2xl lg:rounded-3xl transition-all duration-400 backdrop-blur-md border-2 ${
                        isDark 
                            ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:border-violet-400/50 hover:text-violet-400 shadow-lg hover:shadow-violet-500/25' 
                            : 'bg-white/80 border-gray-200/50 text-gray-600 hover:bg-white/95 hover:border-pink-400/50 hover:text-pink-500 shadow-lg hover:shadow-pink-500/25'
                    } group overflow-hidden`}
                    aria-label="View or add comments"
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    animate={isHovered ? glowVariants.animate : {}}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                >
                    {/* Button Background Animation */}
                    <motion.div
                        className={`absolute inset-0 ${
                            isDark 
                                ? 'bg-gradient-to-br from-violet-500/20 to-indigo-600/20' 
                                : 'bg-gradient-to-br from-pink-500/20 to-rose-600/20'
                        } rounded-2xl lg:rounded-3xl opacity-0`}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Shine Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0"
                        animate={{ 
                            x: isHovered ? ['0%', '200%'] : '0%',
                            opacity: isHovered ? [0, 0.5, 0] : 0
                        }}
                        transition={{ 
                            duration: 0.8,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Icon */}
                    <motion.div
                        variants={iconVariants}
                        className="relative z-10"
                    >
                        <FaRegCommentDots className="text-xl lg:text-2xl transition-colors duration-400" />
                    </motion.div>

                    {/* Ripple Effect */}
                    <motion.div
                        className={`absolute inset-0 rounded-2xl lg:rounded-3xl ${
                            isDark ? 'bg-violet-400/20' : 'bg-pink-500/20'
                        } opacity-0`}
                        animate={{ 
                            scale: isHovered ? [1, 1.2, 1] : 1,
                            opacity: isHovered ? [0, 0.3, 0] : 0
                        }}
                        transition={{ 
                            duration: 1.5,
                            repeat: isHovered ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Tooltip */}
                    <motion.div
                        className={`absolute -top-12 -left-4 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap backdrop-blur-md border ${
                            isDark 
                                ? 'bg-slate-800/95 border-white/20 text-gray-200 shadow-lg' 
                                : 'bg-white/95 border-gray-200/50 text-gray-700 shadow-lg'
                        } pointer-events-none`}
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ 
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 5,
                            scale: isHovered ? 1 : 0.9
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        Comments
                        <motion.div
                            className={`absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 ${
                                isDark ? 'bg-slate-800' : 'bg-white'
                            } rotate-45 border-r border-b ${
                                isDark ? 'border-white/20' : 'border-gray-200/50'
                            }`}
                        />
                    </motion.div>
                </motion.button>
            </div>
            
            {/* The modal is only rendered in the DOM when it's supposed to be open, improving performance. */}
            {isModalOpen && (
                <CommentModal 
                    post={post} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    highlightedCommentId={highlightedCommentId} 
                />
            )}
        </div>
    );
};

export default CommentSection;