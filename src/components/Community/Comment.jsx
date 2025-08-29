import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import CommentInput from './CommentInput';
import io from 'socket.io-client';
import { FaChevronDown, FaChevronUp, FaHeart, FaClock, FaReply, FaFlag } from "react-icons/fa";
import { HiOutlineEmojiHappy, HiSparkles } from "react-icons/hi";
import ReportModal from './ReportModal';

// Helper function to format time
const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");
const defaultReactions = ['❤️', '😆', '😢', '😱', '🗿', '😡'];

const Comment = ({ comment, postId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isHovered, setIsHovered] = useState(false);
    const emojiPickerRef = useRef(null);
    const isDark = theme === 'dark';

    const isMyComment = user?.email === comment.authorInfo.email;

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const { data: replyCount = 0 } = useQuery({
        queryKey: ['replyCount', comment._id],
        queryFn: async () => (await axiosSecure.get(`/api/comments/${comment._id}/replies`)).data.length,
    });

    const { data: replies = [], isLoading: repliesLoading } = useQuery({
        queryKey: ['replies', comment._id],
        queryFn: async () => (await axiosSecure.get(`/api/comments/${comment._id}/replies`)).data,
        enabled: showReplies,
    });

    useEffect(() => {
        const handleNewComment = (newComment) => {
            if (newComment.parentId === comment._id) {
                queryClient.invalidateQueries({ queryKey: ['replies', comment._id] });
                queryClient.invalidateQueries({ queryKey: ['replyCount', comment._id] });
            }
        };
        socket.on('new_comment', handleNewComment);
        return () => socket.off('new_comment', handleNewComment);
    }, [comment._id, queryClient]);

    const mutation = useMutation({
        mutationFn: (reactionType) => axiosSecure.patch(`/api/comments/${comment._id}/react`, { reactionType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', comment.postId] });
            if (comment.parentId) {
                queryClient.invalidateQueries({ queryKey: ['replies', comment.parentId] });
            }
        }
    });

    const handleReaction = (emoji) => {
        if (!user) return;
        mutation.mutate(emoji);
        setShowReactionPopup(false);
        setShowEmojiPicker(false);
    };

    const topReactions = Object.entries(comment.reactions || {})
        .filter(([, value]) => value > 0).sort(([, a], [, b]) => b - a).slice(0, 3);
    const totalReactionCount = Object.values(comment.reactions || {}).reduce((a, b) => a + b, 0);

    // Animation variants
    const containerVariants = {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { 
                duration: 0.6, 
                ease: [0.215, 0.61, 0.355, 1],
                staggerChildren: 0.15
            }
        },
        hover: {
            y: -4,
            transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

    const childVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                `0 8px 32px ${isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(236, 72, 153, 0.12)'}`,
                `0 12px 48px ${isDark ? 'rgba(139, 92, 246, 0.20)' : 'rgba(236, 72, 153, 0.20)'}`,
                `0 8px 32px ${isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(236, 72, 153, 0.12)'}`
            ],
            transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            className={`relative w-full max-w-5xl mx-auto ${isMyComment ? 'ml-auto' : 'mr-auto'} ${showEmojiPicker ? 'z-20 pointer-events-none' : ''}`}
            variants={containerVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true, margin: "-50px" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className={`absolute top-2 ${isMyComment ? 'left-4' : 'right-4'} w-16 h-16 lg:w-24 lg:h-24 rounded-full blur-2xl opacity-10 ${
                        isDark ? 'bg-gradient-to-br from-violet-400 to-indigo-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
                    }`}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Main Comment Container */}
            <motion.div
                className={`flex items-start gap-4 lg:gap-8 w-full ${isMyComment ? 'flex-row-reverse' : 'flex-row'} relative`}
                variants={glowVariants}
                animate={isHovered ? "animate" : ""}
            >
                {/* Enhanced Avatar Section */}
                <motion.div 
                    className="flex-shrink-0 relative"
                    variants={childVariants}
                >
                    <div className="relative group">
                        <motion.div 
                            className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden ring-3 ring-offset-3 transition-all duration-500 ${
                                isDark 
                                    ? 'ring-violet-400/40 ring-offset-gray-900 group-hover:ring-violet-400/60' 
                                    : 'ring-pink-400/40 ring-offset-white group-hover:ring-pink-400/60'
                            } shadow-xl`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                        >
                            <img 
                                src={comment.authorInfo.avatar} 
                                alt={`${comment.authorInfo.name}'s avatar`}
                                className="w-full h-full object-cover transform transition-transform duration-400 group-hover:scale-115" 
                            />
                        </motion.div>
                        
                        {/* Enhanced Status indicator */}
                        <motion.div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full border-3 ${
                                isDark ? 'bg-green-400 border-gray-900' : 'bg-green-500 border-white'
                            } shadow-xl`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 600 }}
                            whileHover={{ scale: 1.2 }}
                        />

                        {/* Activity Pulse */}
                        <motion.div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 rounded-full ${
                                isDark ? 'bg-green-400' : 'bg-green-500'
                            } opacity-50`}
                            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>

                {/* Comment Content */}
                <motion.div 
                    className={`flex-1 min-w-0 ${isMyComment ? 'items-end' : 'items-start'} flex flex-col`}
                    variants={childVariants}
                >
                    {/* Comment Bubble */}
                    <div className="relative w-full max-w-3xl">
                        <motion.div
                            className={`relative p-6 lg:p-8 rounded-3xl lg:rounded-[2rem] backdrop-blur-2xl border-2 transition-all duration-500 ${
                                isMyComment 
                                    ? isDark
                                        ? 'bg-gradient-to-br from-violet-600/95 via-purple-600/95 to-indigo-600/95 text-white border-violet-400/40 shadow-xl shadow-violet-500/30'
                                        : 'bg-gradient-to-br from-pink-500/95 via-rose-500/95 to-red-500/95 text-white border-pink-400/40 shadow-xl shadow-pink-500/30'
                                    : isDark
                                        ? 'bg-gradient-to-br from-slate-800/98 via-gray-800/98 to-slate-900/98 text-gray-100 border-white/15 shadow-xl shadow-slate-500/25'
                                        : 'bg-gradient-to-br from-white/98 via-gray-50/98 to-white/98 text-gray-700 border-gray-200/60 shadow-xl shadow-gray-500/25'
                            } ${isMyComment ? 'rounded-bl-2xl' : 'rounded-br-2xl'}`}
                            whileHover={{ scale: 1.01, y: -2 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                            {/* Author Name (only for others' comments) */}
                            {!isMyComment && (
                                <motion.div 
                                    className="flex items-center gap-3 mb-4"
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <h4 className={`font-bold text-lg lg:text-xl ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                        {comment.authorInfo.name}
                                    </h4>
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <HiSparkles className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-pink-500'}`} />
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Comment Text */}
                            {comment.content && (
                                <motion.p 
                                    className={`text-base lg:text-lg leading-relaxed whitespace-pre-wrap font-medium ${
                                        isMyComment 
                                            ? 'text-white/95' 
                                            : isDark ? 'text-gray-200' : 'text-gray-700'
                                    }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}
                                >
                                    {comment.content}
                                </motion.p>
                            )}

                            {/* Enhanced Sticker */}
                            {comment.stickerUrl && (
                                <motion.div
                                    className="mt-4"
                                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 300 }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                >
                                    <img 
                                        src={comment.stickerUrl} 
                                        className="w-24 h-24 lg:w-32 lg:h-32 object-contain rounded-2xl shadow-lg" 
                                        alt="sticker" 
                                    />
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Enhanced Reactions Display */}
                        {topReactions.length > 0 && (
                            <motion.div
                                className={`absolute -bottom-4 ${isMyComment ? '-left-4' : '-right-4'} flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-2xl border-2 shadow-2xl ${
                                    isDark 
                                        ? 'bg-slate-800/95 border-white/25 shadow-violet-500/25' 
                                        : 'bg-white/95 border-gray-200/60 shadow-pink-500/25'
                                }`}
                                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 300 }}
                                whileHover={{ scale: 1.08, y: -2 }}
                            >
                                {topReactions.map(([key], index) => (
                                    <motion.span 
                                        key={key} 
                                        className="text-lg lg:text-xl"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1), type: "spring", stiffness: 400 }}
                                        whileHover={{ scale: 1.3 }}
                                    >
                                        {key}
                                    </motion.span>
                                ))}
                                {totalReactionCount > 0 && (
                                    <motion.span 
                                        className={`text-sm lg:text-base font-bold ml-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.7 }}
                                    >
                                        {totalReactionCount}
                                    </motion.span>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Enhanced Action Buttons */}
                    <motion.div 
                        className={`flex items-center gap-4 lg:gap-6 mt-5 lg:mt-6 px-3 text-sm lg:text-base ${isMyComment ? 'justify-end' : 'justify-start'}`}
                        variants={childVariants}
                    >
                        {/* Enhanced Timestamp */}
                        <motion.div 
                            className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaClock className="w-4 h-4" />
                            <time>
                                {formatDistanceToNow(new Date(comment.createdAt))}
                            </time>
                        </motion.div>

                        {/* Enhanced React Button */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowReactionPopup(!showReactionPopup)}
                                className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-full transition-all duration-400 backdrop-blur-md ${
                                    isDark 
                                        ? 'text-gray-300 hover:text-violet-400 hover:bg-violet-400/15 border border-white/10' 
                                        : 'text-gray-600 hover:text-pink-500 hover:bg-pink-500/15 border border-gray-200/50'
                                } shadow-lg hover:shadow-xl`}
                                whileHover={{ scale: 1.08, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <HiOutlineEmojiHappy className="w-5 h-5" />
                                <span className="hidden sm:inline">React</span>
                            </motion.button>

                            {/* Enhanced Reaction Popup */}
                            <AnimatePresence>
                                {showReactionPopup && (
                                    <motion.div
                                        className={`absolute bottom-full mb-3 ${isMyComment ? 'right-0' : 'left-0'} flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-2xl border-2 shadow-2xl z-30 ${
                                            isDark 
                                                ? 'bg-slate-800/98 border-white/25 shadow-violet-500/25' 
                                                : 'bg-white/98 border-gray-200/60 shadow-pink-500/25'
                                        }`}
                                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                    >
                                        {defaultReactions.map((emoji, index) => (
                                            <motion.button
                                                key={emoji}
                                                onClick={() => handleReaction(emoji)}
                                                className="text-2xl lg:text-3xl p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.2, delay: index * 0.05, type: "spring", stiffness: 400 }}
                                                whileHover={{ scale: 1.4, y: -3 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {emoji}
                                            </motion.button>
                                        ))}
                                        <motion.button
                                            onClick={() => { setShowEmojiPicker(true); setShowReactionPopup(false); }}
                                            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                                                isDark 
                                                    ? 'bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700' 
                                                    : 'bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
                                            } shadow-lg hover:shadow-xl`}
                                            whileHover={{ scale: 1.15, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            +
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Reply Button */}
                        <motion.button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-full transition-all duration-400 backdrop-blur-md ${
                                isDark 
                                    ? 'text-gray-300 hover:text-violet-400 hover:bg-violet-400/15 border border-white/10' 
                                    : 'text-gray-600 hover:text-pink-500 hover:bg-pink-500/15 border border-gray-200/50'
                            } shadow-lg hover:shadow-xl`}
                            whileHover={{ scale: 1.08, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaReply className="w-4 h-4" />
                            <span className="hidden sm:inline">Reply</span>
                        </motion.button>

                        {/* Enhanced Report Button */}
                        {!isMyComment && (
                            <motion.button
                                onClick={() => setIsReportModalOpen(true)}
                                className={`flex items-center gap-2 font-bold px-4 py-2.5 rounded-full transition-all duration-400 backdrop-blur-md ${
                                    isDark 
                                        ? 'text-gray-300 hover:text-red-400 hover:bg-red-400/15 border border-white/10' 
                                        : 'text-gray-600 hover:text-red-500 hover:bg-red-500/15 border border-gray-200/50'
                                } shadow-lg hover:shadow-xl`}
                                whileHover={{ scale: 1.08, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaFlag className="w-4 h-4" />
                                <span className="hidden sm:inline">Report</span>
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Enhanced Emoji Picker */}
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div 
                                ref={emojiPickerRef}
                                className="absolute z-50 mt-3 left-0 pointer-events-auto"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                            >
                                <div className={`p-4 rounded-3xl border-2 shadow-2xl backdrop-blur-2xl ${
                                    isDark 
                                        ? 'bg-slate-800/98 border-white/25 shadow-violet-500/25' 
                                        : 'bg-white/98 border-gray-200/60 shadow-pink-500/25'
                                }`}>
                                    <EmojiPicker 
                                        onEmojiClick={(e) => handleReaction(e.emoji)} 
                                        theme={isDark ? 'dark' : 'light'} 
                                        width="320px"
                                        height="400px"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Enhanced Reply Input */}
                    <AnimatePresence>
                        {showReplyInput && (
                            <motion.div 
                                className={`mt-6 w-full pl-6 lg:pl-8 border-l-3 border-dashed ${isDark ? 'border-white/25' : 'border-pink-200/60'}`}
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <CommentInput 
                                    postId={postId} 
                                    parentId={comment._id} 
                                    onCommentPosted={() => { 
                                        setShowReplyInput(false); 
                                        setShowReplies(true); 
                                    }} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Enhanced View Replies Button */}
                    {replyCount > 0 && !showReplyInput && (
                        <motion.button
                            onClick={() => setShowReplies(!showReplies)}
                            className={`flex items-center gap-3 text-base font-bold mt-6 px-5 py-3 rounded-2xl transition-all duration-400 backdrop-blur-md border ${
                                isDark 
                                    ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-400/15 border-violet-400/30' 
                                    : 'text-pink-500 hover:text-pink-600 hover:bg-pink-500/15 border-pink-400/30'
                            } shadow-lg hover:shadow-xl`}
                            whileHover={{ scale: 1.05, x: 4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                animate={{ rotate: showReplies ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaChevronDown className="w-4 h-4" />
                            </motion.div>
                            <span>
                                {showReplies ? 'Hide Replies' : `View ${replyCount} ${replyCount > 1 ? 'replies' : 'reply'}`}
                            </span>
                        </motion.button>
                    )}
                    
                    {/* Enhanced Replies */}
                    <AnimatePresence>
                        {showReplies && (
                            <motion.div 
                                className={`mt-6 space-y-6 pt-6 w-full pl-6 lg:pl-8 border-l-3 border-dashed ${isDark ? 'border-white/25' : 'border-pink-200/60'}`}
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                {repliesLoading ? (
                                    <div className="flex justify-center py-8">
                                        <motion.div
                                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl backdrop-blur-md ${
                                                isDark ? 'bg-white/10 text-violet-400' : 'bg-gray-100 text-pink-500'
                                            }`}
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <span className="loading loading-dots loading-md"></span>
                                            <span className="font-bold">Loading replies...</span>
                                        </motion.div>
                                    </div>
                                ) : (
                                    replies.map((reply, index) => (
                                        <motion.div
                                            key={reply._id}
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        >
                                            <Comment comment={reply} postId={postId} />
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.div>
            </motion.div>

            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
                contentId={comment._id} 
                contentType="comment" 
            />
        </motion.div>
    );
};

export default Comment;