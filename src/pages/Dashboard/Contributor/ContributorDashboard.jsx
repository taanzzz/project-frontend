// 📁 File: src/pages/Dashboard/Contributor/ContributorDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';
import { FaPlusSquare, FaListAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTrophy, FaChartLine } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

const ContributorDashboard = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Theme synchronization
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

    const { data: stats, isLoading } = useQuery({
        queryKey: ['contributor-stats'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/dashboard/contributor');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    const chartData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
            {
                label: 'Content Status',
                data: [stats?.approvedContent || 0, stats?.pendingContent || 0, stats?.rejectedContent || 0],
                backgroundColor: isDark 
                    ? ['rgba(0, 0, 0, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)']
                    : ['rgba(0, 0, 0, 0.9)', 'rgba(245, 158, 11, 0.9)', 'rgba(239, 68, 68, 0.9)'],
                borderColor: isDark 
                    ? ['rgba(0, 0, 0, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)']
                    : ['rgba(0, 0, 0, 2)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    font: {
                        size: 14,
                        weight: '500',
                    },
                    padding: 20,
                },
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#f3f4f6' : '#111827',
                bodyColor: isDark ? '#d1d5db' : '#374151',
                borderColor: isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(236, 72, 153, 0.3)',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        cutout: '65%',
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: 'easeOut'
            }
        }
    };

    return (
        <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'}`}>
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/10'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/10'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isDark ? 'bg-indigo-400/10' : 'bg-pink-300/8'} rounded-full blur-3xl animate-pulse delay-500`} />
            </div>

            <motion.div 
                className="relative z-10 p-4 sm:p-8 space-y-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div 
                    variants={itemVariants}
                    className={`text-center p-8 rounded-3xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} backdrop-blur-md border shadow-2xl`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
                            <FaTrophy className="text-white text-2xl" />
                        </div>
                        <h1 className={`text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                            Contributor Dashboard
                        </h1>
                    </div>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
                        Your content creation hub. Track progress and manage your submissions with powerful analytics.
                    </p>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <motion.div 
                        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
                                    <FaChartLine className="text-white text-xl" />
                                </div>
                                <div className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}>
                                    {stats?.totalSubmissions || 0}
                                </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-2`}>
                                Total Submissions
                            </h3>
                            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                All your content submissions
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                                    <FaCheckCircle className="text-white text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-green-500">
                                    {stats?.approvedContent || 0}
                                </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-2`}>
                                Approved
                            </h3>
                            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Successfully approved content
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 shadow-lg">
                                    <FaHourglassHalf className="text-white text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-yellow-500">
                                    {stats?.pendingContent || 0}
                                </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-2`}>
                                Pending
                            </h3>
                            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Awaiting review
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        className={`relative overflow-hidden rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
                                    <FaTimesCircle className="text-white text-xl" />
                                </div>
                                <div className="text-3xl font-bold text-red-500">
                                    {stats?.rejectedContent || 0}
                                </div>
                            </div>
                            <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-2`}>
                                Rejected
                            </h3>
                            <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Needs improvement
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart and Quick Actions */}
                    <motion.div 
                        variants={itemVariants}
                        className={`lg:col-span-1 rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl p-8 space-y-8`}
                    >
                        <div>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6`}>
                                Content Status Overview
                            </h3>
                            <div className="h-64 relative">
                                <Doughnut data={chartData} options={chartOptions} />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}>
                                            {stats?.totalSubmissions || 0}
                                        </div>
                                        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Total
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} pt-8`}>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6`}>
                                Quick Actions
                            </h3>
                            <div className="space-y-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link 
                                        to="/dashboard/add-content" 
                                        className={`btn w-full border-none text-white text-lg ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-2xl shadow-lg transition-all duration-300`}
                                    >
                                        <FaPlusSquare className="text-xl" /> Submit New Content
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Link 
                                        to="/dashboard/my-content" 
                                        className={`btn w-full ${isDark ? 'btn-outline border-indigo-400 text-indigo-400 hover:bg-indigo-500 hover:border-indigo-500' : 'btn-outline border-pink-400 text-pink-500 hover:bg-pink-500 hover:border-pink-500'} rounded-2xl text-lg transition-all duration-300`}
                                    >
                                        <FaListAlt className="text-xl" /> Manage My Content
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
    variants={itemVariants}
    className={`lg:col-span-2 rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl p-6 lg:p-8`}
>
    <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6 text-center lg:text-left`}>
        Recent Activity
    </h3>

    {/* ===== Desktop View: Table (Visible on lg screens and up) ===== */}
    <div className="hidden lg:block overflow-x-auto">
        <table className="table w-full">
            {/* Table head */}
            <thead>
                <tr className={`${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                    <th className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-semibold text-base`}>Title</th>
                    <th className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-semibold text-base`}>Status</th>
                    <th className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-semibold text-base`}>Date</th>
                </tr>
            </thead>
            <tbody>
                {stats?.recentActivity?.map((activity, index) => (
                    <motion.tr
                        key={activity._id}
                        className={`hover:bg-opacity-50 ${isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-pink-100/50 border-pink-200/30'} transition-colors duration-200`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <td className={`${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                            {activity.title}
                        </td>
                        <td>
                            <span className={`badge px-4 py-2 rounded-full text-white font-medium ${
                                activity.status === 'approved'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                activity.status === 'pending'
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                    'bg-gradient-to-r from-red-500 to-rose-500'
                            }`}>
                                {activity.status}
                            </span>
                        </td>
                        <td className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {format(new Date(activity.createdAt), 'dd MMM, yyyy')}
                        </td>
                    </motion.tr>
                ))}
            </tbody>
        </table>
    </div>

    {/* ===== Mobile View: Cards (Visible on screens smaller than lg) ===== */}
    <div className="block lg:hidden space-y-4">
        {stats?.recentActivity?.map((activity, index) => (
            <motion.div
                key={activity._id}
                className={`rounded-2xl p-4 shadow-lg ${isDark ? 'bg-gray-800/50 border border-white/10' : 'bg-white/90 border border-pink-100/80'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
            >
                <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                    {activity.title}
                </h4>
                <div className="flex justify-between items-center">
                    <span className={`badge px-3 py-1 rounded-full text-white text-sm font-medium ${
                        activity.status === 'approved'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        activity.status === 'pending'
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                            'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}>
                        {activity.status}
                    </span>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {format(new Date(activity.createdAt), 'dd MMM, yyyy')}
                    </p>
                </div>
            </motion.div>
        ))}
    </div>

</motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ContributorDashboard;