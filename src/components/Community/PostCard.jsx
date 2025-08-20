// 📁 File: src/components/Community/PostCard.jsx

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import Reactions from './Reactions';
import CommentSection from './CommentSection';
import Swal from 'sweetalert2';
import ReportModal from './ReportModal';
import { BsThreeDotsVertical, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiFlag } from 'react-icons/fi';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PostCard = ({ post, highlightedCommentId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: currentUserProfile } = useUserProfile();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const isAuthor = user?.email === post.authorInfo.email;
  const isFollowing = currentUserProfile?.following?.includes(post.authorId);

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

  const followMutation = useMutation({
    mutationFn: (userIdToFollow) => axiosSecure.patch(`/api/users/${userIdToFollow}/follow`),
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.email] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update follow status.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => axiosSecure.delete(`/api/posts/${postId}`),
    onSuccess: () => {
      Swal.fire('Deleted!', 'Your post has been successfully deleted.', 'success');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to delete post.'),
  });

  const editMutation = useMutation({
    mutationFn: (updatedContent) => axiosSecure.patch(`/api/posts/${post._id}`, { content: updatedContent }),
    onSuccess: () => {
      toast.success('Post updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
      setIsEditModalOpen(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update post.'),
  });

  const privacyMutation = useMutation({
    mutationFn: (newPrivacy) => axiosSecure.patch(`/api/posts/${post._id}/privacy`, { privacy: newPrivacy }),
    onSuccess: (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['public-profile', post.authorId] });
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update privacy.'),
  });

  const handleFollowToggle = () => {
    if (!user) return toast.error('Please log in to follow users.');
    followMutation.mutate(post.authorId);
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#E5E7EB' : '#374151',
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
    <motion.div
      className={`p-6 rounded-3xl shadow-lg mb-8 border transition-all duration-300 hover:scale-[1.01] ${
        isDark 
          ? 'bg-white/10 border-white/20 backdrop-blur-md shadow-indigo-900/20' 
          : 'bg-white/80 border-pink-200/50 backdrop-blur-md shadow-pink-200/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header: Avatar, Author info, More menu */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            className="avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`w-14 h-14 rounded-full ring-2 ring-offset-2 ${
              isDark 
                ? 'ring-indigo-400/50 ring-offset-gray-900' 
                : 'ring-pink-400/50 ring-offset-white'
            }`}>
              <img src={post.authorInfo.avatar} alt={`${post.authorInfo.name}'s avatar`} />
            </div>
          </motion.div>
          <div>
            <p className={`font-bold text-lg hover:underline cursor-pointer ${
              isDark ? 'text-gray-100' : 'text-gray-600'
            }`}>
              {post.authorInfo.name}
            </p>
            <div className={`flex items-center gap-2 text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p>{timeAgo}</p>
              {isAuthor && <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>·</span>}
              {isAuthor && (post.privacy === 'public' ? 
                <BsGlobe title="Public Post" className={isDark ? 'text-indigo-400' : 'text-pink-500'} /> : 
                <BsLockFill title="Private Post (Only Me)" className={isDark ? 'text-purple-400' : 'text-rose-500'} />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {!isAuthor && (
            <motion.button
              onClick={handleFollowToggle}
              className={`btn btn-sm rounded-full px-6 border-none text-white transition-all duration-300 ${
                isFollowing 
                  ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500')
                  : (isDark ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-indigo-400/50 text-indigo-400' : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/50 text-pink-600')
              }`}
              disabled={followMutation.isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {followMutation.isLoading ? 
                <span className="loading loading-spinner loading-xs"></span> : 
                (isFollowing ? 'Following' : 'Follow')
              }
            </motion.button>
          )}

          <div className="dropdown dropdown-end">
            <motion.label 
              tabIndex={0} 
              className={`btn btn-ghost btn-circle rounded-full ${
                isDark ? 'hover:bg-white/20' : 'hover:bg-white/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BsThreeDotsVertical className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </motion.label>
            <ul
              tabIndex={0}
              className={`dropdown-content menu p-3 shadow-2xl border rounded-2xl w-56 z-50 ${
                isDark 
                  ? 'bg-gray-800/95 border-white/20 backdrop-blur-md' 
                  : 'bg-white/95 border-pink-200/50 backdrop-blur-md'
              }`}
            >
              {isAuthor ? (
                <>
                  <li>
                    <a
                      onClick={() => {
                        setEditedContent(post.content);
                        setIsEditModalOpen(true);
                      }}
                      className={`rounded-xl ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'}`}
                    >
                      <FiEdit2 /> Edit Post
                    </a>
                  </li>
                  <li>
                    <a 
                      onClick={handlePrivacyToggle}
                      className={`rounded-xl ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'}`}
                    >
                      {post.privacy === 'public' ? <FiEyeOff /> : <FiEye />} 
                      Set to {post.privacy === 'public' ? 'Private' : 'Public'}
                    </a>
                  </li>
                  <div className={`divider my-1 ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}></div>
                  <li>
                    <a 
                      onClick={handleDelete} 
                      className="text-red-500 font-semibold rounded-xl hover:bg-red-500/20"
                    >
                      <FiTrash2 /> Delete Post
                    </a>
                  </li>
                </>
              ) : (
                <li>
                  <a 
                    onClick={() => setIsReportModalOpen(true)}
                    className={`rounded-xl ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'}`}
                  >
                    <FiFlag /> Report Post
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="my-6">
        <p className={`text-base leading-relaxed whitespace-pre-wrap ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {post.content}
        </p>
      </div>

      {/* Reactions & Comments Summary */}
      <div className={`flex justify-between items-center text-sm mb-4 pt-4 border-t border-dashed ${
        isDark ? 'border-white/20 text-gray-400' : 'border-pink-200/50 text-gray-500'
      }`}>
        <span className={`flex items-center gap-2 transition-colors cursor-pointer ${
          isDark ? 'hover:text-indigo-400' : 'hover:text-pink-500'
        }`}>
          <AiOutlineHeart className="text-lg" /> 
          {totalReactions} {totalReactions === 1 ? 'Reaction' : 'Reactions'}
        </span>
        <span className={`flex items-center gap-2 transition-colors cursor-pointer ${
          isDark ? 'hover:text-purple-400' : 'hover:text-rose-500'
        }`}>
          <FaRegCommentDots className="text-lg" /> 
          {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>

      {/* Interactive Reactions & Comments */}
      <div className="flex justify-around items-center pt-3">
        <Reactions post={post} />
        <CommentSection post={post} highlightedCommentId={highlightedCommentId} />
      </div>

      {/* Edit Modal */}
      <dialog
        id={`edit_modal_${post._id}`}
        className={`modal ${isEditModalOpen ? 'modal-open' : ''} backdrop-blur-sm`}
      >
        <motion.div 
          className={`modal-box border shadow-2xl rounded-3xl max-w-2xl ${
            isDark 
              ? 'bg-gray-800/95 border-white/20 backdrop-blur-md' 
              : 'bg-white/95 border-pink-200/50 backdrop-blur-md'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <h3 className={`font-bold text-2xl mb-6 bg-clip-text text-transparent ${
            isDark 
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-pink-500 to-rose-500'
          }`}>
            Update Your Post
          </h3>
          <form onSubmit={handleEditSubmit} className="py-4">
            <textarea
              className={`w-full p-4 rounded-xl border-2 border-transparent text-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDark 
                  ? 'bg-gray-700/50 text-gray-300 placeholder:text-gray-400 focus:bg-gray-700/70 focus:border-indigo-500 focus:ring-indigo-500/30' 
                  : 'bg-white/80 text-gray-600 placeholder:text-gray-500 focus:bg-white/90 focus:border-pink-500 focus:ring-pink-500/30'
              }`}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="8"
              placeholder="What's on your mind?"
            />
            <div className="flex justify-end items-center gap-3 mt-6">
              <motion.button 
                type="button" 
                className={`btn btn-ghost rounded-xl ${
                  isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'
                }`}
                onClick={() => setIsEditModalOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={`btn border-none text-white font-bold rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'
                }`}
                disabled={editMutation.isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {editMutation.isLoading ? 
                  <span className="loading loading-spinner loading-sm"></span> : 
                  'Save Changes'
                }
              </motion.button>
            </div>
          </form>
        </motion.div>
      </dialog>

      {/* Report Modal */}
      <ReportModal
  isOpen={isReportModalOpen}
  onClose={() => setIsReportModalOpen(false)}
  contentId={post._id}
  contentType="post"
/>
    </motion.div>
  );
};

export default PostCard;