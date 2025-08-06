// 📁 File: src/pages/Store/AffiliatePicksPage.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import AffiliateProductCard from '../../components/Store/AffiliateProductCard';
import { motion } from 'framer-motion';

const AffiliatePicksPage = () => {
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
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 py-16">
                
                {/* --- Page Header --- */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Curated by Us
                    </h1>
                    <p className="text-lg mt-4 text-base-content/70 max-w-2xl mx-auto">
                        Discover a hand-picked selection of high-quality products from our trusted partners. Each item is chosen to complement your journey of mindful living and philosophical exploration.
                    </p>
                </motion.div>

                {/* --- Affiliate Products Grid --- */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {affiliateProducts.map(product => (
                        <AffiliateProductCard key={product._id} product={product} />
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default AffiliatePicksPage;