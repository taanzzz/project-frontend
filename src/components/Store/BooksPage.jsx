import React, { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import ProductCard from '../../components/Store/ProductCard';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const BooksPage = () => {
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

    // '/api/products/category/Books' থেকে শুধু বইগুলো লোড করা হচ্ছে
    const { data: books = [], isLoading } = useQuery({
        queryKey: ['books-category'],
        queryFn: async () => (await axiosSecure.get('/api/products/category/Books')).data
    });

    // রিভিউ সংখ্যা অনুযায়ী ফিচার্ড বই নির্বাচন করা
    const featuredBook = useMemo(() => {
        if (books.length === 0) return null;
        return [...books].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))[0];
    }, [books]);

    // ফিচার্ড বইটি ছাড়া বাকি বইগুলো গ্রিডে দেখানোর জন্য
    const otherBooks = useMemo(() => books.filter(book => book._id !== featuredBook?._id), [books, featuredBook]);

    if (isLoading) return <LoadingSpinner />;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            {/* --- Hero Section --- */}
            <motion.div 
                className="relative h-[60vh] text-white overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <img
                    src="https://i.imgur.com/gA2y6P6.jpg"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl brightness-50 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
                <div className="relative max-w-5xl mx-auto px-4 h-full flex items-center justify-center text-center z-10">
                    <motion.div 
                        className="max-w-3xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <h1 className={`mb-6 text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                            Mindful Reads
                        </h1>
                        <p className={`mb-8 text-xl md:text-2xl leading-relaxed text-shadow-sm ${isDark ? 'text-gray-300' : 'text-gray-200'}`}>
                            A curated collection of books designed to expand your mind, challenge perspectives, and guide self-discovery.
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-16">
                
                {/* --- Featured Book Spotlight --- */}
                {featuredBook && (
                    <motion.section 
                        className="mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] ${isDark ? 'bg-white/10 border-white/20 shadow-indigo-500/20 backdrop-blur-md' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} border`}>
                            <motion.div 
                                className="flex justify-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative">
                                    <div className={`absolute -inset-1 ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} rounded-xl blur opacity-75`}></div>
                                    <img 
                                        src={featuredBook.imageUrl} 
                                        alt={featuredBook.name} 
                                        className="relative w-64 h-auto object-cover rounded-xl shadow-2xl" 
                                    />
                                </div>
                            </motion.div>
                            <div className="text-center md:text-left">
                                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white mb-4 ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                                    Editor's Pick
                                </div>
                                <h2 className={`text-4xl font-extrabold mt-2 mb-4 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                    {featuredBook.name}
                                </h2>
                                <p className={`mt-4 text-lg leading-relaxed line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {featuredBook.description || "A must-read book that will change your perspective on life and its meaning."}
                                </p>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-8"
                                >
                                    <Link 
                                        to={`/store/products/${featuredBook._id}`} 
                                        className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                                    >
                                        Discover More
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* --- Main Books Grid --- */}
                <section>
                    <motion.h2 
                        className={`text-4xl md:text-5xl font-extrabold text-center mb-16 bg-clip-text text-transparent pb-2 ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        Explore the Collection
                    </motion.h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {otherBooks.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="transition-all duration-300"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default BooksPage;