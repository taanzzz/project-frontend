// 📁 File: src/pages/Dashboard/Admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { FaUsers, FaBook, FaHourglassHalf, FaShoppingBag, FaChartPie, FaClock } from "react-icons/fa";
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// Format date helper function
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
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

    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/admin-dashboard/overview');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    const chartData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [
            {
                data: [
                    (stats?.totalContent - stats?.pendingApprovals) || 0, 
                    stats?.pendingApprovals || 0,
                    0
                ],
                backgroundColor: isDark 
                    ? ['#6366f1', '#f59e0b', '#ef4444']
                    : ['#ec4899', '#f97316', '#ef4444'],
                borderColor: isDark ? '#1e293b' : '#ffffff',
                borderWidth: 3,
                hoverBackgroundColor: isDark 
                    ? ['#8b5cf6', '#fbbf24', '#f87171']
                    : ['#f472b6', '#fb923c', '#f87171'],
                hoverBorderWidth: 4,
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
                    color: isDark ? '#e2e8f0' : '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#e2e8f0' : '#374151',
                bodyColor: isDark ? '#cbd5e1' : '#6b7280',
                borderColor: isDark ? '#475569' : '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                displayColors: true,
                boxPadding: 6
            }
        },
        cutout: '65%',
        elements: {
            arc: {
                borderRadius: 8
            }
        }
    };

    const statCards = [
        { 
            title: 'Total Users', 
            value: stats?.totalUsers, 
            icon: FaUsers, 
            color: isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500',
            iconBg: isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20',
            iconColor: isDark ? 'text-indigo-400' : 'text-pink-500'
        },
        { 
            title: 'Total Content', 
            value: stats?.totalContent, 
            icon: FaBook, 
            color: isDark ? 'from-purple-500 to-pink-500' : 'from-rose-500 to-orange-500',
            iconBg: isDark ? 'bg-purple-500/20' : 'bg-rose-500/20',
            iconColor: isDark ? 'text-purple-400' : 'text-rose-500'
        },
        { 
            title: 'Pending Approvals', 
            value: stats?.pendingApprovals, 
            icon: FaHourglassHalf, 
            color: isDark ? 'from-amber-500 to-orange-500' : 'from-orange-500 to-amber-500',
            iconBg: isDark ? 'bg-amber-500/20' : 'bg-orange-500/20',
            iconColor: isDark ? 'text-amber-400' : 'text-orange-500'
        },
        { 
            title: 'Total Orders', 
            value: stats?.totalOrders, 
            icon: FaShoppingBag, 
            color: isDark ? 'from-emerald-500 to-teal-500' : 'from-teal-500 to-cyan-500',
            iconBg: isDark ? 'bg-emerald-500/20' : 'bg-teal-500/20',
            iconColor: isDark ? 'text-emerald-400' : 'text-teal-500'
        }
    ];

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 to-indigo-950' : 'bg-gradient-to-br from-pink-50 to-rose-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-10 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-1/3 w-80 h-80 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/3 right-10 w-64 h-64 ${isDark ? 'bg-pink-500/20' : 'bg-orange-400/15'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            <div className="relative p-4 sm:p-8 space-y-12 z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center md:text-left"
                >
                    <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Admin Dashboard
                    </h1>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-3 text-lg font-medium`}>
                        A complete overview of the Mind Over Myth platform.
                    </p>
                </motion.div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            className={`relative group p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border rounded-3xl shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden`}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'} mt-2`}>
                                        {stat.value?.toLocaleString() || '0'}
                                    </p>
                                </div>
                                <div className={`p-4 ${stat.iconBg} rounded-2xl ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="text-2xl" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart */}
                    <motion.div 
                        className={`lg:col-span-1 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border p-6 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} rounded-xl`}>
                                <FaChartPie className={`text-xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            </div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                Content Status
                            </h3>
                        </div>
                        <div className="h-64 mt-4 flex items-center justify-center">
                            <div className="w-full h-full">
                                <Doughnut data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Users Table */}
                    <motion.div
    className={`lg:col-span-2 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border p-4 lg:p-6 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.01]`}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
>
    <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 ${isDark ? 'bg-purple-500/20' : 'bg-rose-500/20'} rounded-xl`}>
            <FaClock className={`text-xl ${isDark ? 'text-purple-400' : 'text-rose-500'}`} />
        </div>
        <h3 className={`text-lg lg:text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
            Recent Registrations
        </h3>
    </div>

    {/* ===== Content Area ===== */}
    <div>
        {/* ===== Desktop View: Table (Visible on lg screens and up) ===== */}
        <div className="overflow-x-auto hidden lg:block">
            <table className="w-full">
                <thead>
                    <tr className={`${isDark ? 'border-white/20' : 'border-pink-200/50'} border-b`}>
                        <th className={`text-left py-3 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm uppercase tracking-wide`}>
                            Name
                        </th>
                        <th className={`text-left py-3 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm uppercase tracking-wide`}>
                            Email
                        </th>
                        <th className={`text-left py-3 px-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm uppercase tracking-wide`}>
                            Registration Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stats?.recentUsers?.length > 0 ? (
                        stats.recentUsers.map((user, index) => (
                            <motion.tr
                                key={user._id}
                                className={`${isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-white/60 border-pink-200/30'} border-b transition-all duration-300`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.8 + (index * 0.1) }}
                            >
                                <td className={`py-4 px-4 ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                                    {user.name}
                                </td>
                                <td className={`py-4 px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {user.email}
                                </td>
                                <td className={`py-4 px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-pink-500/20 text-pink-600'}`}>
                                        {formatDate(user.createdAt)}
                                    </div>
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className={`py-8 px-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No recent users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* ===== Mobile View: Cards (Visible on screens smaller than lg) ===== */}
        <div className="block lg:hidden space-y-3">
            {stats?.recentUsers?.length > 0 ? (
                stats.recentUsers.map((user, index) => (
                    <motion.div
                        key={user._id}
                        className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                    >
                        <p className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{user.name}</p>
                        <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-pink-500/20 text-pink-600'}`}>
                            {formatDate(user.createdAt)}
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No recent users found
                </div>
            )}
        </div>
    </div>
</motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;