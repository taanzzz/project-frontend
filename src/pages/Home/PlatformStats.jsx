import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaComments, FaSpa } from 'react-icons/fa';
import CountUp from 'react-countup';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const PlatformStats = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Sync theme with localStorage changes
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
        queryKey: ['platform-stats'],
        queryFn: async () => (await axiosSecure.get('/api/home/platform-stats')).data
    });

    if (isLoading) return <LoadingSpinner />;

    const chartData = {
        labels: ['Community Posts', 'Library Books', 'Mindfulness Sessions', 'Total Members'],
        datasets: [
            {
                label: 'Platform Engagement',
                data: [
                    stats?.totalPosts || 0,
                    stats?.totalBooks || 0,
                    stats?.totalSessions || 0,
                    stats?.totalUsers || 0,
                ],
                backgroundColor: isDark ? 'hsla(250, 70%, 50%, 0.3)' : 'hsla(340, 80%, 60%, 0.3)',
                borderColor: isDark ? 'hsl(250, 70%, 50%)' : 'hsl(340, 80%, 60%)',
                borderWidth: 3,
                pointBackgroundColor: isDark ? 'hsl(250, 70%, 50%)' : 'hsl(340, 80%, 60%)',
                pointBorderColor: isDark ? '#fff' : '#1f2937',
                pointHoverBackgroundColor: isDark ? '#fff' : '#1f2937',
                pointHoverBorderColor: isDark ? 'hsl(250, 70%, 50%)' : 'hsl(340, 80%, 60%)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { color: isDark ? 'hsla(250, 20%, 70%, 0.3)' : 'hsla(340, 20%, 40%, 0.3)' },
                grid: { color: isDark ? 'hsla(250, 20%, 70%, 0.3)' : 'hsla(340, 20%, 40%, 0.3)' },
                pointLabels: { 
                    font: { size: 16, weight: '600' }, 
                    color: isDark ? 'hsl(250, 20%, 90%)' : 'hsl(340, 20%, 20%)' 
                },
                ticks: { 
                    backdropColor: 'transparent', 
                    color: isDark ? 'hsl(250, 20%, 90%)' : 'hsl(340, 20%, 20%)', 
                    stepSize: 100 
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? 'hsla(250, 70%, 50%, 0.9)' : 'hsla(340, 80%, 60%, 0.9)',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className={`relative py-24 overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`}></div>
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 relative z-10">
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className={`text-5xl font-extrabold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Our Universe in Numbers
                    </h2>
                    <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4 max-w-2xl mx-auto`}>
                        Discover the vibrant community of thinkers and seekers shaping our platform.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side: Animated Counters */}
                    <div className="grid grid-cols-2 gap-8">
                        {[
                            { value: stats?.totalUsers, label: 'Community Members', color: isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500', icon: FaUsers },
                            { value: stats?.totalBooks, label: 'Books & Audiobooks', color: isDark ? 'from-purple-500 to-pink-500' : 'from-rose-500 to-pink-500', icon: FaBookOpen },
                            { value: stats?.totalPosts, label: 'Discussions Started', color: isDark ? 'from-blue-500 to-cyan-500' : 'from-pink-600 to-rose-600', icon: FaComments },
                            { value: stats?.totalSessions, label: 'Mindful Sessions', color: isDark ? 'from-pink-500 to-red-500' : 'from-rose-600 to-pink-600', icon: FaSpa },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className={`text-center p-8 ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90 shadow-[0_0_15px_rgba(244,114,182,0.3)] hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]'} rounded-3xl border transition-all duration-300 hover:scale-[1.02]`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <item.icon className={`text-3xl mx-auto mb-3 ${isDark ? 'text-indigo-300' : 'text-pink-400'}`} />
                                <p className={`text-5xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                    <CountUp end={item.value || 0} duration={3} enableScrollSpy />+
                                </p>
                                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-3`}>{item.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side: Radar Chart */}
                    <motion.div 
                        className={`h-[400px] ${isDark ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md shadow-[0_0_15px_rgba(244,114,182,0.3)] hover:shadow-[0_0_20px_rgba(244,114,182,0.5)]'} rounded-3xl p-8 border transition-all duration-300 hover:scale-[1.02]`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <Radar data={chartData} options={chartOptions} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PlatformStats;