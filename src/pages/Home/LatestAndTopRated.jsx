import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';

// --- Top Rated Book Card ---
const TopRatedBookCard = ({ book, isDark }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <motion.div
            variants={isMobile 
                ? { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }
                : { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
            }
            transition={isMobile 
                ? { duration: 0.3, ease: 'easeOut' }
                : { duration: 0.5, ease: 'easeOut' }
            }
        >
            <Link
                to={`/library/item/${book._id}`}
                className={`card ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} rounded-3xl border transition-all duration-300 overflow-hidden shadow-lg group`}
            >
                <figure className="aspect-[3/4]">
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        loading='lazy'
                        className={`w-full h-full object-cover transition-transform ${isMobile ? 'duration-200' : 'duration-500'} ${isMobile ? '' : 'group-hover:scale-105'}`}
                    />
                </figure>
                <div className="card-body p-4 text-center">
                    <h2 className={`card-title justify-center text-base line-clamp-2 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                        {book.title}
                    </h2>
                    <div className="flex items-center justify-center gap-1 text-sm">
                        <FaStar className={`${isDark ? 'text-amber-500' : 'text-pink-500'}`} />
                        <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const LatestAndTopRated = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const { data, isLoading } = useQuery({
        queryKey: ['latest-top-rated'],
        queryFn: async () => (await axiosSecure.get('/api/home/latest-top-rated')).data
    });

    if (isLoading) return <LoadingSpinner />;

    const { latestBook, topRatedBooks } = data || {};

    return (
        <div className={`relative py-24 overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                {!isMobile && (
                    <>
                        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`}></div>
                        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
                    </>
                )}
            </div>

            <div className="max-w-screen-xl mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -30 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className={`text-5xl font-extrabold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Explore Our Library
                    </h2>
                    <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-4 max-w-2xl mx-auto`}>
                        Discover the latest releases and top-rated picks loved by our community.
                    </p>
                </motion.div>

                {/* Latest Release Section */}
                {latestBook && (
                    <motion.section
                        className={`mb-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md rounded-3xl hover:scale-[1.02] transition-all duration-300'} p-10`}
                        initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, y: 50 }}
                        whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={isMobile ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="flex justify-center">
                                <img
                                    src={latestBook.coverImage}
                                    alt={latestBook.title}
                                    loading='lazy'
                                    className={`w-64 h-auto object-cover rounded-lg shadow-lg transition-transform ${isMobile ? 'duration-200' : 'duration-500'} ${isMobile ? '' : 'hover:scale-105'}`}
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <p className={`font-semibold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>Latest Release</p>
                                <h3 className={`text-4xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                                    {latestBook.title}
                                </h3>
                                <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>by {latestBook.author}</p>
                                <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-3`}>
                                    {latestBook.description}
                                </p>
                                <motion.div
                                    whileHover={isMobile ? {} : { scale: 1.05 }}
                                    whileTap={isMobile ? {} : { scale: 0.95 }}
                                >
                                    <Link
                                        to={`/library/item/${latestBook._id}`}
                                        className={`btn mt-6 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                                    >
                                        Discover Now
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Top Rated Picks Section */}
                <motion.section
                    initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
                    whileInView={isMobile ? { opacity: 1 } : { opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={isMobile ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <h3 className={`text-3xl font-bold text-center mb-10 bg-clip-text text-transparent text-shadow-sm ${isDark ? 'text-white' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Top Rated Picks From Our Community
                    </h3>
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{ visible: { transition: isMobile ? { staggerChildren: 0.05 } : { staggerChildren: 0.1 } } }}
                    >
                        {topRatedBooks?.map(book => (
                            <TopRatedBookCard key={book._id} book={book} isDark={isDark} />
                        ))}
                    </motion.div>
                </motion.section>
            </div>
        </div>
    );
};

export default LatestAndTopRated;