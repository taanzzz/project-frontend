// 📁 File: src/components/Community/Comment.jsx

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

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");
const defaultReactions = ['❤️', '😆', '😢', '😱', '🗿', '😡'];

const Comment = ({ comment, postId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showReactionPopup, setShowReactionPopup] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    
    const isMyComment = user?.email === comment.authorInfo.email;
    
    const { data: replyCount = 0 } = useQuery({
        queryKey: ['replyCount', comment._id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/comments/${comment._id}/replies`);
            return data.length;
        },
    });

    const { data: replies = [], isLoading: repliesLoading } = useQuery({
        queryKey: ['replies', comment._id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/comments/${comment._id}/replies`);
            return data;
        },
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
        <div className={`flex items-start gap-3 w-full ${isMyComment ? 'justify-end' : 'justify-start'}`}>
            {!isMyComment && (
                <div className="avatar flex-shrink-0">
                    <div className="w-10 h-10 rounded-full"><img src={comment.authorInfo.avatar} alt="avatar" /></div>
                </div>
            )}
            
            <div className={`flex flex-col w-full max-w-lg ${isMyComment ? 'items-end' : 'items-start'}`}>
                <div className="relative">
                    <div className={`p-3 inline-block ${isMyComment ? 'bg-primary text-primary-content rounded-t-2xl rounded-bl-2xl' : 'bg-base-200 text-base-content rounded-t-2xl rounded-br-2xl'}`}>
                        {!isMyComment && <p className="font-bold text-sm">{comment.authorInfo.name}</p>}
                        {comment.content && <p className="whitespace-pre-wrap text-base">{comment.content}</p>}
                        {comment.stickerUrl && <img src={comment.stickerUrl} className="w-28 h-28 object-contain" alt="sticker" />}
                    </div>

                    {topReactions.length > 0 && (
                         <div className={`absolute -bottom-3 flex items-center gap-1 bg-base-100/90 backdrop-blur-sm border border-base-300/20 px-2 py-0.5 rounded-full shadow-md ${isMyComment ? '-left-2' : '-right-2'}`}>
                            {topReactions.map(([key]) => <span key={key} className="text-sm">{key}</span>)}
                            {totalReactionCount > 0 && <span className="text-xs font-bold ml-1 text-base-content/70">{totalReactionCount}</span>}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 px-2 text-xs mt-2">
                    <time className="opacity-60">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</time>
                    <div className="relative">
                        <button onClick={() => setShowReactionPopup(!showReactionPopup)} className="font-semibold text-base-content/60 hover:text-primary transition-colors">React</button>
                        <AnimatePresence>
                        {showReactionPopup && (
                            <motion.div className="absolute bottom-6 flex items-center gap-2 bg-base-100/80 backdrop-blur-md p-2 rounded-full shadow-xl z-20 border border-base-300/20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                {defaultReactions.map(emoji => <button key={emoji} onClick={() => handleReaction(emoji)} className="text-2xl transform transition-transform hover:scale-125">{emoji}</button>)}
                                <button onClick={() => {setShowEmojiPicker(true); setShowReactionPopup(false);}} className="btn btn-circle btn-xs btn-outline border-base-300">+</button>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <button onClick={() => setShowReplyInput(!showReplyInput)} className="font-semibold text-base-content/60 hover:text-secondary transition-colors">Reply</button>
                </div>
                {showEmojiPicker && ( <div className="absolute z-30 mt-2"><EmojiPicker onEmojiClick={(e) => handleReaction(e.emoji)} theme="auto"/></div> )}
                
                {showReplyInput && (
                    <div className="mt-2 w-full">
                        <CommentInput postId={postId} parentId={comment._id} onCommentPosted={() => { setShowReplyInput(false); setShowReplies(true); }} />
                    </div>
                )}
                
                {replyCount > 0 && !showReplyInput && (
                    <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-2 text-xs font-bold text-primary mt-3 hover:underline">
                        {showReplies ? <FaChevronUp/> : <FaChevronDown/>}
                        {showReplies ? 'Hide Replies' : `View ${replyCount} ${replyCount > 1 ? 'replies' : 'reply'}`}
                    </button>
                )}
                
                {showReplies && (
                    <div className="mt-4 space-y-4 pt-4 w-full border-l-2 border-dashed border-base-300/70 pl-4">
                        {repliesLoading ? <span className="loading loading-dots loading-sm"></span> : 
                            replies.map(reply => <Comment key={reply._id} comment={reply} postId={postId} />)
                        }
                    </div>
                )}
            </div>
            
             {isMyComment && (
                <div className="avatar flex-shrink-0">
                    <div className="w-10 h-10 rounded-full"><img src={comment.authorInfo.avatar} alt="avatar" /></div>
                </div>
            )}
        </div>
    );
};

export default Comment;