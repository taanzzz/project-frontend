// 📁 File: src/pages/Store/StoreHome.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { motion } from 'framer-motion';
import ProductCard from '../../components/Store/ProductCard'; // ✅ ইম্পোর্ট করা হয়েছে
import CategoryCard from '../../components/Store/CategoryCard'; // ✅ ইম্পোর্ট করা হয়েছে

const StoreHome = () => {
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

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => (await axiosSecure.get('/api/products')).data
    });

    if (isLoading) return <LoadingSpinner />;

    const bestSellers = products.filter(p => p.tags?.includes('bestseller'));
    const categories = [
        { name: 'Books', link: '/store/books', imageUrl: 'https://i.imgur.com/gA2y6P6.jpg' },
        { name: 'Apparel', link: '/store/apparel', imageUrl: 'https://i.imgur.com/Jz5l2Iq.jpg' },
        { name: 'Stationery', link: '/store/stationery', imageUrl: 'https://i.imgur.com/eBw6jF8.jpg' },
        { name: 'Affiliate Picks', link: '/store/affiliates', imageUrl: 'https://i.imgur.com/N6wE3p5.jpg' },
    ];

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isDark ? 'bg-blue-500/20' : 'bg-orange-300/15'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            {/* --- Hero Section --- */}
            <motion.div
                className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
            >
                {/* Hero Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img 
                        src="https://i.imgur.com/exampleHero.jpg" 
                        alt="Hero Background"
                        className="w-full h-full object-cover filter brightness-50 blur-sm scale-110"
                    />
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-gray-900/90 via-indigo-950/80 to-purple-950/70' : 'bg-gradient-to-t from-pink-900/80 via-rose-800/60 to-orange-700/50'}`} />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                    <motion.h1 
                        className={`mb-6 text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent text-shadow-lg ${isDark ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' : 'bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400'}`}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        The Stoic Collection
                    </motion.h1>
                    <motion.p 
                        className="mb-8 text-xl md:text-2xl text-gray-200 leading-relaxed text-shadow-sm"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        Reimagining consumerism through philosophy and design.
                    </motion.p>
                    <motion.button 
                        className={`btn btn-lg border-none text-white shadow-2xl rounded-2xl px-8 transition-all duration-300 ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30'}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Shop The Drop
                    </motion.button>
                </div>
            </motion.div>

            <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-20 space-y-24">
                {/* --- Best-Selling Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.h2 
                        className={`text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Best-Selling Insights
                    </motion.h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ 
                            visible: { 
                                transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
                            } 
                        }}
                    >
                        {bestSellers.map((product, index) => 
                            <motion.div 
                                key={product._id} 
                                variants={{ 
                                    hidden: { opacity: 0, y: 50, scale: 0.9 }, 
                                    visible: { opacity: 1, y: 0, scale: 1 } 
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.section>

                {/* --- Category Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <motion.h2 
                        className={`text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-rose-500 to-orange-500'}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Shop by Category
                    </motion.h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ 
                            visible: { 
                                transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
                            } 
                        }}
                    >
                        {categories.map((cat, index) => 
                            <motion.div
                                key={cat.name}
                                variants={{ 
                                    hidden: { opacity: 0, y: 50, scale: 0.9 }, 
                                    visible: { opacity: 1, y: 0, scale: 1 } 
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <CategoryCard category={cat} />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.section>
                
                {/* --- Enhanced Brand Philosophy Section --- */}
                <motion.section 
                    className="max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className={`relative overflow-hidden rounded-3xl shadow-2xl p-8 md:p-16 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} transition-all duration-300 hover:scale-[1.01]`}>
                        
                        {/* Enhanced Aurora Glow Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className={`absolute top-0 left-0 w-96 h-96 ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-400/20 to-rose-400/20'} rounded-full blur-3xl animate-pulse`} />
                            <div className={`absolute bottom-0 right-0 w-96 h-96 ${isDark ? 'bg-gradient-to-tl from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-tl from-rose-400/20 to-orange-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
                            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isDark ? 'bg-gradient-to-r from-blue-400/10 to-indigo-400/10' : 'bg-gradient-to-r from-orange-300/15 to-pink-300/15'} rounded-full blur-3xl animate-pulse delay-2000`} />
                        </div>

                        <div className="relative z-10 text-center">
                            <motion.h2 
                                className={`text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-8 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                            >
                                <span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' : 'bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600'}`}>
                                    "True value is not in the possession but in the perspective. It is the mind not the myth of materialism, that defines our reality."
                                </span>
                            </motion.h2>
                            
                            <motion.p 
                                className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-500'} italic font-medium`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                            >
                                <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span> Mind Over Myth
                            </motion.p>

                            {/* Decorative Elements */}
                            <motion.div 
                                className="flex justify-center items-center gap-4 mt-8"
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                            >
                                <div className={`w-16 h-[2px] ${isDark ? 'bg-gradient-to-r from-transparent via-indigo-400 to-transparent' : 'bg-gradient-to-r from-transparent via-pink-400 to-transparent'}`} />
                                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-400'}`} />
                                <div className={`w-16 h-[2px] ${isDark ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-400 to-transparent'}`} />
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default StoreHome;