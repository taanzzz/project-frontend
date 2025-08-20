import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { FaEye, FaBook, FaCheck, FaTimes, FaTrash, FaClock, FaUser } from "react-icons/fa";
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Format date helper function
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// ContentCaseCard Component
const ContentCaseCard = ({ item, onReview, isDark }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved': 
                return { 
                    text: 'Approved', 
                    color: isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
                    icon: FaCheck
                };
            case 'pending': 
                return { 
                    text: 'Pending', 
                    color: isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-500/20 text-amber-600 border-amber-500/30',
                    icon: FaClock
                };
            case 'rejected': 
                return { 
                    text: 'Rejected', 
                    color: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30',
                    icon: FaTimes
                };
            default: 
                return { 
                    text: 'Unknown', 
                    color: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-600',
                    icon: FaClock
                };
        }
    };
    const statusInfo = getStatusInfo(item.status);
    const StatusIcon = statusInfo.icon;

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
                <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                        className="relative overflow-hidden rounded-xl shadow-lg flex-shrink-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img 
                            src={item.coverImage} 
                            alt={item.title} 
                            className="w-20 h-28 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                    <div className="flex-grow min-w-0">
                        <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'} leading-tight mb-2 line-clamp-2`}>
                            {item.title}
                        </h2>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                            by <span className="font-semibold">{item.author}</span>
                        </p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                            <StatusIcon className="text-xs" />
                            {statusInfo.text}
                        </div>
                    </div>
                </div>

                <div className={`border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} pt-4 mb-4`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="avatar">
                            <div className={`w-8 h-8 rounded-full ring-2 ring-offset-1 ring-offset-transparent ${isDark ? 'ring-indigo-400/50' : 'ring-pink-400/50'}`}>
                                <img 
                                    src={item.authorInfo.avatar} 
                                    alt={item.authorInfo.name}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div>
                            <p className={`font-semibold text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                {item.authorInfo.name || 'N/A'}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Submitted: {formatDate(item.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                <motion.button 
                    onClick={() => onReview(item)} 
                    className={`w-full btn border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaEye className="mr-2" /> Review Details
                </motion.button>
            </div>
        </motion.div>
    );
};

