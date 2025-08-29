import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import CommentCard from './CommentCard';
import CommentInput from './CommentInput';
import Comment from './Comment';
import io from 'socket.io-client';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { VscChromeClose } from "react-icons/vsc";
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

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
            if (newComment.postId === post._id && !newComment.parentId) { 
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

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.85, 
            y: 50,
            filter: 'blur(10px)'
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            filter: 'blur(0px)',
            transition: { 
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.85, 
            y: 50,
            filter: 'blur(10px)',
            transition: { 
                duration: 0.3, 
                ease: 'easeInOut' 
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
        visible: { 
            opacity: 1, 
            backdropFilter: 'blur(8px)',
            transition: { duration: 0.4, ease: 'easeOut' }
        },
        exit: { 
            opacity: 0, 
            backdropFilter: 'blur(0px)',
            transition: { duration: 0.3, ease: 'easeIn' }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.1, duration: 0.4, ease: 'easeOut' }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.2, duration: 0.4, ease: 'easeOut' }
        }
    };

    const pulseGlow = {
        animate: {
            boxShadow: [
                `0 0 30px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`,
                `0 0 60px ${isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(236, 72, 153, 0.25)'}`,
                `0 0 30px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`
            ],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const modalContent = (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="modal modal-open fixed inset-0 z-[9999] flex justify-center items-center p-2 sm:p-4 lg:p-8">
                    {/* Enhanced Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Content with Enhanced Design */}
                    <motion.div
                        className={`modal-box max-w-5xl w-full p-0 relative z-[10000] mx-auto flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${
                            isDark 
                                ? 'bg-gradient-to-br from-slate-900/98 via-gray-900/98 to-slate-800/98 border border-white/10' 
                                : 'bg-gradient-to-br from-white/98 via-gray-50/98 to-white/98 border border-pink-200/30'
                        } backdrop-blur-xl rounded-t-3xl sm:rounded-3xl lg:rounded-[2rem] shadow-2xl`}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            boxShadow: isDark 
                                ? '0 25px 50px -12px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                                : '0 25px 50px -12px rgba(236, 72, 153, 0.25), 0 0 0 1px rgba(236, 72, 153, 0.1)'
                        }}
                    >
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 overflow-hidden rounded-t-3xl sm:rounded-3xl lg:rounded-[2rem] pointer-events-none">
                            <motion.div
                                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${
                                    isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
                                }`}
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                            <motion.div
                                className={`absolute -bottom-16 -left-16 w-32 h-32 rounded-full blur-3xl opacity-15 ${
                                    isDark ? 'bg-gradient-to-br from-cyan-400 to-blue-600' : 'bg-gradient-to-br from-rose-400 to-pink-600'
                                }`}
                                animate={{ 
                                    rotate: -360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                        </div>

                        {/* Enhanced Modal Header */}
                        <motion.div 
                            className={`sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b flex-shrink-0 ${
                                isDark 
                                    ? 'bg-slate-900/90 border-white/10' 
                                    : 'bg-white/90 border-pink-200/30'
                            } backdrop-blur-xl`}
                            variants={headerVariants}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`p-2 sm:p-3 rounded-xl ${
                                        isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-500'
                                    }`}>
                                        <FiMessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg sm:text-xl lg:text-2xl bg-clip-text text-transparent ${
                                            isDark ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-red-500'
                                        }`}>
                                            Discussion
                                        </h3>
                                        <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
                                            <span>Post by {post.authorInfo.name}</span>
                                            <HiSparkles className="w-3 h-3" />
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="hidden sm:flex items-center gap-4 mr-12">
                                    <div className="flex items-center gap-1.5">
                                        <FiUsers className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {comments.filter(c => !c.parentId).length}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiTrendingUp className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                                        <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Active
                                        </span>
                                    </div>
                                </div>

                                {/* Enhanced Close Button */}
                                <motion.button
                                    onClick={onClose}
                                    className={`relative p-2 sm:p-3 rounded-full transition-all duration-300 ${
                                        isDark 
                                            ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white' 
                                            : 'bg-gray-100/80 text-gray-600 hover:bg-white hover:text-gray-900'
                                    } backdrop-blur-md shadow-lg hover:shadow-xl group`}
                                    whileHover={{ scale: 1.05, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <VscChromeClose className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-90" />
                                    
                                    {/* Hover effect ring */}
                                    <motion.div
                                        className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 ${
                                            isDark ? 'border-indigo-400' : 'border-pink-400'
                                        }`}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Enhanced Scrollable Content */}
                        <motion.div 
                            className="flex-grow overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 scroll-smooth"
                            variants={contentVariants}
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: isDark ? '#374151 transparent' : '#e5e7eb transparent'
                            }}
                        >
                            {/* Post Card with Enhanced Styling */}
                            <motion.div
                                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border ${
                                    isDark 
                                        ? 'bg-gradient-to-br from-slate-800/50 to-gray-800/50 border-white/10' 
                                        : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-pink-200/30'
                                } backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                whileHover={{ y: -2 }}
                            >
                                <CommentCard post={post} />
                            </motion.div>

                            {/* Enhanced Divider */}
                            <motion.div 
                                className="relative flex items-center justify-center my-8 sm:my-10"
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-pink-200/50 to-transparent'}`} />
                                <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base flex items-center gap-2 ${
                                    isDark 
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-white/10' 
                                        : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600 border border-pink-200/50'
                                } backdrop-blur-md shadow-lg`}>
                                    <FiMessageCircle className="w-4 h-4" />
                                    <span>All Comments ({comments.filter(c => !c.parentId).length})</span>
                                </div>
                                <div className={`h-px flex-1 ${isDark ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent' : 'bg-gradient-to-r from-transparent via-pink-200/50 to-transparent'}`} />
                            </motion.div>

                            {/* Comments Section */}
                            {isLoading ? (
                                <motion.div 
                                    className="flex justify-center py-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className={`flex flex-col items-center gap-4 p-8 rounded-2xl ${
                                        isDark ? 'bg-slate-800/30' : 'bg-white/30'
                                    } backdrop-blur-md`}>
                                        <LoadingSpinner />
                                        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Loading conversations...
                                        </p>
                                    </div>
                                </motion.div>
                            ) : comments.filter(comment => !comment.parentId).length === 0 ? (
                                <motion.div
                                    className={`text-center py-16 px-6 rounded-3xl ${
                                        isDark ? 'bg-slate-800/30' : 'bg-gray-50/50'
                                    } backdrop-blur-md border-2 border-dashed ${
                                        isDark ? 'border-white/10' : 'border-pink-200/30'
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FiMessageCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                                    <h4 className={`text-lg font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        No comments yet
                                    </h4>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Be the first to share your thoughts!
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="space-y-4 sm:space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, staggerChildren: 0.1 }}
                                >
                                    {comments
                                        .filter(comment => !comment.parentId)
                                        .map((comment, index) => (
                                            <motion.div
                                                id={comment._id}
                                                key={comment._id}
                                                className="transition-all duration-300"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Comment comment={comment} postId={post._id} />
                                            </motion.div>
                                        ))
                                    }
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Enhanced Sticky Comment Input */}
                        <motion.div 
                            className={`flex-shrink-0 border-t ${
                                isDark 
                                    ? 'bg-slate-900/90 border-white/10' 
                                    : 'bg-white/90 border-pink-200/30'
                            } backdrop-blur-xl`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                                <CommentInput postId={post._id} />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default CommentModal;