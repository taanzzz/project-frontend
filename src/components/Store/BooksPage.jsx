// 📁 File: src/pages/Store/BooksPage.jsx

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import ProductCard from '../../components/Store/ProductCard';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const BooksPage = () => {
    // '/api/products/category/Books' থেকে শুধু বইগুলো লোড করা হচ্ছে
    const { data: books = [], isLoading } = useQuery({
        queryKey: ['books-category'],
        queryFn: async () => (await axiosSecure.get('/api/products/category/Books')).data
    });

    // রিভিউ সংখ্যা অনুযায়ী ফিচার্ড বই নির্বাচন করা
    const featuredBook = useMemo(() => {
        if (books.length === 0) return null;
        return [...books].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))[0];
    }, [books]);

    // ফিচার্ড বইটি ছাড়া বাকি বইগুলো গ্রিডে দেখানোর জন্য
    const otherBooks = useMemo(() => books.filter(book => book._id !== featuredBook?._id), [books, featuredBook]);

    if (isLoading) return <LoadingSpinner />;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };

    return (
        <div className="bg-base-200">
            {/* --- Hero Section --- */}
            <div className="hero min-h-[60vh]" style={{ backgroundImage: 'url(https://i.imgur.com/gA2y6P6.jpg)' }}>
                <div className="hero-overlay bg-gradient-to-br from-primary/70 to-secondary/70"></div>
                <div className="hero-content text-center text-neutral-content">
                    <motion.div 
                        className="max-w-2xl"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="mb-5 text-5xl md:text-6xl font-extrabold tracking-tight">Mindful Reads</h1>
                        <p className="mb-5 text-lg md:text-xl text-neutral-content/80">
                            A curated collection of books designed to expand your mind, challenge perspectives, and guide self-discovery.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-16">
                
                {/* --- Featured Book Spotlight --- */}
                {featuredBook && (
                    <motion.section 
                        className="mb-20"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-base-100 p-8 rounded-2xl shadow-xl">
                            <div className="flex justify-center">
                                <img src={featuredBook.imageUrl} alt={featuredBook.name} className="w-64 h-auto object-cover rounded-lg shadow-lg" />
                            </div>
                            <div className="text-center md:text-left">
                                <p className="font-semibold text-primary">Editor's Pick</p>
                                <h2 className="text-4xl font-bold mt-2">{featuredBook.name}</h2>
                                <p className="mt-4 text-base-content/70 line-clamp-3">{featuredBook.description || "A must-read book that will change your perspective on life and its meaning."}</p>
                                <Link to={`/store/products/${featuredBook._id}`} className="btn btn-primary mt-6">
                                    Discover More
                                </Link>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* --- Main Books Grid --- */}
                <section>
                   <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
                        Explore the Collection
                    </h2>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {otherBooks.map(product => <ProductCard key={product._id} product={product} />)}
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default BooksPage;