import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosSecure from '../../api/Axios';
import { motion, useReducedMotion } from 'framer-motion';
import { FaLightbulb, FaHashtag, FaMagic, FaRocket } from "react-icons/fa";
import { FiEdit3,  FiImage, FiSmile } from "react-icons/fi";
import { HiSparkles } from 'react-icons/hi';


const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const isDark = theme === 'dark';

    // Detect if user prefers reduced motion (for mobile/smooth performance)
    const prefersReducedMotion = useReducedMotion();

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

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        setCharCount(newContent.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim().length < 10) {
            return toast.error("Post must be at least 10 characters long.");
        }
        setIsSubmitting(true);
        try {
            const response = await axiosSecure.post('/api/posts', { content });
            
            if (response.status === 201) {
                toast.success("Post submitted successfully for review!");
                setContent('');
                setCharCount(0);
            }
        } catch (error) {
            console.error("Post creation error:", error.response);
            const errorMessage = error.response?.data?.message || "Failed to create post.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const floatingVariants = {
        animate: {
            y: prefersReducedMotion ? 0 : [-2, 2, -2],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const pulseGlow = {
        animate: {
            boxShadow: prefersReducedMotion
                ? undefined
                : [
                    `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`,
                    `0 0 40px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`,
                    `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(236, 72, 153, 0.2)'}`
                ],
            transition: prefersReducedMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const maxChars = 2000;
    const progress = (charCount / maxChars) * 100;
    const isNearLimit = charCount > maxChars * 0.8;

    return (
        <motion.div
            className={`relative p-6 sm:p-8 lg:p-10 ${
                isDark 
                    ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20' 
                    : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
            } backdrop-blur-2xl rounded-3xl max-w-4xl mx-auto mb-12 transition-all duration-500 hover:scale-[1.01] ${
                isFocused ? (isDark ? 'shadow-indigo-500/40' : 'shadow-pink-500/40') : ''
            }`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            variants={pulseGlow}
        >
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <motion.div
                    className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                        isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div
                    className={`absolute -bottom-20 -left-12 w-32 h-32 rounded-full blur-2xl opacity-15 ${
                        isDark ? 'bg-gradient-to-br from-purple-400 to-violet-600' : 'bg-gradient-to-br from-rose-400 to-pink-600'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                    transition={{ delay: prefersReducedMotion ? 0 : 1.5 }}
                />
            </div>

            {/* Header Section */}
            <motion.div 
                className="relative z-10 mb-8"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <motion.div
                        className={`p-3 rounded-2xl ${
                            isDark 
                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30' 
                                : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                        } backdrop-blur-sm shadow-lg`}
                        whileHover={!prefersReducedMotion ? { scale: 1.05, rotate: [0, -3, 3, 0] } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <FiEdit3 className={`${isDark ? 'text-indigo-400' : 'text-pink-600'} text-2xl lg:text-3xl`} />
                    </motion.div>
                    
                    <div className="flex-1">
                        <motion.h3 
                            className={`font-black text-2xl md:text-3xl lg:text-4xl bg-clip-text text-transparent ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400' 
                                    : 'bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500'
                            } drop-shadow-sm flex items-center gap-3`}
                            whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Share Your Knowledge
                            <motion.div
                                animate={!prefersReducedMotion ? { rotate: [0, 10, -10, 0] } : {}}
                                transition={{ duration: 2, repeat: prefersReducedMotion ? 0 : Infinity, repeatDelay: 3 }}
                            >
                                <HiSparkles className={`${isDark ? 'text-yellow-400' : 'text-amber-500'} text-2xl animate-pulse`} />
                            </motion.div>
                        </motion.h3>
                        
                        <motion.p 
                            className={`text-sm lg:text-base mt-2 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            } flex items-center gap-2`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <FaLightbulb className={`${isDark ? 'text-yellow-400' : 'text-amber-500'} text-sm`} />
                            Inspire and educate the community with your insights
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                {/* Textarea with Enhanced Design */}
                <motion.div 
                    className="relative"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.textarea
                        className={`w-full p-6 rounded-2xl text-base lg:text-lg leading-relaxed transition-all duration-500 resize-none ${
                            isDark 
                                ? `bg-gradient-to-br from-gray-800/60 to-gray-700/40 text-gray-200 border-2 ${
                                    isFocused ? 'border-indigo-400/60 shadow-xl shadow-indigo-500/20' : 'border-white/20'
                                } placeholder:text-gray-400 focus:bg-gray-800/80` 
                                : `bg-gradient-to-br from-white/90 to-pink-50/60 text-gray-700 border-2 ${
                                    isFocused ? 'border-pink-400/60 shadow-xl shadow-pink-500/20' : 'border-pink-200/50'
                                } placeholder:text-gray-500 focus:bg-white/95`
                        } backdrop-blur-sm focus:outline-none focus:ring-0`}
                        placeholder="What's on your mind? Share something educational, inspiring, or positive with the community... 💡"
                        value={content}
                        onChange={handleContentChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        rows="6"
                        maxLength={maxChars}
                        disabled={isSubmitting}
                        whileFocus={!prefersReducedMotion ? { scale: 1.01 } : {}}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Floating Action Icons */}
                    <motion.div 
                        className={`absolute bottom-4 left-4 flex items-center gap-2 transition-opacity duration-300 ${
                            isFocused ? 'opacity-100' : 'opacity-50'
                        }`}
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                        animate={{ opacity: isFocused ? 1 : 0.5, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.button
                            type="button"
                            className={`p-2 rounded-full ${
                                isDark 
                                    ? 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-indigo-400' 
                                    : 'bg-gray-100/60 hover:bg-pink-100/80 text-gray-500 hover:text-pink-600'
                            } transition-all duration-300 backdrop-blur-sm`}
                            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
                            whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
                        >
                            <FiImage className="w-4 h-4" />
                        </motion.button>
                        
                        <motion.button
                            type="button"
                            className={`p-2 rounded-full ${
                                isDark 
                                    ? 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-purple-400' 
                                    : 'bg-gray-100/60 hover:bg-rose-100/80 text-gray-500 hover:text-rose-600'
                            } transition-all duration-300 backdrop-blur-sm`}
                            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
                            whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
                        >
                            <FiSmile className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                            type="button"
                            className={`p-2 rounded-full ${
                                isDark 
                                    ? 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-violet-400' 
                                    : 'bg-gray-100/60 hover:bg-orange-100/80 text-gray-500 hover:text-orange-600'
                            } transition-all duration-300 backdrop-blur-sm`}
                            whileHover={!prefersReducedMotion ? { scale: 1.1 } : {}}
                            whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
                        >
                            <FaHashtag className="w-4 h-4" />
                        </motion.button>
                    </motion.div>

                    {/* Character Counter */}
                    <motion.div 
                        className={`absolute bottom-4 right-4 flex items-center gap-2 ${
                            isNearLimit ? 'text-red-500' : (isDark ? 'text-gray-400' : 'text-gray-500')
                        } text-sm font-medium`}
                        animate={{ scale: isNearLimit ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 0.5, repeat: isNearLimit ? Infinity : 0 }}
                    >
                        <div className={`relative w-8 h-8 rounded-full ${
                            isDark ? 'bg-white/10' : 'bg-gray-200/60'
                        } backdrop-blur-sm flex items-center justify-center`}>
                            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                                <circle
                                    cx="12" cy="12" r="10"
                                    fill="none"
                                    className={isDark ? 'stroke-white/20' : 'stroke-gray-300'}
                                    strokeWidth="2"
                                />
                                <motion.circle
                                    cx="12" cy="12" r="10"
                                    fill="none"
                                    className={`${
                                        isNearLimit 
                                            ? 'stroke-red-500' 
                                            : isDark 
                                                ? 'stroke-indigo-400' 
                                                : 'stroke-pink-500'
                                    }`}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 10}`}
                                    strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress / 100)}`}
                                    animate={{ strokeDashoffset: `${2 * Math.PI * 10 * (1 - progress / 100)}` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </svg>
                        </div>
                        <span className="tabular-nums">
                            {charCount}/{maxChars}
                        </span>
                    </motion.div>
                </motion.div>

                {/* Action Bar */}
                <motion.div 
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* Tips */}
                    <motion.div 
                        className={`flex items-center gap-2 text-xs lg:text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        } flex-1`}
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <FaMagic className={`${isDark ? 'text-purple-400' : 'text-rose-500'} text-sm`} />
                        <span className="hidden sm:inline">
                            Pro tip: Share insights, ask questions, or start meaningful discussions
                        </span>
                        <span className="sm:hidden">
                            Share insights & inspire others
                        </span>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className={`group relative overflow-hidden btn border-none text-white font-bold text-base lg:text-lg px-8 py-3 ${
                            isDark 
                                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 hover:from-indigo-600 hover:via-purple-600 hover:to-violet-600 shadow-xl shadow-indigo-500/30' 
                                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 shadow-xl shadow-pink-500/30'
                        } rounded-2xl transition-all duration-500 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-[140px] sm:min-w-[160px]`}
                        disabled={isSubmitting || content.trim().length < 10}
                        whileHover={!prefersReducedMotion ? { 
                            scale: 1.05,
                            boxShadow: isDark 
                                ? "0 20px 40px rgba(99, 102, 241, 0.4)" 
                                : "0 20px 40px rgba(236, 72, 153, 0.4)"
                        } : {}}
                        whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Animated Background */}
                        {!prefersReducedMotion && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                animate={{ x: [-100, 300] }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    repeatDelay: 1,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                        
                        {/* Button Content */}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
                                        transition={{ duration: 1, repeat: prefersReducedMotion ? 0 : Infinity, ease: "linear" }}
                                    >
                                        <div className="loading loading-spinner loading-sm"></div>
                                    </motion.div>
                                    <span>Publishing...</span>
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={!prefersReducedMotion ? { x: 2 } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaRocket className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Publish Post</span>
                                    </motion.div>
                                </>
                            )}
                        </span>
                        
                        {/* Glow Effect */}
                        <motion.div
                            className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 ${
                                isDark 
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500' 
                                    : 'bg-gradient-to-r from-pink-500 to-orange-500'
                            } transition-opacity duration-500`}
                        />
                    </motion.button>
                </motion.div>

                {/* Minimum Length Indicator */}
                {charCount > 0 && charCount < 10 && (
                    <motion.div
                        className={`text-xs ${isDark ? 'text-amber-400' : 'text-orange-500'} flex items-center gap-2 justify-center`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <FaLightbulb className="w-3 h-3" />
                        <span>At least {10 - charCount} more characters needed</span>
                    </motion.div>
                )}
            </form>

            {/* Success Animation Overlay */}
            {isSubmitting && (
                <motion.div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`p-8 rounded-2xl ${
                            isDark 
                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30' 
                                : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                        } backdrop-blur-md text-center`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={prefersReducedMotion ? {} : { rotate: 360 }}
                            transition={{ duration: 2, repeat: prefersReducedMotion ? 0 : Infinity, ease: "linear" }}
                            className="mb-4"
                        >
                            <FaRocket className={`mx-auto text-4xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                        </motion.div>
                        <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Publishing your post...
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};


export default CreatePost;
