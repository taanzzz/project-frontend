// 📁 File: src/pages/Store/StationeryPage.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import ProductCard from '../../components/Store/ProductCard';
import { motion } from 'framer-motion';

const StationeryPage = () => {
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
        <div className="bg-base-200">
            {/* --- Cinematic Hero Section --- */}
            <div className="hero min-h-[60vh]" style={{ backgroundImage: 'url(https://i.imgur.com/eBw6jF8.jpg)' }}>
                <div className="hero-overlay bg-gradient-to-br from-primary/70 to-secondary/70"></div>
                <div className="hero-content text-center text-neutral-content">
                    <motion.div 
                        className="max-w-2xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="mb-5 text-5xl md:text-6xl font-extrabold tracking-tight">Tools for Thought</h1>
                        <p className="mb-5 text-lg md:text-xl text-neutral-content/80">
                            From premium journals to elegant pens, discover the perfect tools to capture your ideas, structure your thoughts, and inspire creativity.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-16">
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
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
        </div>
    );
};

export default StationeryPage;