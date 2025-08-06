// 📁 File: src/components/Community/PostCard.jsx

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import Reactions from './Reactions';
import CommentSection from './CommentSection';
import Swal from 'sweetalert2';

// --- Icons ---
import { BsThreeDotsVertical, BsGlobe, BsLockFill } from "react-icons/bs";
import { FiEdit2, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";

const PostCard = ({ post, highlightedCommentId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { data: currentUserProfile } = useUserProfile();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);

    const isAuthor = user?.email === post.authorInfo.email;
    const isFollowing = currentUserProfile?.following?.includes(post.authorId);

    // --- Mutation Hooks (Logic Unchanged) ---

    const followMutation = useMutation({
        mutationFn: (userIdToFollow) => axiosSecure.patch(`/api/users/${userIdToFollow}/follow`),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile', user?.email] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update follow status.")
    });

    const deleteMutation = useMutation({
        mutationFn: (postId) => axiosSecure.delete(`/api/posts/${postId}`),
        onSuccess: () => {
            Swal.fire('Deleted!', 'Your post has been successfully deleted.', 'success');
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to delete post.")
    });

    const editMutation = useMutation({
        mutationFn: (updatedContent) => axiosSecure.patch(`/api/posts/${post._id}`, { content: updatedContent }),
        onSuccess: () => {
            toast.success("Post updated successfully!");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
            setIsEditModalOpen(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update post.")
    });

    const privacyMutation = useMutation({
        mutationFn: (newPrivacy) => axiosSecure.patch(`/api/posts/${post._id}/privacy`, { privacy: newPrivacy }),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update privacy.")
    });

    // --- Handler Functions (Logic Unchanged) ---

    const handleFollowToggle = () => {
        if (!user) return toast.error("Please log in to follow users.");
        followMutation.mutate(post.authorId);
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48', // Pinker Red
            cancelButtonColor: '#3b82f6', // Calmer Blue
            confirmButtonText: 'Yes, delete it!',
            background: '#1a1a1a', // Dark theme for Swal
            color: '#E5E7EB'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(post._id);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editMutation.mutate(editedContent);
    };

    const handlePrivacyToggle = () => {
        const newPrivacy = post.privacy === 'public' ? 'only_me' : 'public';
        privacyMutation.mutate(newPrivacy);
    };
    
    const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    
    const totalReactions = post.totalReactions || 0;
    const totalComments = post.comments?.length || 0;

    return (
        <div className="bg-base-100 border border-base-300/20 p-5 md:p-7 rounded-2xl shadow-lg mb-8">
            {/* --- Post Header --- */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="avatar transition-transform duration-300 hover:scale-105">
                        <div className="w-14 h-14 rounded-full ring-2 ring-offset-2 ring-primary ring-offset-base-100">
                            <img src={post.authorInfo.avatar} alt={`${post.authorInfo.name}'s avatar`} />
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-lg text-base-content hover:underline cursor-pointer">{post.authorInfo.name}</p>
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <p>{timeAgo}</p>
                            {isAuthor && <span className="text-base-content/40">·</span>}
                            {isAuthor && (
                                post.privacy === 'public' 
                                ? <BsGlobe title="Public Post" /> 
                                : <BsLockFill title="Private Post (Only Me)" />
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center flex-shrink-0">
                    {!isAuthor && (
                        <button onClick={handleFollowToggle} className={`btn btn-sm rounded-full w-28 ${isFollowing ? 'btn-secondary text-white' : 'btn-outline btn-secondary'}`} disabled={followMutation.isLoading}>
                            {followMutation.isLoading ? <span className="loading loading-spinner loading-xs"></span> : (isFollowing ? 'Following' : 'Follow')}
                        </button>
                    )}

                    {isAuthor && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                                <BsThreeDotsVertical className="text-xl text-base-content/70" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-2xl bg-base-200 border border-base-300/20 rounded-xl w-56 z-50">
                                <li><a onClick={() => { setEditedContent(post.content); setIsEditModalOpen(true); }}><FiEdit2 /> Edit Post</a></li>
                                <li>
                                  <a onClick={handlePrivacyToggle}>
                                    {post.privacy === 'public' ? <FiEyeOff/> : <FiEye/>}
                                    Set to {post.privacy === 'public' ? 'Private' : 'Public'}
                                  </a>
                                </li>
                                <div className="divider my-1"></div>
                                <li><a onClick={handleDelete} className="text-error font-semibold"><FiTrash2 /> Delete Post</a></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Post Content --- */}
            <div className="my-5">
                <p className="text-base-content/90 text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
            
            {/* --- Post Stats --- */}
            <div className="flex justify-between items-center text-sm text-base-content/60 mb-3 pt-3 border-t border-dashed border-base-300/30">
                <span className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"><AiOutlineHeart className="text-lg"/> {totalReactions} {totalReactions === 1 ? 'Reaction' : 'Reactions'}</span>
                <span className="flex items-center gap-1.5 hover:text-secondary transition-colors cursor-pointer"><FaRegCommentDots className="text-lg"/> {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}</span>
            </div>
            
            {/* --- Post Actions --- */}
            <div className="flex justify-around items-center pt-2">
                <Reactions post={post} />
                <CommentSection post={post} highlightedCommentId={highlightedCommentId} />
            </div>

            {/* --- Edit Modal --- */}
            <dialog id={`edit_modal_${post._id}`} className={`modal ${isEditModalOpen ? 'modal-open' : ''} backdrop-blur-sm`}>
                <div className="modal-box bg-base-100/95 border border-base-300/20 shadow-2xl rounded-2xl">
                    <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Update Your Post</h3>
                    <form onSubmit={handleEditSubmit} className="py-4">
                        <textarea
                            className="textarea w-full p-4 rounded-xl bg-base-200/80 border-2 border-transparent text-base-content focus:bg-base-200 focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows="8"
                        />
                        <div className="modal-action mt-4">
                            <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn border-none text-white font-bold bg-gradient-to-r from-primary to-secondary" disabled={editMutation.isLoading}>
                                {editMutation.isLoading ? <span className="loading loading-spinner"></span> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default PostCard;