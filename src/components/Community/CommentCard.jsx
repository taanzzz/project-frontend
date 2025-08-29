import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import axiosSecure from '../../api/Axios';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import Swal from 'sweetalert2';
import ReportModal from './ReportModal';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FiEdit2, FiTrash2, FiFlag, FiClock, FiShare2, FiBookmark } from 'react-icons/fi';
import { FaCheckCircle, FaCrown, FaStar, FaUserPlus, FaHeart } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: currentUserProfile } = useUserProfile();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAuthor = user?.email === post.authorInfo.email;
  const isFollowing = currentUserProfile?.following?.includes(post.authorId);

  // Detect reduced motion and mobile screen size
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

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  // Truncate name for mobile
  const displayName = isMobile && post.authorInfo.name.split(' ').length > 1
    ? `${post.authorInfo.name.split(' ')[0]}...`
    : post.authorInfo.name;

  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: (prefersReducedMotion || isMobile) ? 0 : 40, 
      scale: (prefersReducedMotion || isMobile) ? 1 : 0.95,
      filter: (prefersReducedMotion || isMobile) ? 'blur(0px)' : 'blur(6px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15
      }
    },
    hover: {
      y: (prefersReducedMotion || isMobile) ? 0 : -8,
      scale: (prefersReducedMotion || isMobile) ? 1 : 1.01,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 20, scale: (prefersReducedMotion || isMobile) ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: (prefersReducedMotion || isMobile) ? undefined : [
        `0 0 30px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`,
        `0 0 50px ${isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(236, 72, 153, 0.25)'}`,
        `0 0 30px ${isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(236, 72, 153, 0.15)'}`
      ],
      transition: { duration: 5, repeat: (prefersReducedMotion || isMobile) ? 0 : Infinity, ease: "easeInOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: (prefersReducedMotion || isMobile) ? 0 : [-3, 3, -3],
      x: (prefersReducedMotion || isMobile) ? 0 : [-1, 1, -1],
      rotate: (prefersReducedMotion || isMobile) ? 0 : [-0.5, 0.5, -0.5],
      transition: { duration: 8, repeat: (prefersReducedMotion || isMobile) ? 0 : Infinity, ease: "easeInOut" }
    }
  };

  return (
    <>
      <motion.article
        className={`relative p-4 sm:p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] mb-6 sm:mb-8 border transition-all duration-700 group ${
          isDark
            ? 'bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-indigo-900/90 border-white/10 shadow-2xl hover:shadow-indigo-500/20'
            : 'bg-gradient-to-br from-white/98 via-pink-50/95 to-rose-50/90 border-pink-200/30 shadow-2xl hover:shadow-pink-500/20'
        } backdrop-blur-2xl max-w-4xl mx-auto overflow-hidden cursor-pointer`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, margin: "-100px" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(67, 56, 202, 0.90) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 242, 0.95) 50%, rgba(255, 228, 230, 0.90) 100%)'
        }}
      >
        {/* Decorative Background Effects */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl lg:rounded-[2rem] pointer-events-none">
          <motion.div
            className={`absolute -top-12 sm:-top-16 -right-12 sm:-right-16 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-3xl opacity-20 ${
              isDark ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600' : 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-600'
            }`}
            variants={floatingVariants}
            animate={isHovered ? "animate" : ""}
          />
          <motion.div
            className={`absolute -bottom-8 sm:-bottom-12 -left-8 sm:-left-12 w-20 sm:w-24 h-20 sm:h-24 rounded-full blur-2xl opacity-15 ${
              isDark ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' : 'bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600'
            }`}
            variants={floatingVariants}
            animate={isHovered ? "animate" : ""}
            transition={{ delay: 1 }}
          />
          
          <div className={`absolute inset-0 opacity-5 ${isDark ? 'bg-white' : 'bg-gray-900'}`} 
               style={{
                 backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                 backgroundSize: '24px 24px'
               }} />
        </div>

        {/* Animated Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl lg:rounded-[2rem] pointer-events-none"
          variants={glowVariants}
          animate={isHovered ? "animate" : ""}
        />

        {/* Header Section */}
        <motion.header 
          className="relative flex items-start justify-between gap-3 sm:gap-6 mb-4 sm:mb-8"
          variants={childVariants}
        >
          <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
            {/* Enhanced Avatar */}
            <motion.div 
              className="relative flex-shrink-0" 
              whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05, rotate: 1 } : {}}
              transition={{ duration: 0.3, type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="avatar relative">
                <motion.div 
                  className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full shadow-2xl border-2 overflow-hidden ${
                    isDark ? 'border-indigo-400/40' : 'border-pink-400/40'
                  } ring-4 ring-white/10 transition-all duration-500`}
                  whileHover={!(prefersReducedMotion || isMobile) ? { 
                    borderColor: isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(236, 72, 153, 0.6)',
                    boxShadow: `0 0 30px ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)'}`
                  } : {}}
                >
                  <img 
                    src={post.authorInfo.avatar} 
                    alt={`${post.authorInfo.name}'s avatar`} 
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110" 
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDark 
                      ? 'from-indigo-900/30 via-transparent to-purple-900/30' 
                      : 'from-pink-900/30 via-transparent to-rose-900/30'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </motion.div>
              </div>
              
              {isAuthor && (
                <motion.div
                  className="absolute -top-2 -right-2 p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-xl border-2 border-white"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.4, 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 15,
                    duration: 0.6
                  }}
                  whileHover={!(prefersReducedMotion || isMobile) ? { 
                    scale: 1.1, 
                    rotate: 15,
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.5)'
                  } : {}}
                >
                  <FaCrown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
              )}

              <motion.div
                className={`absolute bottom-0 right-0 w-3 h-3 sm:w-5 sm:h-5 rounded-full border-2 shadow-lg ${
                  isDark 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-slate-900' 
                    : 'bg-gradient-to-br from-green-400 to-emerald-500 border-white'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
              />
            </motion.div>

            {/* Enhanced Author Info */}
            <div className="flex-1 min-w-0">
              <motion.div 
                className="flex items-center gap-2 sm:gap-3 mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link to={`/profiles/${currentUserProfile?._id}`}>
                  <h2 className={`font-bold text-base sm:text-xl lg:text-2xl ${
                    isDark ? 'text-gray-100' : 'text-gray-700'
                  } flex items-center gap-2 truncate`}>
                    {displayName}
                    <RiVerifiedBadgeFill className={`${
                      isDark ? 'text-indigo-400' : 'text-pink-500'
                    } w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0`} />
                  </h2>
                </Link>
                
                <motion.div
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                    isDark 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-400/30' 
                      : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600 border border-pink-400/30'
                  } backdrop-blur-md`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                >
                  <HiLightningBolt className="w-3 h-3 inline mr-1" />
                  Pro
                </motion.div>
              </motion.div>
              
              <motion.div 
                className={`flex items-center gap-2 text-xs sm:text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                } mt-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <FiClock className="w-3 h-3" />
                <time className="font-medium">{timeAgo}</time>
                <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                <span className="flex items-center gap-1">
                  <HiSparkles className="w-3 h-3" />
                  <span className="text-xs">Public</span>
                </span>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isAuthor && (
              <motion.button
                onClick={handleFollowToggle}
                className={`btn btn-xs sm:btn-md rounded-full px-3 sm:px-6 font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isFollowing 
                    ? isDark
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 border-0'
                    : isDark
                      ? 'border-2 border-indigo-400/50 text-indigo-400 hover:bg-indigo-400/10 hover:border-indigo-400'
                      : 'border-2 border-pink-400/50 text-pink-600 hover:bg-pink-400/10 hover:border-pink-400'
                }`}
                disabled={followMutation.isLoading}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05, y: -1 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                {followMutation.isLoading ? (
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                ) : isFollowing ? (
                  <FaStar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                ) : (
                  <FaUserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline text-xs sm:text-base">
                  {isFollowing ? 'Following' : 'Follow'}
                </span>
              </motion.button>
            )}

            <div className="dropdown dropdown-end">
              <motion.label 
                tabIndex={0} 
                className={`btn btn-ghost btn-circle btn-xs sm:btn-md transition-all duration-300 ${
                  isDark 
                    ? 'text-gray-300 hover:bg-white/20 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 90 } : {}}
                whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.9 } : {}}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <BsThreeDotsVertical className="text-base sm:text-lg" />
              </motion.label>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul 
                    tabIndex={0} 
                    className={`dropdown-content menu p-2 sm:p-3 shadow-2xl border rounded-2xl w-48 sm:w-56 z-[1000] backdrop-blur-xl ${
                      isDark 
                        ? 'bg-slate-800/95 border-white/20 text-gray-200' 
                        : 'bg-white/95 border-gray-200/50 text-gray-700'
                    }`}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthor ? (
                      <>
                        <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.98 } : {}}>
                          <a onClick={() => { 
                            setEditedContent(post.content); 
                            setIsEditModalOpen(true); 
                            setIsDropdownOpen(false);
                          }} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-colors">
                            <FiEdit2 className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Edit Post</span>
                          </a>
                        </motion.li>
                        <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.98 } : {}}>
                          <a onClick={() => {
                            handleDelete();
                            setIsDropdownOpen(false);
                          }} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Delete Post</span>
                          </a>
                        </motion.li>
                      </>
                    ) : (
                      <>
                        <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.98 } : {}}>
                          <a className="flex items-center gap-3 p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-colors">
                            <FiShare2 className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Share Post</span>
                          </a>
                        </motion.li>
                        <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.98 } : {}}>
                          <a className="flex items-center gap-3 p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-colors">
                            <FiBookmark className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Save Post</span>
                          </a>
                        </motion.li>
                        <motion.li whileHover={!(prefersReducedMotion || isMobile) ? { x: 4 } : {}} whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.98 } : {}}>
                          <a onClick={() => {
                            setIsReportModalOpen(true);
                            setIsDropdownOpen(false);
                          }} className="flex items-center gap-3 p-2 sm:p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors">
                            <FiFlag className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Report Post</span>
                          </a>
                        </motion.li>
                      </>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Enhanced Content Section */}
        <motion.main 
          className="relative"
          variants={childVariants}
          initial={{ opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div 
            className={`prose prose-sm sm:prose-lg max-w-none ${
              isDark 
                ? 'prose-invert prose-headings:text-gray-100 prose-p:text-gray-200' 
                : 'prose-gray prose-headings:text-gray-800 prose-p:text-gray-700'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className={`text-sm sm:text-lg lg:text-xl leading-relaxed font-medium ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`} style={{ lineHeight: '1.8', letterSpacing: '0.01em' }}>
              {post.content}
            </p>
          </motion.div>

          <motion.div 
            className={`flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 p-3 sm:p-4 rounded-2xl backdrop-blur-md border ${
              isDark 
                ? 'bg-white/5 border-white/10' 
                : 'bg-gray-50/50 border-gray-200/30'
            }`}
            initial={{ opacity: 0, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={!(prefersReducedMotion || isMobile) ? { 
              y: -2,
              boxShadow: isDark 
                ? '0 8px 30px rgba(99, 102, 241, 0.2)' 
                : '0 8px 30px rgba(236, 72, 153, 0.2)'
            } : {}}
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mb-3 sm:mb-0">
              <motion.div 
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold"
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
              >
                <div className={`p-1.5 sm:p-2 rounded-full ${
                  isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-pink-500/20 text-pink-500'
                }`}>
                  <HiSparkles className="w-3 sm:w-4 h-3 sm:h-4" />
                </div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  1.2k views
                </span>
              </motion.div>

              <motion.div 
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold"
                whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
              >
                <div className={`p-1.5 sm:p-2 rounded-full ${
                  isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-500/20 text-red-500'
                }`}>
                  <FaHeart className="w-3 sm:w-4 h-3 sm:h-4" />
                </div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {Object.values(post.reactions || {}).reduce((a, b) => a + b, 0)} reactions
                </span>
              </motion.div>
            </div>

            <motion.div
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs font-bold flex items-center gap-2 ${
                isDark 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-400/30' 
                  : 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-600 border border-pink-400/30'
              } backdrop-blur-md`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 400 }}
              whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1 } : {}}
            >
              <HiLightningBolt className="w-3 h-3" />
              <span>Trending</span>
            </motion.div>
          </motion.div>
        </motion.main>

        <motion.div
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex flex-col gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className={`p-2 sm:p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
              isDark 
                ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20' 
                : 'bg-white/80 border-gray-200/50 text-gray-600 hover:bg-white'
            }`}
            whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, rotate: 15 } : {}}
            whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.9 } : {}}
          >
            <FiShare2 className="w-3 sm:w-4 h-3 sm:h-4" />
          </motion.button>
          
          <motion.button
            className={`p-2 sm:p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
              isDark 
                ? 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20' 
                : 'bg-white/80 border-gray-200/50 text-gray-600 hover:bg-white'
            }`}
            whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.1, y: -2 } : {}}
            whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.9 } : {}}
          >
            <FiBookmark className="w-3 sm:w-4 h-3 sm:h-4" />
          </motion.button>
        </motion.div>
      </motion.article>

      <AnimatePresence>
        {isEditModalOpen && (
          <div className="modal modal-open backdrop-blur-sm fixed inset-0 z-[9999] flex justify-center items-center">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
            />
            
            <motion.div 
              className={`modal-box max-w-lg sm:max-w-2xl relative border shadow-2xl rounded-3xl p-4 sm:p-6 ${
                isDark 
                  ? 'bg-slate-800/95 border-white/20 backdrop-blur-xl' 
                  : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'
              }`}
              initial={{ opacity: 0, scale: 0.9, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: (prefersReducedMotion || isMobile) ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className={`font-bold text-lg sm:text-xl mb-4 sm:mb-6 flex items-center gap-3 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>
                <FiEdit2 className="w-4 sm:w-5 h-4 sm:h-5" />
                Edit Post
              </h3>
              
              <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                <textarea 
                  value={editedContent} 
                  onChange={(e) => setEditedContent(e.target.value)} 
                  rows="5 sm:rows-6" 
                  className={`w-full p-3 sm:p-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700/50 border-white/20 text-gray-200 focus:ring-indigo-500 placeholder-gray-400' 
                      : 'bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-pink-500 placeholder-gray-500'
                  } backdrop-blur-md text-sm sm:text-base`}
                  placeholder="What's on your mind?"
                />
                
                <div className="flex justify-end items-center gap-2 sm:gap-3">
                  <motion.button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className={`btn btn-ghost rounded-xl text-sm sm:text-base ${
                      isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05 } : {}}
                    whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button 
                    type="submit" 
                    className={`btn border-none text-white font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg transition-all duration-300 text-sm sm:text-base ${
                      isDark ? '' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                    }`} 
                    disabled={editMutation.isLoading}
                    whileHover={!(prefersReducedMotion || isMobile) ? { scale: 1.05, y: -1 } : {}}
                    whileTap={!(prefersReducedMotion || isMobile) ? { scale: 0.95 } : {}}
                  >
                    {editMutation.isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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