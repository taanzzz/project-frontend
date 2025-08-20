import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import AffiliateProductCard from '../../components/Store/AffiliateProductCard';
import { motion } from 'framer-motion';

const AffiliatePicksPage = () => {
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

    // Fetching only products from the 'Affiliate' category
    const { data: affiliateProducts = [], isLoading } = useQuery({
        queryKey: ['affiliate-products'],
        queryFn: async () => (await axiosSecure.get('/api/products/category/Affiliate')).data
    });

    if (isLoading) return <LoadingSpinner />;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <motion.div
            className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-100'} transition-all duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-16">
                {/* --- Page Header --- */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <h1 className={`text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}>
                        Curated by Us
                    </h1>
                    <p className={`text-lg mt-4 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Discover a hand-picked selection of high-quality products from our trusted partners. Each item is chosen to complement your journey of mindful living and philosophical exploration.
                    </p>
                </motion.div>

                {/* --- Affiliate Products Grid --- */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {affiliateProducts.map(product => (
                        <AffiliateProductCard key={product._id} product={product} />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AffiliatePicksPage;