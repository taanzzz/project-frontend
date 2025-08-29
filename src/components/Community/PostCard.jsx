import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import axiosSecure from '../../api/Axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import Reactions from './Reactions';
import CommentSection from './CommentSection';
import Swal from 'sweetalert2';
import ReportModal from './ReportModal';
import { BsThreeDotsVertical, BsGlobe, BsLockFill } from 'react-icons/bs';
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiFlag, FiClock, FiTrendingUp } from 'react-icons/fi';
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegCommentDots, FaCheckCircle, FaCrown, FaFire, FaStar } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import { HiOutlineStatusOnline, HiSparkles } from "react-icons/hi";

const PostCard = ({ post, highlightedCommentId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: currentUserProfile } = useUserProfile();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAuthor = user?.email === post.authorInfo.email;
  const isFollowing = currentUserProfile?.following?.includes(post.authorId);

  // Detect reduced motion preference and mobile screen size
  const prefersReducedMotion = useReducedMotion();
  const isMobile = window.innerWidth < 640; // Tailwind's sm breakpoint

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

  // Truncate name for mobile
  const displayName = isMobile && post.authorInfo.name.split(' ').length > 1
    ? `${post.authorInfo.name.split(' ')[0]}...`
    : post.authorInfo.name;

  const floatingVariants = {
    animate: {
      y: prefersReducedMotion || isMobile ? 0 : [-2, 2, -2],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const pulseGlow = {
    animate: {
      boxShadow: prefersReducedMotion || isMobile ? undefined : [
        `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`,
        `0 0 40px ${isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(236, 72, 153, 0.25)'}`,
        `0 0 20px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`
      ],
      transition: prefersReducedMotion || isMobile ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <>
      <motion.div
        className={`relative p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg mb-6 sm:mb-8 border transition-all duration-500 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border-white/10 shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/30'
            : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border-pink-200/30 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/30'
        } backdrop-blur-2xl hover:scale-[1.01] max-w-4xl mx-auto overflow-hidden`}
        initial={{ opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={!(prefersReducedMotion || isMobile) ? { y: -2 } : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={pulseGlow}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <motion.div
            className={`absolute -top-8 -right-8 w-16 sm:w-24 h-16 sm:h-24 rounded-full blur-2xl opacity-20 ${
              isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
            }`}
            variants={floatingVariants}
            animate="animate"
          />

          <motion.div
            className={`absolute inset-0 rounded-3xl opacity-0 ${
              isDark
                ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-violet-500/20'
                : 'bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-orange-500/20'
            } transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Header: Avatar, Author info, More menu */}
        <div className="relative flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Enhanced Avatar with Premium Effects */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Ring */}
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                  isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'
                } p-0.5`}
                animate={isHovered && !(prefersReducedMotion || isMobile) ? { rotate: 360 } : { rotate: 0 }}
                transition={!(prefersReducedMotion || isMobile) ? { duration: 2, ease: "linear" } : {}}
              >
                <div className={`w-full h-full rounded-full ${
                  isDark ? 'bg-slate-900' : 'bg-white'
                }`} />
              </motion.div>

              <div className="avatar relative">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full shadow-xl border-2 ${
                  isDark ? 'border-indigo-400/30' : 'border-pink-400/30'
                } backdrop-blur-sm`}>
                  <img src={post.authorInfo.avatar} alt={`${post.authorInfo.name}'s avatar`} className="object-cover" />
                </div>
              </div>

              {/* Status Indicators */}
              <motion.div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full ${
                  isDark
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                } shadow-lg border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              >
                <HiOutlineStatusOnline className="w-3 h-3 text-white" />
              </motion.div>

              {/* Premium Badge for Author */}
              {isAuthor && (
                <motion.div
                  className={`absolute -top-2 -left-2 p-1.5 rounded-full ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : 'bg-gradient-to-br from-yellow-400 to-amber-500'
                  } shadow-lg border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 15 }}
                  whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                >
                  <FaCrown className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>

            {/* Author Information */}
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-center gap-2 mb-1"
                whileHover={!(prefersReducedMotion || isMobile) ? { x: 2 } : {}}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/profiles/${currentUserProfile?._id}`}>
                  <motion.p
                    className={`font-bold text-base sm:text-lg lg:text-xl hover:underline cursor-pointer truncate ${
                      isDark ? 'text-gray-100' : 'text-gray-700'
                    } flex items-center gap-2`}
                    whileHover={!(prefersReducedMotion || isMobile) ? { color: isDark ? '#8b5cf6' : '#ec4899' } : {}}
                  >
                    {displayName}
                    <FaCheckCircle className={`w-4 h-4 flex-shrink-0 ${
                      isDark ? 'text-indigo-400' : 'text-pink-500'
                    }`} />
                  </motion.p>
                </Link>
              </motion.div>

              <motion.div
                className={`flex items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                } flex-wrap`}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  <span>{timeAgo}</span>
                </div>

                {isAuthor && (
                  <>
                    <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>·</span>
                    <div className="flex items-center gap-1">
                      {post.privacy === 'public' ?
                        <BsGlobe className={`w-3 h-3 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} title="Public Post" /> :
                        <BsLockFill className={`w-3 h-3 ${isDark ? 'text-purple-400' : 'text-rose-500'}`} title="Private Post (Only Me)" />
                      }
                      <span className="text-xs">{post.privacy === 'public' ? 'Public' : 'Private'}</span>
                    </div>
                  </>
                )}

                {totalReactions > 5 && (
                  <>
                    <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>·</span>
                    <motion.div
                      className="flex items-center gap-1 text-orange-500"
                      animate={!(prefersReducedMotion || isMobile) ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: (prefersReducedMotion || isMobile) ? 0 : Infinity }}
                    >
                      <FaFire className="w-3 h-3" />
                      <span className="text-xs font-medium">Trending</span>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isAuthor && (
              <motion.button
                onClick={handleFollowToggle}
                className={`btn btn-sm rounded-full px-4 sm:px-6 border-none text-white font-semibold transition-all duration-300 relative overflow-hidden ${
                  isFollowing
                    ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30')
                    : (isDark ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/50 text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white' : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-400/50 text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white')
                }`}
                disabled={followMutation.isLoading}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={!(prefersReducedMotion || isMobile) ? {
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    x: [-100, 100]
                  } : {}}
                  transition={{ duration: 0.8, repeat: !(prefersReducedMotion || isMobile) ? Infinity : 0, repeatDelay: 2 }}
                />
                <span className="relative flex items-center gap-2">
                  {followMutation.isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <>
                      <FaStar className="w-3 h-3" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </>
                  )}
                </span>
              </motion.button>
            )}

            {/* More Options Dropdown */}
            <div className="dropdown dropdown-end">
              <motion.label
                tabIndex={0}
                className={`btn btn-ghost btn-circle rounded-full ${
                  isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'
                } backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl`}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05, rotate: 90 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <BsThreeDotsVertical className="text-lg sm:text-xl" />
              </motion.label>

              <motion.ul
                tabIndex={0}
                className={`dropdown-content menu p-2 sm:p-3 shadow-2xl border rounded-2xl w-52 sm:w-64 z-[100000] ${
                  isDark
                    ? 'bg-gray-800/95 border-white/20 backdrop-blur-2xl'
                    : 'bg-white/95 border-pink-200/50 backdrop-blur-2xl'
                }`}
                initial={{ opacity: 0, scale: 0.9, y: (prefersReducedMotion || isMobile) ? 0 : -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isAuthor ? (
                  <>
                    <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} transition={{ duration: 0.2 }}>
                      <a
                        onClick={() => {
                          setEditedContent(post.content);
                          setIsEditModalOpen(true);
                        }}
                        className={`rounded-xl p-2 sm:p-3 ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'} transition-all duration-300 flex items-center gap-3`}
                      >
                        <motion.div
                          className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-600'}`}
                          whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">Edit Post</p>
                          <p className="text-xs opacity-70">Modify your content</p>
                        </div>
                      </a>
                    </motion.li>

                    <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} transition={{ duration: 0.2 }}>
                      <a
                        onClick={handlePrivacyToggle}
                        className={`rounded-xl p-2 sm:p-3 ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'} transition-all duration-300 flex items-center gap-3`}
                      >
                        <motion.div
                          className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-rose-500/20 text-rose-600'}`}
                          whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                        >
                          {post.privacy === 'public' ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </motion.div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">Set to {post.privacy === 'public' ? 'Private' : 'Public'}</p>
                          <p className="text-xs opacity-70">Change visibility</p>
                        </div>
                      </a>
                    </motion.li>

                    <div className={`divider my-1 ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}></div>

                    <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} transition={{ duration: 0.2 }}>
                      <a
                        onClick={handleDelete}
                        className="text-red-400 font-semibold rounded-xl p-2 sm:p-3 hover:bg-red-500/20 transition-all duration-300 flex items-center gap-3"
                      >
                        <motion.div
                          className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 text-red-400"
                          whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </motion.div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base">Delete Post</p>
                          <p className="text-xs opacity-70">Remove permanently</p>
                        </div>
                      </a>
                    </motion.li>
                  </>
                ) : (
                  <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} transition={{ duration: 0.2 }}>
                    <a
                      onClick={() => setIsReportModalOpen(true)}
                      className={`rounded-xl p-2 sm:p-3 ${isDark ? 'hover:bg-white/20 text-gray-300' : 'hover:bg-white/90 text-gray-600'} transition-all duration-300 flex items-center gap-3`}
                    >
                      <motion.div
                        className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 text-red-400"
                        whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 5 } : {}}
                      >
                        <FiFlag className="w-4 h-4" />
                      </motion.div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Report Post</p>
                        <p className="text-xs opacity-70">Flag inappropriate content</p>
                      </div>
                    </a>
                  </motion.li>
                )}
              </motion.ul>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <motion.div
          className="relative my-4 sm:my-6"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className={`text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-wrap ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } selection:bg-gradient-to-r ${
              isDark ? 'selection:from-indigo-500/30 selection:to-purple-500/30' : 'selection:from-pink-500/30 selection:to-rose-500/30'
            }`}
            whileHover={!(prefersReducedMotion || isMobile) ? { y: -1 } : {}}
            transition={{ duration: 0.2 }}
          >
            {post.content}
          </motion.p>
        </motion.div>

        {/* Enhanced Stats & Engagement Bar */}
        <motion.div
          className={`relative pt-3 sm:pt-4 border-t border-dashed ${
            isDark ? 'border-white/20' : 'border-pink-200/50'
          }`}
          initial={{ opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={`flex justify-between items-center text-xs sm:text-sm mb-3 sm:mb-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <motion.div
              className={`flex items-center gap-2 transition-colors cursor-pointer group ${
                isDark ? 'hover:text-indigo-400' : 'hover:text-pink-500'
              }`}
              whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.02, x: 2 } : {}}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`p-1.5 rounded-full ${
                  isDark ? 'bg-indigo-500/20 group-hover:bg-indigo-500/30' : 'bg-pink-500/20 group-hover:bg-pink-500/30'
                } transition-colors duration-300`}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1 } : {}}
              >
                <AiOutlineHeart className="text-base sm:text-lg" />
              </motion.div>
              <span className="font-medium">
                {totalReactions} {totalReactions === 1 ? 'Reaction' : 'Reactions'}
              </span>
              {totalReactions > 10 && (
                <motion.div
                  animate={!(prefersReducedMotion || isMobile) ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: (prefersReducedMotion || isMobile) ? 0 : Infinity }}
                >
                  <FaFire className="text-orange-500 text-sm" />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className={`flex items-center gap-2 transition-colors cursor-pointer group ${
                isDark ? 'hover:text-purple-400' : 'hover:text-rose-500'
              }`}
              whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.02, x: -2 } : {}}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={`p-1.5 rounded-full ${
                  isDark ? 'bg-purple-500/20 group-hover:bg-purple-500/30' : 'bg-rose-500/20 group-hover:bg-rose-500/30'
                } transition-colors duration-300`}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1 } : {}}
              >
                <FaRegCommentDots className="text-base sm:text-lg" />
              </motion.div>
              <span className="font-medium">
                {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
              </span>
              {totalComments > 5 && (
                <motion.div
                  animate={!(prefersReducedMotion || isMobile) ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 3, repeat: (prefersReducedMotion || isMobile) ? 0 : Infinity }}
                >
                  <FiTrendingUp className={`${isDark ? 'text-indigo-400' : 'text-pink-500'} text-sm`} />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Interactive Reactions & Comments */}
          <motion.div
            className="flex flex-col sm:flex-row justify-around items-center pt-2 sm:pt-3 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className="flex-1 w-full sm:w-auto" whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.02 } : {}}>
              <Reactions post={post} />
            </motion.div>

            <motion.div className="flex-1 w-full sm:w-auto" whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.02 } : {}}>
              <CommentSection post={post} highlightedCommentId={highlightedCommentId} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* MODAL SECTION */}
      <dialog
        id={`edit_modal_${post._id}`}
        className={`modal ${isEditModalOpen ? 'modal-open' : ''} backdrop-blur-sm`}
      >
        <motion.div
          className={`modal-box z-50 border shadow-2xl rounded-3xl max-w-2xl sm:max-w-3xl ${
            isDark
              ? 'bg-gradient-to-br from-gray-800/95 via-gray-700/90 to-indigo-900/80 border-white/20 backdrop-blur-2xl'
              : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border-pink-200/50 backdrop-blur-2xl'
          } overflow-hidden relative p-4 sm:p-6`}
          initial={{ opacity: 0, scale: 0.9, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Modal Header */}
          <motion.div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-dashed border-opacity-30">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                className={`p-2 sm:p-3 rounded-2xl ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30'
                    : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
                } backdrop-blur-sm shadow-lg`}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05, rotate: [0, -3, 3, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <FiEdit2 className={`${isDark ? 'text-indigo-400' : 'text-pink-600'} text-xl sm:text-2xl`} />
              </motion.div>

              <div>
                <h3 className={`font-black text-xl sm:text-2xl lg:text-3xl bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500'
                } drop-shadow-sm`}>
                  Edit Your Post
                </h3>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Make changes to improve your content
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
            <motion.textarea
              className={`w-full p-4 sm:p-6 rounded-2xl border-2 border-transparent text-sm sm:text-lg transition-all duration-300 focus:outline-none focus:ring-0 resize-none ${
                isDark
                  ? 'bg-gray-700/60 text-gray-300 placeholder:text-gray-400 focus:bg-gray-700/80 focus:border-indigo-500 focus:ring-indigo-500/30'
                  : 'bg-white/90 text-gray-600 placeholder:text-gray-500 focus:bg-white/95 focus:border-pink-500 focus:ring-pink-500/30'
              } backdrop-blur-sm leading-relaxed`}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="6 sm:rows-8"
              placeholder="What's on your mind?"
              whileFocus={!(prefersReducedMotion || isMobile) ? { scale: 1.01 } : {}}
              transition={{ duration: 0.3 }}
            />

            <div className="flex justify-end items-center gap-3 sm:gap-4">
              <motion.button
                type="button"
                className={`btn btn-ghost rounded-2xl px-4 sm:px-6 ${
                  isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'
                } transition-all duration-300 text-sm sm:text-base`}
                onClick={() => setIsEditModalOpen(false)}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                className={`btn border-none text-white font-bold rounded-2xl px-6 sm:px-8 transition-all duration-300 relative overflow-hidden text-sm sm:text-base ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 hover:shadow-xl'
                }`}
                disabled={editMutation.isLoading}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={!(prefersReducedMotion || isMobile) ? {
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    x: [-100, 100]
                  } : {}}
                  transition={{ duration: 0.8, repeat: !(prefersReducedMotion || isMobile) ? Infinity : 0, repeatDelay: 1 }}
                />
                <span className="relative flex items-center gap-2">
                  {editMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <HiSparkles className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </span>
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
    </>
  );
};

export default PostCard;