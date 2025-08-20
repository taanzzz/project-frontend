// 📁 File: src/pages/NotificationsPage.jsx

import { useEffect, useState } from 'react'
import useNotifications from '../hooks/useNotifications'
import axiosSecure from '../api/Axios'
import { Link } from 'react-router'; // Correct import for modern react-router
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import { motion } from 'framer-motion'

// --- Icons ---
import { FaUserPlus, FaHeart, FaComment } from 'react-icons/fa'
import { FiBell, FiBellOff } from "react-icons/fi";

// ✅ NotificationIcon component with theme-aware colors and gradients
const NotificationIcon = ({ type, isDark }) => {
    const iconClasses = "w-4 h-4";
    
    if (type === 'follow') return <FaUserPlus className={`${iconClasses} ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />;
    if (type === 'reaction') return <FaHeart className={`${iconClasses} ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />;
    if (type === 'comment') return <FaComment className={`${iconClasses} ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />;
    return <FiBell className={`${iconClasses} ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />;
};

const NotificationsPage = () => {
    const { notifications, unreadCount, isLoading, refetch } = useNotifications();
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

    useEffect(() => {
        if (unreadCount > 0) {
            axiosSecure.patch('/api/notifications/read').then(() => {
                refetch();
            });
        }
    }, [unreadCount, refetch]);

    // ✅ Notification link generation logic remains unchanged
    const getNotificationLink = (notif) => {
        if (notif.type === 'follow') {
            return `/profiles/${notif.senderInfo._id}`;
        }
        if (notif.type === 'comment' && notif.commentId) {
            return `/post/${notif.entityId}?highlight=${notif.commentId}`;
        }
        return `/post/${notif.entityId}`;
    };
    
    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-[calc(100vh-80px)]`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <div className="relative z-10 py-8 sm:py-12 px-4">
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} rounded-3xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01]`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    >
                        <motion.h1
                            className={`text-3xl font-extrabold tracking-tight mb-8 flex items-center gap-3 bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        >
                            <FiBell className={`${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            Notifications
                        </motion.h1>
                        
                        <div className="space-y-2">
                            {notifications.length > 0 ? (
                                notifications.map((notif, index) => (
                                    <motion.div
                                        key={notif._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 * index }}
                                    >
                                        <Link to={getNotificationLink(notif)} className="block">
                                            <motion.div
                                                className={`p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 ${!notif.read 
                                                    ? isDark 
                                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 shadow-indigo-500/20' 
                                                        : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/30 shadow-pink-500/20'
                                                    : isDark 
                                                        ? 'bg-white/5 border border-white/10 hover:bg-white/10' 
                                                        : 'bg-white/50 border border-pink-200/30 hover:bg-white/70'
                                                } backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-[1.02]`}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                
                                                {/* Avatar and Icon Overlay */}
                                                <div className="relative flex-shrink-0">
                                                    <div className="avatar">
                                                        <div className={`w-14 h-14 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                                                            <img src={notif.senderInfo.avatar} alt="sender avatar" />
                                                        </div>
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 ${isDark ? 'bg-gray-800' : 'bg-white'} p-2 rounded-full shadow-lg ${isDark ? 'border border-white/20' : 'border border-pink-200/50'}`}>
                                                        <NotificationIcon type={notif.type} isDark={isDark} />
                                                    </div>
                                                </div>

                                                {/* Message and Timestamp */}
                                                <div className='flex-grow'>
                                                    <p 
                                                        className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`} 
                                                        dangerouslySetInnerHTML={{ __html: notif.message }}
                                                    ></p>
                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                                                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>
                                                
                                                {/* Unread Indicator Dot */}
                                                {!notif.read && (
                                                    <motion.div
                                                        className={`w-3 h-3 rounded-full flex-shrink-0 ml-auto shadow-lg ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-400 to-rose-400'}`}
                                                        title="Unread"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                // Enhanced Empty State
                                <motion.div
                                    className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                                    >
                                        <FiBellOff className={`mx-auto text-8xl mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </motion.div>
                                    <motion.h2
                                        className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                                    >
                                        You're all caught up!
                                    </motion.h2>
                                    <motion.p
                                        className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                                    >
                                        New notifications will appear here.
                                    </motion.p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotificationsPage;