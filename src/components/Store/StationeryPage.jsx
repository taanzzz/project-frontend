import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import ProductCard from '../../components/Store/ProductCard';
import { motion } from 'framer-motion';

const StationeryPage = () => {
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

    // Fetching only products from the 'Stationery' category
    const { data: stationeryProducts = [], isLoading } = useQuery({
        queryKey: ['stationery-category'],
        queryFn: async () => (await axiosSecure.get('/api/products/category/Stationery')).data
    });

    if (isLoading) return <LoadingSpinner />;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.div
            className={`${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-100'} min-h-screen transition-all duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* --- Cinematic Hero Section --- */}
            <div
                className="hero min-h-[60vh]"
                style={{ backgroundImage: 'url(https://i.imgur.com/eBw6jF8.jpg)' }}
            >
                <div className={`hero-overlay ${isDark ? 'bg-gradient-to-br from-indigo-500/70 to-purple-500/70' : 'bg-gradient-to-br from-pink-500/70 to-rose-500/70'} backdrop-blur-sm`}></div>
                <div className="hero-content text-center text-white">
                    <motion.div
                        className="max-w-2xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className={`mb-5 text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}>
                            Tools for Thought
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            From premium journals to elegant pens, discover the perfect tools to capture your ideas, structure your thoughts, and inspire creativity.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {stationeryProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default StationeryPage;