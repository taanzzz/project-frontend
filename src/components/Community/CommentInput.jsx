// 📁 File: src/components/Community/CommentInput.jsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import { IoSend } from 'react-icons/io5';
import { FaRegSmile, FaRegStickyNote } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const stickers = [ 
    'https://i.ibb.co/dwPjCTxj/Whats-App-Image-2025-08-03-at-17-29-45-84d16ba4.jpg'
];

const CommentInput = ({ postId, parentId = null, onCommentPosted = () => {} }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);

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
        <div className="p-3 bg-base-100/80 backdrop-blur-md border-t border-base-300/20 sticky bottom-0 z-10">
            {showEmojiPicker && (
                <div className="mb-2">
                    <EmojiPicker onEmojiClick={(emojiObject) => setCommentText(prev => prev + emojiObject.emoji)} height={350} width="100%" theme="auto" />
                </div>
            )}
            {showStickerPicker && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 bg-base-100 rounded-2xl mb-2 shadow-inner">
                    {stickers.map(url => <img key={url} src={url} onClick={() => handleStickerSend(url)} className="w-20 h-20 object-cover cursor-pointer hover:scale-110 transition-transform rounded-lg" alt="sticker"/>)}
                </div>
            )}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
                <div className="avatar flex-shrink-0">
                    <div className="w-10 h-10 rounded-full"><img src={user?.photoURL} alt="Your avatar" /></div>
                </div>
                <div className="relative w-full">
                    <input 
                        type="text" 
                        value={commentText} 
                        onChange={e => setCommentText(e.target.value)} 
                        placeholder="Write a comment..." 
                        className="input bg-base-300/70 focus:bg-base-300 border-none w-full rounded-full pl-4 pr-24 focus:ring-2 focus:ring-primary transition-all" />
                    
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                        <button type="button" onClick={() => setShowStickerPicker(s => !s)} className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-primary"><FaRegStickyNote className="text-xl" /></button>
                        <button type="button" onClick={() => setShowEmojiPicker(e => !e)} className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-secondary"><FaRegSmile className="text-xl" /></button>
                    </div>
                </div>
                <button type="submit" className="btn btn-circle border-none text-white bg-gradient-to-br from-primary to-secondary disabled:bg-base-300" disabled={!commentText.trim() || mutation.isLoading}>
                    {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : <IoSend className="text-lg" />}
                </button>
            </form>
        </div>
    );
};

export default CommentInput;