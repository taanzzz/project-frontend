import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosSecure from '../../api/Axios';
import { motion } from 'framer-motion';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim().length < 10) {
            return toast.error("Post must be at least 10 characters long.");
        }
        setIsSubmitting(true);
        try {
            const response = await axiosSecure.post('/api/posts', { content });
            
            if (response.status === 201) {
                toast.success("Post submitted successfully for review!");
                setContent('');
            }
        } catch (error) {
            console.error("Post creation error:", error.response);
            const errorMessage = error.response?.data?.message || "Failed to create post.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className={`p-6 sm:p-8 ${isDark ? 'bg-gray-900/80 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} max-w-3xl mx-auto mb-12 transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <h3 className={`font-extrabold text-2xl md:text-3xl mb-6 pb-2 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}>
                Share Your Knowledge
            </h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className={`w-full p-4 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md text-lg placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 ease-in-out`}
                    placeholder="What's on your mind? Share something educational, inspiring, or positive with the community..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    disabled={isSubmitting}
                ></textarea>
                <div className="mt-5 flex justify-end">
                    <motion.button
                        type="submit"
                        className={`btn border-none text-white font-bold ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} ${isDark ? 'hover:from-indigo-600 hover:to-purple-600' : 'hover:from-pink-600 hover:to-rose-600'} w-full sm:w-auto ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-xl disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 ease-in-out rounded-xl`}
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isSubmitting ? <span className="loading loading-spinner"></span> : 'Post'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreatePost;