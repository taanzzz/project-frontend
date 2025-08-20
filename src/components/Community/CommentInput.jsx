import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import { IoSend } from 'react-icons/io5';
import { FaRegSmile, FaRegStickyNote } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { motion } from 'framer-motion';

const stickers = [ 
    'https://i.ibb.co/dwPjCTxj/Whats-App-Image-2025-08-03-at-17-29-45-84d16ba4.jpg'
];

const CommentInput = ({ postId, parentId = null, onCommentPosted = () => {} }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
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

    const mutation = useMutation({
        mutationFn: (commentData) => axiosSecure.post(`/api/posts/${postId}/comment`, commentData),
        onSuccess: () => {
            if (parentId) {
                queryClient.invalidateQueries({ queryKey: ['replies', parentId] });
                queryClient.invalidateQueries({ queryKey: ['replyCount', parentId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            }
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            onCommentPosted();
        }
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        mutation.mutate({ content: commentText, parentId });
        setCommentText('');
        setShowEmojiPicker(false);
    };

    const handleStickerSend = (stickerUrl) => {
        mutation.mutate({ stickerUrl, parentId });
        setShowStickerPicker(false);
    };

    return (
        <div className={`p-4 sm:p-6 ${isDark ? 'bg-gray-900/80 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border-t sticky bottom-0 z-10`}>
            {showEmojiPicker && (
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <EmojiPicker
                        onEmojiClick={(emojiObject) => setCommentText(prev => prev + emojiObject.emoji)}
                        height={350}
                        width="100%"
                        theme={isDark ? 'dark' : 'light'}
                    />
                </motion.div>
            )}
            {showStickerPicker && (
                <motion.div
                    className={`grid grid-cols-4 sm:grid-cols-6 gap-2 p-4 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md rounded-xl mb-4 shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {stickers.map(url => (
                        <motion.img
                            key={url}
                            src={url}
                            onClick={() => handleStickerSend(url)}
                            className="w-20 h-20 object-cover cursor-pointer rounded-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            alt="sticker"
                        />
                    ))}
                </motion.div>
            )}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                <div className="avatar flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                        <img src={user?.photoURL} alt="Your avatar" />
                    </div>
                </div>
                <div className="relative w-full">
                    <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className={`input w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md rounded-xl p-4 text-lg placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 pr-24`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <motion.button
                            type="button"
                            onClick={() => setShowStickerPicker(s => !s)}
                            className={`btn btn-ghost btn-sm btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaRegStickyNote className="text-xl" />
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => setShowEmojiPicker(e => !e)}
                            className={`btn btn-ghost btn-sm btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaRegSmile className="text-xl" />
                        </motion.button>
                    </div>
                </div>
                <motion.button
                    type="submit"
                    className={`btn btn-circle border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} disabled:bg-gray-400 transition-all duration-300`}
                    disabled={!commentText.trim() || mutation.isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : <IoSend className="text-lg" />}
                </motion.button>
            </form>
        </div>
    );
};

export default CommentInput;