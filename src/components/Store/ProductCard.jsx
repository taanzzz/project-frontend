// 📁 File: src/components/Store/ProductCard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                type: 'spring', 
                stiffness: 100, 
                damping: 15,
                duration: 0.6 
            } 
        }
    };

    return (
        <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <Link to={`/store/products/${product._id}`} className="block group">
                {/* --- Main Card Container --- */}
                <motion.div 
                    className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-500 ease-out group-hover:shadow-2xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} h-[28rem] group`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Background Gradient Orbs */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute -top-20 -left-20 w-40 h-40 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`} />
                    </div>
                    
                    {/* --- Product Image Container --- */}
                    <div className="relative h-64 overflow-hidden rounded-t-3xl">
                        <motion.img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                        
                        {/* Gradient Overlay on Image */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-gray-900/50 via-transparent to-transparent' : 'from-white/30 via-transparent to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Floating Action Buttons */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                            <motion.button
                                className={`w-10 h-10 rounded-full ${isDark ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/80 hover:bg-white/90 text-gray-600'} backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaHeart className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                className={`w-10 h-10 rounded-full ${isDark ? 'bg-indigo-500/80 hover:bg-indigo-500 text-white' : 'bg-pink-500/80 hover:bg-pink-500 text-white'} backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiShoppingCart className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Product Badge/Tag */}
                        {product.tags?.includes('bestseller') && (
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} shadow-lg`}>
                                Bestseller
                            </div>
                        )}
                    </div>

                    {/* --- Content Section --- */}
                    <div className="p-6 relative z-10">
                        {/* Product Name with Gradient */}
                        <motion.h2 
                            className={`text-xl font-bold leading-tight mb-3 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300' : 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-600'} min-h-[3rem] flex items-center`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            {product.name}
                        </motion.h2>

                        {/* Price Section */}
                        <div className="flex items-center justify-between mb-4">
                            <motion.p 
                                className={`font-bold text-2xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                ${product.price.toFixed(2)}
                            </motion.p>
                            
                            {/* Rating Stars (if available) */}
                            {product.rating && (
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-amber-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- Enhanced Hover Action Section --- */}
                        <motion.div 
                            className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <span className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                View Product
                            </span>
                            <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiArrowRight className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            </motion.div>
                        </motion.div>

                        {/* Animated Bottom Border */}
                        <motion.div
                            className={`absolute bottom-0 left-0 h-1 ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} rounded-b-3xl`}
                            initial={{ width: '0%' }}
                            whileInView={{ width: '100%' }}
                            whileHover={{ width: '100%' }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>

                    {/* Subtle Glass Reflection Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${isDark ? 'from-white/5 via-transparent to-transparent' : 'from-white/20 via-transparent to-transparent'} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;