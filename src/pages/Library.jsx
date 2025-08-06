// 📁 File: src/pages/Library.jsx

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import axiosSecure from '../api/Axios';
import BookCard from '../components/Library/BookCard';
import { useAudioPlayer } from '../Providers/AudioProvider';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaBookReader, FaSearch } from "react-icons/fa";
import LibraryLoader from '../components/LibraryLoader';

const Library = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { playTrack } = useAudioPlayer();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: content = [], isLoading: isContentLoading } = useQuery({
        queryKey: ['library-content-with-ratings'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/content');
            return data;
        }
    });
    
    const { data: bookmarks = [], isLoading: areBookmarksLoading } = useQuery({
        queryKey: ['bookmarks', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/bookmarks');
            return data.map(b => b.contentId);
        },
        enabled: !!user,
    });

    const bookmarkMutation = useMutation({
        mutationFn: (contentId) => axiosSecure.post('/api/bookmarks', { contentId }),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['bookmarks', user?.email] });
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
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 py-12">
                
                {featuredBook && (
                    <div className="relative p-8 rounded-3xl shadow-2xl mb-16 overflow-hidden text-white">
                        <img src={featuredBook.coverImage} alt="Featured background" className="absolute inset-0 w-full h-full object-cover filter blur-2xl brightness-50 scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                        
                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                             <img src={featuredBook.coverImage} alt="Book cover" className="w-48 h-72 object-cover rounded-lg shadow-2xl flex-shrink-0"/>
                             <div className="text-center md:text-left">
                                 <p className="font-bold text-primary mb-2">FEATURED READ OF THE WEEK</p>
                                 <h2 className="text-4xl md:text-5xl font-extrabold">{featuredBook.title}</h2>
                                 <p className="text-xl text-white/80 mt-2">by {featuredBook.author}</p>
                                 <Link to={`/library/item/${featuredBook._id}`} className="btn btn-lg border-none text-white bg-gradient-to-r from-primary to-secondary mt-6 transform hover:scale-105 transition-transform duration-300">
                                     <FaBookReader className="mr-2"/> Continue Reading
                                 </Link>
                             </div>
                        </div>
                    </div>
                )}

                <div className="bg-base-100/50 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-12">
                    <div className="relative w-full max-w-lg mx-auto mb-6">
                        <input 
                            type="text" 
                            placeholder="Search by title or author..."
                            className="input input-bordered w-full rounded-full pl-12 py-6 text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-base-content/40" />
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                         {categories.map(cat => (
                            <button key={cat} className={`btn btn-sm rounded-full transition-all duration-300 ${selectedCategory === cat ? 'border-none text-white bg-gradient-to-r from-primary to-secondary' : 'btn-ghost'}`} onClick={() => setSelectedCategory(cat)}>
                                {cat}
                            </button>
                         ))}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredContent.length > 0 ? filteredContent.map(book => (
                        <BookCard 
                            key={book._id} 
                            book={book}
                            onPlayAudio={playTrack}
                            onToggleBookmark={handleToggleBookmark}
                            isBookmarked={bookmarks.includes(book._id)}
                        />
                    )) : (
                        <div className="col-span-full text-center py-16 text-base-content/60">
                            <h3 className="text-2xl font-bold">No Content Found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;