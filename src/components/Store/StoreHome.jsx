// 📁 File: src/pages/Store/StoreHome.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { motion } from 'framer-motion';
import ProductCard from '../../components/Store/ProductCard'; // ✅ ইম্পোর্ট করা হয়েছে
import CategoryCard from '../../components/Store/CategoryCard'; // ✅ ইম্পোর্ট করা হয়েছে

const StoreHome = () => {
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
        <div className="bg-base-200">
            {/* --- Hero Section --- */}
            <div className="hero min-h-[70vh]" style={{ backgroundImage: 'url(https://i.imgur.com/exampleHero.jpg)' }}>
                <div className="hero-overlay bg-black/50"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <motion.h1 
                            className="mb-5 text-5xl font-bold text-shadow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            The Stoic Collection
                        </motion.h1>
                        <motion.p 
                            className="mb-5 text-shadow-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            Reimagining consumerism through philosophy and design.
                        </motion.p>
                        <motion.button 
                            className="btn border-none text-white bg-gradient-to-r from-primary to-secondary"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            Shop The Drop
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-20 space-y-20">
                {/* --- Best-Selling Section --- */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Best-Selling Insights</h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {bestSellers.map(product => 
                            <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <ProductCard product={product} />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.section>

                {/* --- Category Section --- */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Shop by Category</h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {categories.map(cat => <CategoryCard key={cat.name} category={cat} />)}
                    </motion.div>
                </motion.section>
                
                {/* --- Brand Philosophy Section --- */}
                {/* --- Enhanced Brand Philosophy Section --- */}
{/* --- Enhanced Brand Philosophy Section (New Text) --- */}
<motion.section 
    className="max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
>
    <div className="relative bg-base-100/30 backdrop-blur-xl border border-base-content/10 rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12">
        
        {/* Decorative Aurora Glow */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-accent/20 rounded-full filter blur-[100px] animate-pulse-slower"></div>

        <div className="relative z-10 text-center">
            
            {/* ✅ New Philosophical & Psychological Quote */}
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight bg-gradient-to-br from-base-content via-base-content/80 to-base-content/60 bg-clip-text text-transparent">
                "True value is not in the possession, but in the perspective. It is the mind, not the myth of materialism, that defines our reality."
            </h2>
            
            {/* ✅ Updated Attribution */}
            <p className="text-lg text-base-content/70 italic mt-6">
                <span className="opacity-60">—</span> Mind Over Myth
            </p>
        </div>
    </div>
</motion.section>
            </div>
        </div>
    );
};
export default StoreHome;