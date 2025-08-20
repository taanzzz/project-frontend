import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import PostCard from './PostCard';
import CommentInput from './CommentInput';
import Comment from './Comment';
import io from 'socket.io-client';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { VscChromeClose } from "react-icons/vsc";
import { motion, AnimatePresence } from 'framer-motion';

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const CommentModal = ({ post, isOpen, onClose, highlightedCommentId }) => {
    const queryClient = useQueryClient();
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');
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

    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', post._id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/posts/${post._id}/comments`);
            return data;
        },
        enabled: !!isOpen,
    });

    useEffect(() => {
        const handleNewComment = (newComment) => {
            if (newComment.postId === post._id) {
                queryClient.setQueryData(['comments', post._id], (oldData = []) => [newComment, ...oldData]);
                queryClient.invalidateQueries({ queryKey: ['posts'] });
            }
        };
        socket.on('new_comment', handleNewComment);
        return () => socket.off('new_comment', handleNewComment);
    }, [post._id, queryClient]);

    useEffect(() => {
        if (isOpen && comments.length > 0 && highlightedCommentId) {
            const element = document.getElementById(highlightedCommentId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add(
                        `${isDark ? 'bg-indigo-500/10 ring-indigo-500/30' : 'bg-pink-500/10 ring-pink-500/30'}`, 
                        'ring-2', 'transition-all', 'duration-1000', 'rounded-xl', 'p-2', 'my-2', '-mx-2'
                    );
                    setTimeout(() => {
                        element.classList.remove(
                            `${isDark ? 'bg-indigo-500/10 ring-indigo-500/30' : 'bg-pink-500/10 ring-pink-500/30'}`, 
                            'ring-2'
                        );
                    }, 3000);
                }, 500);
            }
        }
    }, [isOpen, comments, highlightedCommentId, isDark]);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="modal modal-open fixed inset-0 z-[9999] flex justify-center items-center">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className={`modal-box max-w-4xl p-0 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md rounded-t-3xl sm:rounded-3xl shadow-2xl ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} relative z-[10000] m-auto flex flex-col max-h-[90vh]`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* --- Modal Header --- */}
                        <div className={`sticky top-0 ${isDark ? 'bg-gray-900/80 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-lg z-20 p-4 sm:p-6 border-b flex-shrink-0`}>
                            <h3 className={`font-bold text-2xl text-center bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}>
                                Post by {post.authorInfo.name}
                            </h3>
                            <motion.button
                                onClick={onClose}
                                className={`btn btn-sm btn-circle btn-ghost absolute right-3 top-3 ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <VscChromeClose className="text-xl" />
                            </motion.button>
                        </div>

                        {/* --- Scrollable Content --- */}
                        <div className="flex-grow overflow-y-auto px-4 sm:px-6 pt-4 pb-6">
                            {/* PostCard without outer container */}
                            <PostCard post={post} />
                            <div className={`divider ${isDark ? 'text-gray-400' : 'text-gray-500'} font-semibold my-6`}>
                                All Comments
                            </div>

                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <div className="space-y-4">
                                    {comments.map(comment => (
                                        <div id={comment._id} key={comment._id} className="transition-all duration-300">
                                            <Comment comment={comment} postId={post._id} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- Sticky Comment Input --- */}
                        <div className={`flex-shrink-0 ${isDark ? 'bg-gray-900/80 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md p-4 sm:p-6 border-t`}>
                            <CommentInput postId={post._id} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default CommentModal;