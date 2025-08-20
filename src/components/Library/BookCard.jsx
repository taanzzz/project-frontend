// 📁 File: src/components/Library/BookCard.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaBookmark, FaRegBookmark, FaStar, FaHeadphones } from "react-icons/fa";
import { motion } from 'framer-motion';

const BookCard = ({ book, onPlayAudio, onToggleBookmark, isBookmarked, isDark }) => {
    // ✅ Optimistic UI আপডেটের জন্য local state
    const [optimisticBookmark, setOptimisticBookmark] = useState(isBookmarked);

    // ✅ Parent component থেকে isBookmarked prop পরিবর্তন হলে, UI সিঙ্ক করা
    useEffect(() => {
        setOptimisticBookmark(isBookmarked);
    }, [isBookmarked]);

    const handleBookmarkClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // ✅ Event bubbling prevent করা
        
        // ✅ সাথে সাথে UI পরিবর্তন (Optimistic Update)
        setOptimisticBookmark(!optimisticBookmark); 
        
        // ✅ Parent component-এ API কল
        onToggleBookmark(book._id);
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={`p-px bg-gradient-to-br ${isDark ? 'from-gray-900 to-gray-800' : 'from-gray-100 to-gray-200'} hover:from-primary hover:to-secondary rounded-3xl transition-all duration-300 h-full`}>
                <div className={`card h-full rounded-3xl shadow-lg transition-all duration-300 group ${isDark ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md hover:bg-white/90'} border overflow-hidden`}>
                    <figure className="h-64 relative">
                        <img src={book.coverImage} loading="lazy" alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                            <Link to={`/library/item/${book._id}`} className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}>
                                View Details
                            </Link>
                            {book.audioUrl && (
                                <button 
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        e.stopPropagation(); 
                                        onPlayAudio(book); 
                                    }} 
                                    className={`btn btn-sm btn-circle ${isDark ? 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'} transition-all duration-300`}
                                >
                                    <FaHeadphones />
                                </button>
                            )}
                        </div>
                        
                        {/* Bookmark button */}
                        <div className="absolute top-3 right-3">
                            <button 
                                onClick={handleBookmarkClick}
                                className={`btn btn-circle btn-sm ${isDark ? 'bg-white/20 backdrop-blur-md text-gray-300 border-white/20' : 'bg-white/50 backdrop-blur-md text-gray-600 border-pink-200/50'} border transition-all duration-300 hover:scale-110`}
                            >
                                {optimisticBookmark ? 
                                    <FaBookmark className={`${isDark ? 'text-purple-400' : 'text-rose-500'} transition-colors duration-200`} /> : 
                                    <FaRegBookmark className={`${isDark ? 'text-purple-400' : 'text-rose-500'} transition-colors duration-200`} />
                                }
                            </button>
                        </div>
                    </figure>

                    <div className="card-body p-4 justify-between text-center">
                        <div>
                            <h2 className={`card-title h-14 text-base line-clamp-2 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                {book.title}
                            </h2>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                {book.author}
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                            <FaStar className={`${isDark ? 'text-amber-500' : 'text-pink-500'}`} /> 
                            <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                            </span> 
                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                ({book.reviewCount || 0} Reviews)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;