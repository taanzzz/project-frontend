// 📁 File: src/pages/Library.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import axiosSecure from '../api/Axios';
import BookCard from '../components/Library/BookCard';
import { useAudioPlayer } from '../Providers/AudioProvider';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaBookReader, FaSearch } from "react-icons/fa";
import LibraryLoader from '../components/LibraryLoader';
import { motion } from 'framer-motion';

const Library = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { playTrack } = useAudioPlayer();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
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

    const { data: content = [], isLoading: isContentLoading } = useQuery({
        queryKey: ['library-content-with-ratings'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/content');
            return data;
        }
    });
    
    // ✅ FIX: Modified to get complete bookmark details instead of just IDs
    const { data: bookmarksData = [], isLoading: areBookmarksLoading } = useQuery({
        queryKey: ['bookmarks', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/bookmarks');
            return data; // This now contains full book details from the aggregation
        },
        enabled: !!user,
    });

    // ✅ FIX: Create a Set of bookmarked content IDs for efficient lookup
    const bookmarkedIds = useMemo(() => {
        return new Set(bookmarksData.map(book => book._id));
    }, [bookmarksData]);

    const bookmarkMutation = useMutation({
        mutationFn: (contentId) => axiosSecure.post('/api/bookmarks', { contentId }),
        onSuccess: (data) => {
            toast.success(data.data.message);
            // ✅ FIX: Invalidate both queries to ensure sync
            queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['library-content-with-ratings'] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update bookmark.")
    });

    const handleToggleBookmark = (contentId) => {
        if (!user) return toast.error("Please log in to add bookmarks.");
        bookmarkMutation.mutate(contentId);
    };

    const categories = useMemo(() => ['All', ...new Set(content.map(item => item.category))], [content]);
    
    // ✅ FIX: Added safety checks for undefined title or author to prevent crash
    const filteredContent = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        return content
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .filter(item => {
                const title = item.title ?? '';       // Safely handle undefined title
                const author = item.author ?? '';   // Safely handle undefined author
                
                return title.toLowerCase().includes(lowerCaseSearchTerm) ||
                       author.toLowerCase().includes(lowerCaseSearchTerm);
            });
    }, [content, selectedCategory, searchTerm]);

    const featuredBook = useMemo(() => {
        if (content.length === 0) return null;
        return [...content].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))[0];
    }, [content]);

    if (isContentLoading || areBookmarksLoading) return <LibraryLoader />;

    return (
        <div className={`relative py-24 overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`}></div>
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 relative z-10">
                {featuredBook && (
                    <motion.div
                        className={`relative p-8 rounded-3xl shadow-2xl mb-16 overflow-hidden text-white ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} border transition-all duration-300 hover:scale-[1.02]`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <img src={featuredBook.coverImage} alt="Featured background" className="absolute inset-0 w-full h-full object-cover filter blur-2xl brightness-50 scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                        
                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                             <img src={featuredBook.coverImage} alt="Book cover" className="w-48 h-72 object-cover rounded-lg shadow-2xl flex-shrink-0 transition-transform duration-500 hover:scale-105"/>
                             <div className="text-center md:text-left">
                                 <p className={`font-bold text-xl mb-2 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>FEATURED READ OF THE WEEK</p>
                                 <h2 className={`text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>{featuredBook.title}</h2>
                                 <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>by {featuredBook.author}</p>
                                 <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                 >
                                     <Link to={`/library/item/${featuredBook._id}`} className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 mt-6`}>
                                         <FaBookReader className="mr-2"/> Continue Reading
                                     </Link>
                                 </motion.div>
                             </div>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    className={`p-6 rounded-3xl mb-12 ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} border transition-all duration-300 hover:scale-[1.02]`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="relative w-full max-w-lg mx-auto mb-6">
                        <input 
                            type="text" 
                            placeholder="Search by title or author..."
                            className={`input input-bordered w-full rounded-full pl-12 py-6 text-lg ${isDark ? 'bg-gray-800/50 text-gray-300 border-gray-700' : 'bg-white/50 text-gray-600 border-pink-200'}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-pink-400'}`} />
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                         {categories.map(cat => (
                            <button key={cat} className={`btn btn-sm rounded-full transition-all duration-300 ${selectedCategory === cat ? `border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}` : `${isDark ? 'btn-ghost text-gray-300' : 'btn-ghost text-gray-600'}`}`} onClick={() => setSelectedCategory(cat)}>
                                {cat}
                            </button>
                         ))}
                    </div>
                </motion.div>
                
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {filteredContent.length > 0 ? filteredContent.map(book => (
                        <BookCard 
                            key={book._id} 
                            book={book}
                            onPlayAudio={playTrack}
                            onToggleBookmark={handleToggleBookmark}
                            isBookmarked={bookmarkedIds.has(book._id)} // ✅ FIX: Using Set for efficient lookup
                            isDark={isDark}
                        />
                    )) : (
                        <div className={`col-span-full text-center py-16 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <h3 className="text-2xl font-bold">No Content Found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Library;