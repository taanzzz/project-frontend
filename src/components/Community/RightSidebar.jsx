import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBalanceScale, FaHandsHelping, FaLightbulb, FaTimesCircle, FaUsers, FaTimes, FaStar, FaCheckCircle } from "react-icons/fa";
import { FiInfo, FiTrendingUp, FiShield } from "react-icons/fi";
import { HiSparkles } from 'react-icons/hi';

const RightSidebar = ({ isDark, onClose }) => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: suggestions = [], isLoading } = useQuery({
        queryKey: ['follow-suggestions'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/users/suggestions');
            return data;
        },
        enabled: !!currentUser,
        // 👇️👇️👇️ এই দুইটি লাইন যোগ করা হয়েছে সমস্যা সমাধানের জন্য 👇️👇️👇️
        staleTime: 1000 * 60 * 5, // ডেটা ৫ মিনিট পর্যন্ত ফ্রেশ থাকবে
        keepPreviousData: true, // নতুন ডেটা লোড হওয়ার সময় পুরনো ডেটা দেখানো হবে
        // 👆️👆️👆️ উপরে উল্লেখিত পরিবর্তন করা হয়েছে 👆️👆️👆️
    });

    const mutation = useMutation({
        mutationFn: (userIdToFollow) => axiosSecure.patch(`/api/users/${userIdToFollow}/follow`),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile', currentUser?.email] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update follow status.")
    });

    const handleFollowClick = (userIdToFollow) => {
        if (!currentUser) return toast.error("Please log in to follow users.");
        mutation.mutate(userIdToFollow);
    };

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
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    };
    
    const itemVariants = isMobile ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    } : {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
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

    return (
        <motion.aside
            className={`fixed top-20 right-4 lg:right-6 xl:right-8 2xl:right-12 w-72 sm:w-80 lg:w-72 xl:w-80 max-h-[calc(100vh-6rem)] overflow-y-auto z-50 ${
                isDark
                    ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20'
                    : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
            } backdrop-blur-2xl rounded-3xl p-6 space-y-6`}
            initial={isMobile ? { opacity: 0 } : { opacity: 0, x: 100, scale: 0.8 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
            transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            variants={pulseGlow}
        >
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <motion.div
                    className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                        isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
                    }`}
                    variants={floatingVariants}
                    animate="animate"
                />
                <motion.div
                    className={`absolute -bottom-16 -left-8 w-24 h-24 rounded-full blur-2xl opacity-15 ${
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
            
            {/* Who to Follow Section */}
            <motion.div
                initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <motion.div className="mb-6 relative">
                    <motion.h3
                        className={`font-black text-xl lg:text-2xl flex items-center gap-3 bg-clip-text text-transparent ${
                            isDark
                                ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400'
                                : 'bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500'
                        } drop-shadow-sm`}
                        whileHover={isMobile ? undefined : { scale: 1.02 }}
                        transition={isMobile ? undefined : { type: "spring", stiffness: 300 }}
                    >
                        <motion.div
                            className={`p-2 rounded-xl ${
                                isDark
                                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30'
                                    : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                            } backdrop-blur-sm shadow-lg`}
                            whileHover={isMobile ? undefined : { rotate: [0, -5, 5, 0] }}
                            transition={isMobile ? undefined : { duration: 0.6 }}
                        >
                            <FaUsers className={`${isDark ? 'text-indigo-400' : 'text-pink-600'} text-lg`} />
                        </motion.div>
                        <span className="relative">
                            Who to Follow
                            {!isMobile && (
                                <motion.div
                                    className={`absolute -inset-1 bg-gradient-to-r ${
                                        isDark
                                            ? 'from-indigo-400/0 via-purple-400/20 to-violet-400/0'
                                            : 'from-pink-600/0 via-rose-500/20 to-orange-500/0'
                                    } blur-sm -z-10`}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}
                        </span>
                        <HiSparkles className={`${isDark ? 'text-yellow-400' : 'text-amber-500'} text-lg animate-pulse`} />
                    </motion.h3>
                </motion.div>
                
                {isLoading ? (
                    <motion.div
                        className="flex justify-center py-12"
                        initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
                        animate={isMobile ? { opacity: 1 } : { opacity: 1 }}
                        transition={isMobile ? { duration: 0.3 } : { duration: 0.5 }}
                    >
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
                    </motion.div>
                ) : (
                    <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {suggestions.length > 0 ? (
                            suggestions
                                .filter(user => user.email !== currentUser?.email)
                                .slice(0, 5)
                                .map((user, index) => (
                                    <motion.div
                                        key={user._id}
                                        variants={itemVariants}
                                        className={`group relative overflow-hidden rounded-2xl p-4 ${
                                            isDark
                                                ? 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-indigo-400/30'
                                                : 'bg-gradient-to-r from-white/60 to-white/80 hover:from-white/80 hover:to-white/95 border border-pink-200/30 hover:border-pink-400/40'
                                        } backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
                                            isDark ? 'hover:shadow-indigo-500/20' : 'hover:shadow-pink-500/20'
                                        }`}
                                        whileHover={isMobile ? undefined : { y: -2 }}
                                        transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {/* Background Animation */}
                                        <motion.div
                                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 ${
                                                isDark
                                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
                                                    : 'bg-gradient-to-r from-pink-500/10 to-rose-500/10'
                                            } transition-opacity duration-500`}
                                        />
                                        
                                        <div className="relative z-10 flex items-center justify-between">
                                            <Link to={`/profiles/${user._id}`} className="flex items-center gap-3 group/link flex-1 min-w-0">
                                                <div className="relative flex-shrink-0">
                                                    <motion.div className="avatar">
                                                        <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full ring-2 ring-offset-2 ${
                                                            isDark
                                                                ? 'ring-indigo-400/50 ring-offset-slate-900 group-hover/link:ring-indigo-400 group-hover/link:ring-4'
                                                                : 'ring-pink-400/50 ring-offset-white group-hover/link:ring-pink-400 group-hover/link:ring-4'
                                                        } transition-all duration-300 shadow-lg`}>
                                                            <img src={user.image} alt={user.name} className="object-cover" />
                                                        </div>
                                                    </motion.div>
                                                    
                                                    {/* Verified Badge for Premium Look */}
                                                    <motion.div
                                                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${
                                                            isDark
                                                                ? 'bg-gradient-to-br from-indigo-400 to-purple-500'
                                                                : 'bg-gradient-to-br from-pink-500 to-rose-500'
                                                        } flex items-center justify-center shadow-lg border-2 ${
                                                            isDark ? 'border-slate-900' : 'border-white'
                                                        }`}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={isMobile ? { duration: 0.3 } : { delay: 0.2 + index * 0.1, type: "spring", stiffness: 500 }}
                                                        whileHover={isMobile ? undefined : { scale: 1.2 }}
                                                    >
                                                        <FaCheckCircle className="w-2.5 h-2.5 text-white" />
                                                    </motion.div>
                                                </div>
                                                
                                                <div className="min-w-0 flex-1">
                                                    <motion.p
                                                        className={`font-bold text-sm lg:text-base truncate ${
                                                            isDark
                                                                ? 'text-gray-100 group-hover/link:text-indigo-400'
                                                                : 'text-gray-700 group-hover/link:text-pink-600'
                                                        } transition-colors duration-300`}
                                                        whileHover={isMobile ? undefined : { x: 2 }}
                                                    >
                                                        {user.name}
                                                    </motion.p>
                                                    <motion.p
                                                        className={`text-xs ${
                                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                                        } truncate flex items-center gap-1`}
                                                        initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 5 }}
                                                        animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                                        transition={isMobile ? { duration: 0.3 } : { delay: 0.1 + index * 0.05 }}
                                                    >
                                                        @{user.name.toLowerCase().replace(/\s+/g, '')}
                                                        <FiTrendingUp className="w-3 h-3 opacity-60" />
                                                    </motion.p>
                                                </div>
                                            </Link>
                                            
                                            <motion.button
                                                onClick={() => handleFollowClick(user._id)}
                                                className={`btn btn-sm border-none text-white font-semibold px-4 py-1 text-xs lg:text-sm ${
                                                    isDark
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30'
                                                        : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/30'
                                                } rounded-full transition-all duration-300 hover:shadow-xl flex-shrink-0 relative overflow-hidden`}
                                                disabled={mutation.isLoading && mutation.variables === user._id}
                                                whileHover={isMobile ? undefined : { scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 400, damping: 17 }}
                                            >
                                                {!isMobile && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                                        whileHover={{
                                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                                            x: [-100, 100]
                                                        }}
                                                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                                                    />
                                                )}
                                                {mutation.isLoading && mutation.variables === user._id ?
                                                    <span className="loading loading-spinner loading-xs"></span> :
                                                    <span className="relative z-10 flex items-center gap-1">
                                                        <FaStar className="w-3 h-3" />
                                                        Follow
                                                    </span>
                                                }
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <motion.div
                                className={`text-center py-8 px-4 rounded-2xl ${
                                    isDark
                                        ? 'bg-gradient-to-br from-white/5 to-white/10 border border-white/10'
                                        : 'bg-gradient-to-br from-pink-50/60 to-rose-50/60 border border-pink-200/30'
                                } backdrop-blur-sm`}
                                initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                                animate={isMobile ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                                transition={isMobile ? { duration: 0.3 } : { duration: 0.5 }}
                            >
                                <FaUsers className={`mx-auto mb-3 text-3xl ${isDark ? 'text-gray-500' : 'text-gray-400'} opacity-50`} />
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    No new suggestions available
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Check back later for more users to connect with!
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Premium Divider */}
            <motion.div
                className="relative py-4"
                initial={isMobile ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
                transition={isMobile ? { duration: 0.3 } : { duration: 0.8, delay: 0.5 }}
            >
                <div className={`h-[1px] bg-gradient-to-r ${
                    isDark
                        ? 'from-transparent via-white/20 to-transparent'
                        : 'from-transparent via-pink-300/40 to-transparent'
                } relative`}>
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${
                            isDark
                                ? 'from-indigo-500/50 to-purple-500/50'
                                : 'from-pink-500/50 to-rose-500/50'
                        } blur-sm opacity-60`}
                        {...(isMobile ? {} : {
                            animate: { opacity: [0.6, 1, 0.6] },
                            transition: { duration: 3, repeat: Infinity }
                        })}
                    />
                </div>
            </motion.div>

            {/* Community Guidelines Section */}
            <motion.div
                initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={isMobile ? { duration: 0.3 } : { duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="relative"
            >
                <motion.div className="mb-6 relative">
                    <motion.h3
                        className={`font-black text-xl lg:text-2xl flex items-center gap-3 bg-clip-text text-transparent ${
                            isDark
                                ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400'
                                : 'bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500'
                        } drop-shadow-sm`}
                        whileHover={isMobile ? undefined : { scale: 1.02 }}
                        transition={isMobile ? undefined : { type: "spring", stiffness: 300 }}
                    >
                        <motion.div
                            className={`p-2 rounded-xl ${
                                isDark
                                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30'
                                    : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                            } backdrop-blur-sm shadow-lg`}
                            whileHover={isMobile ? undefined : { rotate: [0, -5, 5, 0] }}
                            transition={isMobile ? undefined : { duration: 0.6 }}
                        >
                            <FiShield className={`${isDark ? 'text-indigo-400' : 'text-pink-600'} text-lg`} />
                        </motion.div>
                        <span className="relative">
                            Community Guidelines
                            {!isMobile && (
                                <motion.div
                                    className={`absolute -inset-1 bg-gradient-to-r ${
                                        isDark
                                            ? 'from-indigo-400/0 via-purple-400/20 to-violet-400/0'
                                            : 'from-pink-600/0 via-rose-500/20 to-orange-500/0'
                                    } blur-sm -z-10`}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                            )}
                        </span>
                    </motion.h3>
                </motion.div>
                
                <motion.ul
                    className="space-y-3 text-sm"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {[
                        {
                            icon: FaHandsHelping,
                            title: "Be Respectful",
                            desc: "Engage in constructive criticism, not personal attacks.",
                            color: isDark ? 'text-indigo-400' : 'text-pink-500',
                            bg: isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'
                        },
                        {
                            icon: FaLightbulb,
                            title: "Share Knowledge",
                            desc: "Post content that is educational and insightful.",
                            color: isDark ? 'text-purple-400' : 'text-rose-500',
                            bg: isDark ? 'from-purple-500/10 to-violet-500/10' : 'from-rose-500/10 to-orange-500/10'
                        },
                        {
                            icon: FaBalanceScale,
                            title: "Intellectual Honesty",
                            desc: "Cite sources and do not spread misinformation.",
                            color: isDark ? 'text-violet-400' : 'text-orange-500',
                            bg: isDark ? 'from-violet-500/10 to-blue-500/10' : 'from-orange-500/10 to-amber-500/10'
                        },
                        {
                            icon: FaTimesCircle,
                            title: "No Spam or Hate Speech",
                            desc: "Hateful and logicless content will not be tolerated.",
                            color: 'text-red-400',
                            bg: 'from-red-500/10 to-pink-500/10'
                        }
                    ].map((item, index) => (
                        <motion.li
                            key={index}
                            variants={itemVariants}
                            className={`group relative overflow-hidden rounded-xl p-4 ${
                                isDark
                                    ? 'bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-white/20'
                                    : 'bg-gradient-to-r from-white/60 to-white/80 hover:from-white/80 hover:to-white/95 border border-pink-200/30 hover:border-pink-300/40'
                            } backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-lg`}
                            whileHover={isMobile ? undefined : { x: 4, y: -2 }}
                            transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <motion.div
                                className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${item.bg} transition-opacity duration-500`}
                            />
                            
                            <div className="relative z-10 flex items-start gap-3">
                                <motion.div
                                    className={`p-2 rounded-lg ${item.color} bg-current/10 backdrop-blur-sm flex-shrink-0 shadow-sm`}
                                    whileHover={isMobile ? undefined : { scale: 1.1, rotate: 5 }}
                                    transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <item.icon className={`${item.color} text-base lg:text-lg`} />
                                </motion.div>
                                
                                <div className="min-w-0 flex-1">
                                    <motion.h4
                                        className={`font-bold text-sm lg:text-base mb-1 ${
                                            isDark ? 'text-gray-200' : 'text-gray-700'
                                        } group-hover:${item.color.replace('text-', 'text-')} transition-colors duration-300`}
                                        whileHover={isMobile ? undefined : { x: 2 }}
                                    >
                                        {item.title}
                                    </motion.h4>
                                    <motion.p
                                        className={`text-xs lg:text-sm leading-relaxed ${
                                            isDark ? 'text-gray-400' : 'text-gray-600'
                                        } group-hover:text-opacity-90`}
                                        initial={{ opacity: 0.8 }}
                                        whileHover={isMobile ? undefined : { opacity: 1 }}
                                    >
                                        {item.desc}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </motion.div>

            {/* Footer Accent */}
            <motion.div
                className={`text-center pt-4 border-t border-dashed ${
                    isDark ? 'border-white/10' : 'border-pink-200/30'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={isMobile ? { duration: 0.3 } : { delay: 1, duration: 0.5 }}
            >
                <motion.p
                    className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-1`}
                    whileHover={isMobile ? undefined : { scale: 1.05 }}
                >
                    <FiShield className="w-3 h-3" />
                    Building a better community together
                    <HiSparkles className="w-3 h-3 animate-pulse" />
                </motion.p>
            </motion.div>
        </motion.aside>
    );
};

export default RightSidebar;