import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { FaUsers, FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

// ApplicationCard Component
const ApplicationCard = ({ application, onReview, isDark }) => {
    return (
        <motion.div 
            className={`group relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border rounded-3xl shadow-lg transition-all duration-300 overflow-hidden`}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                        <div className={`w-16 h-16 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                            <img src={application.image} alt={application.name} className="object-cover" />
                        </div>
                    </div>
                    <div>
                        <h2 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{application.name}</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{application.email}</p>
                    </div>
                </div>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                    Applied on: {format(new Date(application.contributorApplication.submittedAt), 'dd MMM, yyyy')}
                </p>
                <motion.button 
                    onClick={() => onReview(application)} 
                    className={`w-full btn border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Review Application
                </motion.button>
            </div>
        </motion.div>
    );
};

// ReviewApplicationModal Component
const ReviewApplicationModal = ({ application, isOpen, onClose, isDark }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ userId, action }) => axiosSecure.patch(`/api/applications/${userId}`, { action }),
        onSuccess: (data) => {
            Swal.fire('Success!', data.data.message, 'success');
            queryClient.invalidateQueries({ queryKey: ['pending-applications'] });
            onClose();
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const handleAction = (action) => {
        mutation.mutate({ userId: application._id, action });
    };

    if (!isOpen || !application) return null;

    return (
        <motion.div 
            className="modal modal-open fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                className={`relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg w-full max-w-2xl p-6`}
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
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    Review Contributor Application
                </h3>
                <div className="space-y-4">
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <strong>Applicant:</strong> {application.name} ({application.email})
                    </p>
                    <div>
                        <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            Reason to Join:
                        </p>
                        <blockquote className={`p-4 ${isDark ? 'bg-white/5' : 'bg-white/60'} rounded-xl italic text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {application.contributorApplication.reason}
                        </blockquote>
                    </div>
                    <div>
                        <p className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            Sample Work:
                        </p>
                        <a 
                            href={application.contributorApplication.sampleWorkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-500 hover:text-pink-400'} underline transition-colors duration-300`}
                        >
                            View Sample Work
                        </a>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                    <motion.button 
                        onClick={() => handleAction('reject')} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600' : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaTimes className="mr-2" /> Reject
                    </motion.button>
                    <motion.button 
                        onClick={() => handleAction('approve')} 
                        className={`btn btn-sm ${isDark ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'} border-none text-white rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCheck className="mr-2" /> Approve as Contributor
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ManageApplications Component
const ManageApplications = () => {
    const [selectedApp, setSelectedApp] = useState(null);
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

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['pending-applications'],
        queryFn: async () => (await axiosSecure.get('/api/applications/pending')).data,
    });

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
    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-4`}>
        <div className={`p-2 md:p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} rounded-2xl mb-3 md:mb-0`}>
            <FaUsers className={`text-2xl md:text-3xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
        </div>
        <span>Manage Contributor Applications</span>
    </h1>
    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4 text-base md:text-lg font-medium max-w-xl mx-auto md:mx-0`}>
        Review and approve applications for contributor roles.
    </p>
</motion.div>

                {/* Applications Grid */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        {applications.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                            >
                                <ApplicationCard 
                                    application={app} 
                                    onReview={setSelectedApp}
                                    isDark={isDark}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {applications.length === 0 && (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className={`w-24 h-24 mx-auto ${isDark ? 'bg-white/10' : 'bg-pink-500/20'} rounded-full flex items-center justify-center mb-6`}>
                            <FaUsers className={`text-4xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            No pending applications
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No contributor applications to review at the moment.
                        </p>
                    </motion.div>
                )}

                <ReviewApplicationModal 
                    isOpen={!!selectedApp} 
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    isDark={isDark}
                />
            </div>
        </div>
    );
};

export default ManageApplications;