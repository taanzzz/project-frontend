// 📁 File: src/components/Community/CommentModal.jsx

import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import PostCard from './PostCard';
import CommentInput from './CommentInput';
import Comment from './Comment';
import io from 'socket.io-client';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { VscChromeClose } from "react-icons/vsc";

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const CommentModal = ({ post, isOpen, onClose, highlightedCommentId }) => {
    const queryClient = useQueryClient();
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
                    // Enhanced highlighting effect
                    element.classList.add('bg-primary/10', 'ring-2', 'ring-primary/30', 'transition-all', 'duration-1000', 'rounded-xl', 'p-2', 'my-2', '-mx-2');
                    setTimeout(() => {
                        element.classList.remove('bg-primary/10', 'ring-2', 'ring-primary/30');
                    }, 3000);
                }, 500);
            }
        }
    }, [isOpen, comments, highlightedCommentId]);

    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-middle sm:modal-middle modal-open">
            <div className="modal-box  max-w-4xl p-0 bg-base-100/95 backdrop-blur-md border border-base-300/20 rounded-t-2xl sm:rounded-2xl shadow-2xl">
                {/* --- Modal Header --- */}
                <div className="sticky top-0 bg-base-100/80 backdrop-blur-lg z-20 p-4 border-b border-base-300/20">
                    <h3 className="font-bold text-xl text-center">Post by {post.authorInfo.name}</h3>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-lg"><VscChromeClose /></button>
                </div>
                
                {/* --- Scrollable Content --- */}
                <div className="max-h-[70vh] sm:max-h-[75vh] overflow-y-auto px-2 sm:px-6 pt-4">
                    {/* We render PostCard without its outer container for a seamless look */}
                    <PostCard post={post} /> 
                    <div className="divider text-base-content/50 font-semibold my-6">All Comments</div>
                    
                    {isLoading ? <LoadingSpinner /> : (
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
                <CommentInput postId={post._id} />
            </div>
        </dialog>
    );
};

export default CommentModal;