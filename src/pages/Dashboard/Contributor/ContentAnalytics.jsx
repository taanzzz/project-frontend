// 📁 File: src/pages/Dashboard/Contributor/ContentAnalytics.jsx

import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
// ✅ FaTrendingUp আইকনটি ইমপোর্ট থেকে সরানো হয়েছে
import { FaEye, FaBookmark, FaStar, FaHeadphones, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ContentAnalytics = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Theme sync with localStorage and data-theme
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

    const { data: analytics = [], isLoading, isError, error } = useQuery({
        queryKey: ['content-analytics'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/dashboard/contributor/analytics');
            return data;
        }
    });

    // সার্বিক পারফরম্যান্সের সারাংশ গণনা করা
    const overallStats = useMemo(() => {
        if (!analytics || !analytics.length) {
            return { totalViews: 0, totalListens: 0, totalBookmarks: 0, averageRating: 0 };
        }
        const totalViews = analytics.reduce((sum, item) => sum + (item.viewCount || 0), 0);
        const totalListens = analytics.reduce((sum, item) => sum + (item.listenCount || 0), 0);
        const totalBookmarks = analytics.reduce((sum, item) => sum + (item.bookmarkCount || 0), 0);
        const ratedItems = analytics.filter(item => typeof item.averageRating === 'number');
        const averageRating = ratedItems.reduce((sum, item) => sum + item.averageRating, 0) / (ratedItems.length || 1);

        return { totalViews, totalListens, totalBookmarks, averageRating };
    }, [analytics]);
    
    // চার্টের জন্য ডেটা প্রস্তুত করা
    const chartData = {
        labels: analytics.map(item => (item.title || 'Untitled').substring(0, 15) + '...'),
        datasets: [
            {
                label: 'Views',
                data: analytics.map(item => item.viewCount || 0),
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.8)' : 'rgba(236, 72, 153, 0.8)',
                borderColor: isDark ? 'rgba(99, 102, 241, 1)' : 'rgba(236, 72, 153, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Bookmarks',
                data: analytics.map(item => item.bookmarkCount || 0),
                backgroundColor: isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(244, 63, 94, 0.8)',
                borderColor: isDark ? 'rgba(168, 85, 247, 1)' : 'rgba(244, 63, 94, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    color: isDark ? '#e5e7eb' : '#374151',
                    font: { size: 12, family: 'Inter, sans-serif', weight: '500' }
                }
            },
            tooltip: {
                backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                titleColor: isDark ? '#f3f4f6' : '#111827',
                bodyColor: isDark ? '#d1d5db' : '#374151',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 12,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } }
            },
            y: {
                grid: { color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.8)' },
                ticks: { color: isDark ? '#9ca3af' : '#6b7280', font: { size: 11 } }
            }
        }
    };

    if (isLoading) return <LoadingSpinner />;

    if (isError) {
        console.error("Failed to load analytics data:", error);
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-red-400' : 'bg-red-50 text-red-600'}`}>
                <FaExclamationTriangle className="text-5xl mb-4" />
                <h2 className="text-2xl font-bold">Failed to Load Data</h2>
                <p className="mt-2">There was an error while fetching your content analytics. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50'} min-h-screen`}>
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <div className="relative z-10 p-4 sm:p-8 space-y-12">
                <motion.div
    className="text-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
>
    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
        <FaChartLine className="inline mr-2 sm:mr-4 text-2xl sm:text-3xl lg:text-4xl align-middle" />
        Content Analytics
    </h1>
    <p className={`text-base md:text-lg lg:text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Discover how your content resonates with readers worldwide
    </p>
</motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div 
                        className={`p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border transition-all duration-300 hover:scale-105 group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Reads</p>
                                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                    {overallStats.totalViews.toLocaleString()}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                <FaEye className="text-2xl" />
                            </div>
                        </div>
                        {/* ✅ FaTrendingUp আইকন এবং টেক্সট সরানো হয়েছে */}
                    </motion.div>

                    <motion.div 
                        className={`p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border transition-all duration-300 hover:scale-105 group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Listens</p>
                                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                    {overallStats.totalListens.toLocaleString()}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                <FaHeadphones className="text-2xl" />
                            </div>
                        </div>
                        {/* ✅ FaTrendingUp আইকন এবং টেক্সট সরানো হয়েছে */}
                    </motion.div>

                    <motion.div 
                        className={`p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border transition-all duration-300 hover:scale-105 group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Bookmarks</p>
                                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                    {overallStats.totalBookmarks.toLocaleString()}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-r from-indigo-400 to-cyan-400' : 'bg-gradient-to-r from-pink-400 to-red-400'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                <FaBookmark className="text-2xl" />
                            </div>
                        </div>
                        {/* ✅ FaTrendingUp আইকন এবং টেক্সট সরানো হয়েছে */}
                    </motion.div>

                    <motion.div 
                        className={`p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border transition-all duration-300 hover:scale-105 group`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Average Rating</p>
                                <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                    {overallStats.averageRating.toFixed(2)}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-amber-400 to-yellow-500'} text-white group-hover:scale-110 transition-transform duration-300`}>
                                <FaStar className="text-2xl" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            <div className="flex items-center text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`${i < Math.round(overallStats.averageRating) ? 'text-amber-500' : isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Performance Chart */}
                <motion.div
    className={`p-4 lg:p-8 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
>
    <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white`}>
            <FaChartLine className="text-xl" />
        </div>
        <h3 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
            Performance Overview
        </h3>
    </div>
    <div className="h-80 lg:h-96">
        {analytics.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
        ) : (
            <div className={`flex flex-col items-center justify-center h-full ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <FaChartLine className="text-4xl mb-4" />
                <p>No data to display in chart</p>
            </div>
        )}
    </div>
</motion.div>

                {/* Individual Content Breakdown */}
                <motion.div
    className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg border overflow-hidden`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
>
    {/* ===== Header ===== */}
    <div className={`p-4 lg:p-6 border-b ${isDark ? 'border-white/10' : 'border-pink-200/30'}`}>
        <h3 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
            Detailed Content Metrics
        </h3>
        <p className={`text-sm lg:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            Individual performance breakdown for each piece of content
        </p>
    </div>

    {/* ===== Content Body ===== */}
    <div>
        {analytics.length > 0 ? (
            <>
                {/* ===== Desktop View: Table (Visible on lg screens and up) ===== */}
                <div className="overflow-x-auto hidden lg:block">
                    <table className="w-full">
                        <thead>
                            <tr className={`${isDark ? 'bg-white/5' : 'bg-pink-50/50'} border-b ${isDark ? 'border-white/10' : 'border-pink-200/30'}`}>
                                <th className={`px-6 py-4 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Content Title</th>
                                <th className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reads</th>
                                <th className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Listens</th>
                                <th className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Bookmarks</th>
                                <th className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</th>
                                <th className={`px-6 py-4 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.map((item, index) => (
                                <motion.tr
                                    key={item._id}
                                    className={`border-b ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-pink-200/30 hover:bg-pink-50/50'} transition-all duration-200`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <td className="px-6 py-4">
                                        <div className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'} truncate max-w-xs`}>
                                            {item.title || 'Untitled'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-pink-100 text-pink-700'}`}>
                                            <FaEye className="text-xs" />
                                            {(item.viewCount || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-rose-100 text-rose-700'}`}>
                                            <FaHeadphones className="text-xs" />
                                            {(item.listenCount || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-blue-100 text-blue-700'}`}>
                                            <FaBookmark className="text-xs" />
                                            {(item.bookmarkCount || 0).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                            {(item.reviewCount || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex items-center text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`text-sm ${i < Math.round(item.averageRating || 0) ? 'text-amber-500' : isDark ? 'text-gray-700' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {(item.averageRating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== Mobile View: Cards (Visible on screens smaller than lg) ===== */}
                <div className="block lg:hidden p-4 space-y-4">
                    {analytics.map((item, index) => (
                        <motion.div
                            key={item._id}
                            className={`rounded-2xl p-4 shadow-md ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/90 border border-pink-100/80'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            {/* Card Header: Title */}
                            <h4 className={`font-bold text-lg mb-3 pb-3 border-b ${isDark ? 'text-gray-100 border-white/10' : 'text-gray-800 border-pink-200/30'}`}>
                                {item.title || 'Untitled'}
                            </h4>

                            {/* Card Body: Metrics Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                {/* Reads */}
                                <div className="flex items-center gap-2">
                                    <FaEye className={`${isDark ? 'text-indigo-300' : 'text-pink-600'}`} />
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reads:</span>
                                    <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{(item.viewCount || 0).toLocaleString()}</span>
                                </div>
                                {/* Listens */}
                                <div className="flex items-center gap-2">
                                    <FaHeadphones className={`${isDark ? 'text-purple-300' : 'text-rose-600'}`} />
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Listens:</span>
                                    <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{(item.listenCount || 0).toLocaleString()}</span>
                                </div>
                                {/* Bookmarks */}
                                <div className="flex items-center gap-2">
                                    <FaBookmark className={`${isDark ? 'text-cyan-300' : 'text-blue-600'}`} />
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Bookmarks:</span>
                                    <span className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{(item.bookmarkCount || 0).toLocaleString()}</span>
                                </div>
                                {/* Reviews */}
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>{(item.reviewCount || 0).toLocaleString()}</span>
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</span>
                                </div>
                            </div>
                            
                            {/* Card Footer: Rating */}
                            <div className="mt-4 pt-3 border-t flex items-center justify-between_ flex-wrap gap-2_">
                                <div className="flex items-center text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`text-base ${i < Math.round(item.averageRating || 0) ? 'text-amber-500' : isDark ? 'text-gray-700' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className={`text-base font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {(item.averageRating || 0).toFixed(1)}
                                    <span className="text-xs font-normal text-gray-400"> / 5.0</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </>
        ) : (
            // ===== Empty State (when no data) =====
            <div className={`text-center py-12 px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <FaChartLine className="text-4xl mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No analytics data available yet</p>
                <p className="text-sm">Start publishing content to see your performance metrics</p>
            </div>
        )}
    </div>
</motion.div>
            </div>
        </div>
    );
};

export default ContentAnalytics;