// ContentReviewModal Component
const ContentReviewModal = ({ item, isOpen, onClose, onAction, isDark }) => {
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
                className={`relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg w-full max-w-4xl p-6`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <motion.button 
                    onClick={onClose} 
                    className={`absolute right-4 top-4 btn btn-sm btn-circle ${isDark ? 'btn-ghost text-gray-300 hover:bg-white/20' : 'btn-ghost text-gray-600 hover:bg-white/90'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ✕
                </motion.button>
                <h3 className={`font-bold text-2xl mb-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    {item.title}
                </h3>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    by {item.author}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Cover & Details */}
                    <div className="md:col-span-1">
                        <img 
                            src={item.coverImage} 
                            alt={item.title} 
                            className="w-full rounded-xl shadow-lg mb-4"
                        />
                        <div className="text-sm space-y-2">
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Contributor:</strong> {item.authorInfo.name}
                            </p>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Category:</strong> {item.category}
                            </p>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                <strong>Submitted:</strong> {format(new Date(item.createdAt), 'dd MMM, yyyy')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {item.type?.map(t => (
                                    <div 
                                        key={t} 
                                        className={`badge text-xs px-3 py-1 rounded-full ${isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-pink-500/20 text-pink-600 border-pink-500/30'}`}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content Preview & Actions */}
                    <div className="md:col-span-2">
                        <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            Description:
                        </p>
                        <p className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white/60'} rounded-xl mb-4 text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {item.description}
                        </p>
                        
                        {item.flipbookEmbedCode && (
                            <>
                                <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                    Flipbook Preview:
                                </p>
                                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                                    <iframe 
                                        src={item.flipbookEmbedCode} 
                                        width="100%" 
                                        height="100%" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={`flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-4 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                    <motion.button 
                        onClick={() => onAction('delete', item._id)} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaTrash className="mr-2" /> Delete
                    </motion.button>
                    <motion.button 
                        onClick={() => onAction('rejected', item._id)} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaTimes className="mr-2" /> Reject
                    </motion.button>
                    <motion.button 
                        onClick={() => onAction('approved', item._id)} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCheck className="mr-2" /> Approve
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ManageContent Component
const ManageContent = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState('pending');
    const [selectedContent, setSelectedContent] = useState(null);
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

    const { data: content = [], isLoading } = useQuery({
        queryKey: ['all-content-admin'],
        queryFn: async () => (await axiosSecure.get('/api/content/admin/all')).data
    });

    const statusMutation = useMutation({
        mutationFn: ({ contentId, status }) => axiosSecure.patch(`/api/content/admin/status/${contentId}`, { status }),
        onSuccess: (data, variables) => {
            Swal.fire('Success!', `Content has been ${variables.status}!`, 'success');
            queryClient.invalidateQueries({ queryKey: ['all-content-admin'] });
            setSelectedContent(null);
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: (contentId) => axiosSecure.delete(`/api/content/admin/delete/${contentId}`),
        onSuccess: (data) => {
            Swal.fire('Deleted!', data.data.message, 'success');
            queryClient.invalidateQueries({ queryKey: ['all-content-admin'] });
            setSelectedContent(null);
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const handleAction = (action, contentId) => {
        if (action === 'delete') {
            Swal.fire({
                title: 'Are you sure?',
                text: "This will permanently delete the content!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                confirmButtonColor: isDark ? '#ef4444' : '#f87171',
                cancelButtonColor: isDark ? '#6b7280' : '#9ca3af',
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteMutation.mutate(contentId);
                }
            });
        } else {
            statusMutation.mutate({ contentId, status: action });
        }
    };

    const filteredContent = useMemo(() => {
        if (filter === 'all') return content;
        return content.filter(item => item.status === filter);
    }, [content, filter]);

    const filterTabs = [
        { key: 'pending', label: 'Pending', icon: FaClock, count: content.filter(c => c.status === 'pending').length },
        { key: 'approved', label: 'Approved', icon: FaCheck, count: content.filter(c => c.status === 'approved').length },
        { key: 'rejected', label: 'Rejected', icon: FaTimes, count: content.filter(c => c.status === 'rejected').length },
        { key: 'all', label: 'All', icon: FaBook, count: content.length }
    ];

    if (isLoading) return <LoadingSpinner />;

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
                    <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} flex items-center gap-4`}>
                        <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} rounded-2xl`}>
                            <FaBook className={`text-3xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        </div>
                        Manage Content
                    </h1>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-3 text-lg font-medium`}>
                        Review and manage all submitted content across the platform.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className="flex flex-wrap justify-center gap-3">
                        {filterTabs.map((tab, index) => {
                            const TabIcon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                                        filter === tab.key
                                            ? isDark 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                                            : isDark
                                                ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                                                : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-pink-200/50'
                                    } backdrop-blur-md`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 + (index * 0.1) }}
                                >
                                    <TabIcon className="text-sm" />
                                    <span>{tab.label}</span>
                                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        filter === tab.key 
                                            ? 'bg-white/20 text-white' 
                                            : isDark 
                                                ? 'bg-indigo-500/20 text-indigo-400'
                                                : 'bg-pink-500/20 text-pink-600'
                                    }`}>
                                        {tab.count}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Content Grid */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={filter}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        {filteredContent.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                            >
                                <ContentCaseCard 
                                    item={item} 
                                    onReview={setSelectedContent}
                                    isDark={isDark}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredContent.length === 0 && (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className={`w-24 h-24 mx-auto ${isDark ? 'bg-white/10' : 'bg-pink-500/20'} rounded-full flex items-center justify-center mb-6`}>
                            <FaBook className={`text-4xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            No content found
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No content matches the current filter criteria.
                        </p>
                    </motion.div>
                )}

                <ContentReviewModal
                    isOpen={!!selectedContent}
                    item={selectedContent}
                    onClose={() => setSelectedContent(null)}
                    onAction={handleAction}
                    isDark={isDark}
                />
            </div>
        </div>
    );
};

export default ManageContent;