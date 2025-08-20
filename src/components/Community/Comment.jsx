import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import CommentInput from './CommentInput';
import io from 'socket.io-client';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReportModal from './ReportModal';

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

    return (
        <motion.div
            className={`flex items-start gap-4 w-full ${isMyComment ? 'justify-end' : 'justify-start'} px-4 sm:px-6 py-4 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} rounded-3xl shadow-lg backdrop-blur-md transition-all duration-300`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {!isMyComment && (
                <div className="avatar flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                        <img src={comment.authorInfo.avatar} alt="avatar" />
                    </div>
                </div>
            )}
            
            <div className={`flex flex-col w-full max-w-3xl ${isMyComment ? 'items-end' : 'items-start'}`}>
                <div className="relative w-full">
                    <div className={`p-4 inline-block ${isMyComment ? `bg-gradient-to-r ${isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'} text-white rounded-t-2xl rounded-bl-2xl` : `${isDark ? 'bg-gray-800/50 border-white/20' : 'bg-white/80 border-pink-200/50'} text-gray-600 rounded-t-2xl rounded-br-2xl`} backdrop-blur-md border shadow-sm transition-all duration-300`}>
                        {!isMyComment && (
                            <p className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                {comment.authorInfo.name}
                            </p>
                        )}
                        {comment.content && (
                            <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2 leading-relaxed whitespace-pre-wrap`}>
                                {comment.content}
                            </p>
                        )}
                        {comment.stickerUrl && (
                            <img src={comment.stickerUrl} className="w-28 h-28 object-contain mt-2" alt="sticker" />
                        )}
                    </div>

                    {topReactions.length > 0 && (
                        <div className={`absolute -bottom-3 flex items-center gap-1 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-pink-200/50'} backdrop-blur-md px-2 py-1 rounded-full shadow-md ${isMyComment ? '-left-2' : '-right-2'}`}>
                            {topReactions.map(([key]) => (
                                <span key={key} className="text-sm">{key}</span>
                            ))}
                            {totalReactionCount > 0 && (
                                <span className={`text-xs font-bold ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {totalReactionCount}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 px-2 text-sm mt-3">
                    <time className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </time>
                    <div className="relative">
                        <motion.button
                            onClick={() => setShowReactionPopup(!showReactionPopup)}
                            className={`font-semibold ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-500'} transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            React
                        </motion.button>
                        <AnimatePresence>
                            {showReactionPopup && (
                                <motion.div
                                    className={`absolute bottom-8 flex items-center gap-2 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md p-2 rounded-full shadow-xl z-20`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                >
                                    {defaultReactions.map((emoji) => (
                                        <motion.button
                                            key={emoji}
                                            onClick={() => handleReaction(emoji)}
                                            className="text-2xl transform transition-transform hover:scale-125"
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                    <motion.button
                                        onClick={() => { setShowEmojiPicker(true); setShowReactionPopup(false); }}
                                        className={`btn btn-circle btn-xs border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-white`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        +
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <motion.button
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className={`font-semibold ${isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-pink-500'} transition-colors`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reply
                    </motion.button>
                    {!isMyComment && (
                        <motion.button
                            onClick={() => setIsReportModalOpen(true)}
                            className={`font-semibold ${isDark ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'} transition-colors`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Report
                        </motion.button>
                    )}
                </div>

                {showEmojiPicker && (
                    <div className="absolute z-30 mt-2">
                        <EmojiPicker onEmojiClick={(e) => handleReaction(e.emoji)} theme={isDark ? 'dark' : 'light'} />
                    </div>
                )}
                
                {showReplyInput && (
                    <div className="mt-4 w-full pl-6 border-l-2 border-dashed ${isDark ? 'border-white/20' : 'border-pink-200/50'}">
                        <CommentInput postId={postId} parentId={comment._id} onCommentPosted={() => { setShowReplyInput(false); setShowReplies(true); }} />
                    </div>
                )}
                
                {replyCount > 0 && !showReplyInput && (
                    <motion.button
                        onClick={() => setShowReplies(!showReplies)}
                        className={`flex items-center gap-2 text-sm font-bold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-500 hover:text-pink-600'} mt-3`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {showReplies ? <FaChevronUp /> : <FaChevronDown />}
                        {showReplies ? 'Hide Replies' : `View ${replyCount} ${replyCount > 1 ? 'replies' : 'reply'}`}
                    </motion.button>
                )}
                
                {showReplies && (
                    <div className={`mt-4 space-y-4 pt-4 w-full pl-6 border-l-2 border-dashed ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                        {repliesLoading ? (
                            <span className="loading loading-dots loading-sm"></span>
                        ) : (
                            replies.map((reply) => <Comment key={reply._id} comment={reply} postId={postId} />)
                        )}
                    </div>
                )}
            </div>
            
            {isMyComment && (
                <div className="avatar flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                        <img src={comment.authorInfo.avatar} alt="avatar" />
                    </div>
                </div>
            )}

            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} contentId={comment._id} contentType="comment" />
        </motion.div>
    );
};

export default Comment;