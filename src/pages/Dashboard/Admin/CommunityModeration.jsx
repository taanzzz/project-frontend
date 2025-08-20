import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { FaFlag, FaCheckCircle, FaUserNinja, FaClock, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns';

// CaseCard Component
const CaseCard = ({ item, onReview, isDark }) => {
    const report = item.reports[0];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`group relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border rounded-3xl shadow-lg transition-all duration-300 overflow-hidden`}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                    <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                        {item.contentType === 'post' ? 'Post Report' : 'Comment Report'}
                    </h2>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'}`}>
                        <FaFlag className="text-xs" />
                        {report.reason}
                    </div>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                    {item.content || item.comment || "Sticker"}
                </p>
                <div className={`border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} pt-4 mb-4`}>
                    <div className="space-y-2">
                        <p className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <FaUser className={`text-sm ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            <span className="font-semibold">{item.authorInfo.name}</span>
                        </p>
                        <p className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FaClock className={`text-sm ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <motion.button 
                    onClick={() => onReview(item)} 
                    className={`w-full btn border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Review Case
                </motion.button>
            </div>
        </motion.div>
    );
};

// ReviewModal Component
const ReviewModal = ({ item, isOpen, onClose, onAction, isDark }) => {
    if (!isOpen || !item) return null;

    return (
        <motion.div 
            className="modal modal-open fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className={`relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg w-full max-w-lg p-6`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    Review Reported Content
                </h3>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'} mb-4`}>
                    <p className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Content:
                    </p>
                    <p className={`italic text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        "{item.content || item.comment}"
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <motion.button 
                        onClick={() => onAction('dismiss', item)} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Dismiss Report
                    </motion.button>
                    <motion.button 
                        onClick={() => onAction('delete', item)} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Delete Content
                    </motion.button>
                    <motion.button 
                        onClick={onClose} 
                        className={`btn btn-sm ${isDark ? 'btn-ghost text-gray-300 hover:bg-white/20' : 'btn-ghost text-gray-600 hover:bg-white/90'} rounded-xl`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Close
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// CommunityModeration Component
const CommunityModeration = () => {
    const [selectedCase, setSelectedCase] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const queryClient = useQueryClient();

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

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['moderation-stats'],
        queryFn: async () => (await axiosSecure.get('/api/moderation/stats')).data,
    });

    const { data: reportedData, isLoading: reportsLoading } = useQuery({
        queryKey: ['reported-content'],
        queryFn: async () => (await axiosSecure.get('/api/moderation/reports')).data,
    });

    const moderationMutation = useMutation({
        mutationFn: ({ action, contentId, contentType }) => {
            const url = action === 'delete' ? '/api/moderation/delete' : '/api/moderation/dismiss';
            return axiosSecure.post(url, { contentId, contentType });
        },
        onSuccess: (data) => {
            Swal.fire('Success!', data.data.message, 'success');
            queryClient.invalidateQueries({ queryKey: ['moderation-stats'] });
            queryClient.invalidateQueries({ queryKey: ['reported-content'] });
            setSelectedCase(null);
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const handleAction = (action, item) => {
        moderationMutation.mutate({ action, contentId: item._id, contentType: item.contentType });
    };

    const allReports = useMemo(() => {
        if (!reportedData) return [];
        const posts = reportedData.posts.map(p => ({ ...p, contentType: 'post' }));
        const comments = reportedData.comments.map(c => ({ ...c, contentType: 'comment' }));
        return [...posts, ...comments].sort((a, b) => new Date(b.reports[0].createdAt) - new Date(a.reports[0].createdAt));
    }, [reportedData]);

    if (statsLoading || reportsLoading) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 to-indigo-950' : 'bg-gradient-to-br from-pink-50 to-rose-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-20 left-1/3 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-40 right-1/4 w-80 h-80 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/3 right-10 w-64 h-64 ${isDark ? 'bg-pink-500/20' : 'bg-orange-400/15'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            <div className="relative p-4 sm:p-8 z-10">
                <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    className="text-center md:text-left mb-8"
>
    {/* মূল পরিবর্তনটি এই h1 ট্যাগের মধ্যেই করা হয়েছে।
      মোবাইলের জন্য flex-col এবং ডেস্কটপের জন্য md:flex-row ব্যবহার করা হয়েছে।
    */}
    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} flex flex-col items-center md:flex-row md:items-center gap-4`}>
        <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} rounded-2xl mb-3 md:mb-0`}>
            <FaFlag className={`text-3xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
        </div>
        <span>Community Moderation Center</span>
    </h1>
    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4 text-base md:text-lg font-medium`}>
        Manage and review reported content across the platform.
    </p>
</motion.div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        { 
                            title: 'Total Open Reports', 
                            value: stats?.totalOpenReports || 0, 
                            icon: FaFlag, 
                            color: isDark ? 'from-red-500 to-rose-500' : 'from-rose-500 to-red-500',
                            iconBg: isDark ? 'bg-red-500/20' : 'bg-rose-500/20',
                            iconColor: isDark ? 'text-red-400' : 'text-rose-500'
                        },
                        { 
                            title: 'Resolved Today', 
                            value: stats?.resolvedToday || 0, 
                            icon: FaCheckCircle, 
                            color: isDark ? 'from-emerald-500 to-teal-500' : 'from-teal-500 to-cyan-500',
                            iconBg: isDark ? 'bg-emerald-500/20' : 'bg-teal-500/20',
                            iconColor: isDark ? 'text-emerald-400' : 'text-teal-500'
                        },
                        { 
                            title: 'Most Reported User', 
                            value: 'Coming Soon', 
                            icon: FaUserNinja, 
                            color: isDark ? 'from-amber-500 to-orange-500' : 'from-orange-500 to-amber-500',
                            iconBg: isDark ? 'bg-amber-500/20' : 'bg-orange-500/20',
                            iconColor: isDark ? 'text-amber-400' : 'text-orange-500'
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            className={`relative group p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'} mt-2`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`p-4 ${stat.iconBg} rounded-2xl ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="text-2xl" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Report Queue */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        <FaFlag className={`text-2xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        Report Queue
                    </h2>
                    <AnimatePresence mode="wait">
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            {allReports.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                                >
                                    <CaseCard 
                                        item={item} 
                                        onReview={setSelectedCase}
                                        isDark={isDark}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                    {allReports.length === 0 && (
                        <motion.div 
                            className="text-center py-20"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            <div className={`w-24 h-24 mx-auto ${isDark ? 'bg-white/10' : 'bg-pink-500/20'} rounded-full flex items-center justify-center mb-6`}>
                                <FaFlag className={`text-4xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                The report queue is clear!
                            </h3>
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No active reports to review at the moment. Great job!
                            </p>
                        </motion.div>
                    )}
                </motion.div>

                <ReviewModal 
                    isOpen={!!selectedCase} 
                    item={selectedCase}
                    onClose={() => setSelectedCase(null)}
                    onAction={handleAction}
                    isDark={isDark}
                />
            </div>
        </div>
    );
};

export default CommunityModeration;