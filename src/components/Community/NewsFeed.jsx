import React, { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import io from 'socket.io-client';

import axiosSecure from '../../api/Axios';

import PostCard from './PostCard';

import LoadingSpinner from '../Shared/LoadingSpinner';

import { motion } from 'framer-motion';

import { FaStream, FaInbox, FaFire, FaMagic, FaGlobe } from "react-icons/fa";

import { FiTrendingUp, FiRefreshCw, FiActivity } from "react-icons/fi";

import { HiSparkles } from 'react-icons/hi';

// Connect to backend socket URL (use env or fallback to localhost)

const socket = io.connect(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const NewsFeed = () => {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const { data: posts = [], isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/posts');
            return res.data;
        },
        // 👇️👇️👇️ এই দুটি লাইন যোগ করা হয়েছে সমস্যা সমাধানের জন্য 👇️👇️👇️
        staleTime: 1000 * 60 * 2, // ডেটা ২ মিনিট পর্যন্ত ফ্রেশ থাকবে
        keepPreviousData: true,    // নতুন ডেটা লোড হওয়ার সময় পুরনো ডেটা দেখানো হবে
        // 👆️👆️👆️ উপরে উল্লেখিত পরিবর্তন করা হয়েছে 👆️👆️👆️
    });
    
  // Setup socket listeners on mount and clean up on unmount
  useEffect(() => {
    // Listen for new posts from socket and prepend if new
    socket.on('new_post', (newPost) => {
      console.log('New post received via socket:', newPost);
      queryClient.setQueryData(['posts'], (oldData = []) => {
        if (oldData.find((post) => post._id === newPost._id)) {
          return oldData; // Avoid duplicates
        }
        return [newPost, ...oldData];
      });
    });

    // Listen for reaction updates and update specific post
    socket.on('update_reaction', ({ postId, reactions, totalReactions }) => {
      console.log('Reaction update received for post:', postId);
      queryClient.setQueryData(['posts'], (oldData = []) =>
        oldData.map((post) =>
          post._id === postId ? { ...post, reactions, totalReactions } : post
        )
      );
    });

    return () => {
      socket.off('new_post');
      socket.off('update_reaction');
    };
  }, [queryClient]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['posts'] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-3, 3, -3],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Loading Header */}
        <motion.div
          className={`relative p-6 sm:p-8 ${
            isDark
              ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20'
              : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
          } backdrop-blur-2xl rounded-3xl max-w-4xl mx-auto`}
          variants={floatingVariants}
          animate="animate"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <LoadingSpinner />
              <motion.div
                className={`absolute inset-0 rounded-full border-2 border-transparent ${
                  isDark
                    ? 'border-t-indigo-400 border-r-purple-400'
                    : 'border-t-pink-500 border-r-rose-500'
                }`}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="text-center">
              <motion.h3
                className={`font-bold text-xl lg:text-2xl bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
                    : 'bg-gradient-to-r from-pink-600 to-rose-500'
                }`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading Community Feed
              </motion.h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Fetching the latest posts for you...
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading Skeleton Posts */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`p-6 rounded-3xl ${
              isDark
                ? 'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-indigo-900/40 border border-white/10'
                : 'bg-gradient-to-br from-white/80 via-pink-50/60 to-rose-50/40 border border-pink-200/30'
            } backdrop-blur-md max-w-4xl mx-auto animate-pulse`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200/60'}`}></div>
              <div className="flex-1">
                <div className={`h-4 w-32 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200/60'} mb-2`}></div>
                <div className={`h-3 w-24 rounded ${isDark ? 'bg-white/5' : 'bg-gray-100/60'}`}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`h-4 w-full rounded ${isDark ? 'bg-white/10' : 'bg-gray-200/60'}`}></div>
              <div className={`h-4 w-4/5 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200/60'}`}></div>
              <div className={`h-4 w-3/5 rounded ${isDark ? 'bg-white/10' : 'bg-gray-200/60'}`}></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        className={`text-center p-8 rounded-3xl ${
          isDark
            ? 'bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/20 text-red-300'
            : 'bg-gradient-to-br from-red-50/80 to-red-100/60 border border-red-200/50 text-red-600'
        } backdrop-blur-md max-w-4xl mx-auto`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaInbox className="mx-auto text-4xl opacity-60" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="mb-4">Error fetching posts: {error.message}</p>
        <motion.button
          onClick={handleRefresh}
          className={`btn ${
            isDark
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30'
              : 'bg-red-100 hover:bg-red-200 text-red-600 border-red-300'
          } rounded-xl`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Feed Header */}
      <motion.div
        className={`relative p-6 sm:p-8 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-indigo-900/80 border border-white/10 shadow-2xl shadow-indigo-500/20'
            : 'bg-gradient-to-br from-white/95 via-pink-50/90 to-rose-50/80 border border-pink-200/30 shadow-2xl shadow-pink-500/20'
        } backdrop-blur-2xl rounded-3xl max-w-4xl mx-auto overflow-hidden`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
              isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'
            }`}
            variants={floatingVariants}
            animate="animate"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className={`p-3 rounded-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30'
                  : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30'
              } backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.6 }}
            >
              <FaStream className={`${isDark ? 'text-indigo-400' : 'text-pink-600'} text-2xl`} />
            </motion.div>
            
            <div>
              <motion.h2
                className={`font-black text-2xl lg:text-3xl bg-clip-text text-transparent ${
                  isDark
                    ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400'
                    : 'bg-gradient-to-r from-pink-600 via-rose-500 to-orange-500'
                } drop-shadow-sm flex items-center gap-3`}
                whileHover={{ scale: 1.02 }}
              >
                Community Feed
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <HiSparkles className={`${isDark ? 'text-yellow-400' : 'text-amber-500'} text-xl animate-pulse`} />
                </motion.div>
              </motion.h2>
              
              <motion.div
                className={`flex items-center gap-4 mt-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>Live updates</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <FiActivity className="w-3 h-3" />
                  <span>{posts.length} posts</span>
                </div>

                <div className="flex items-center gap-1">
                  <FaGlobe className="w-3 h-3" />
                  <span>Global</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`btn btn-circle ${
              isDark
                ? 'bg-white/10 hover:bg-white/20 text-gray-300 border-white/20'
                : 'bg-pink-100/60 hover:bg-pink-200/60 text-gray-600 border-pink-200/50'
            } backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <FiRefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      {/* Posts Content */}
      {posts.length === 0 ? (
        <motion.div
          className={`text-center py-20 px-6 rounded-3xl max-w-4xl mx-auto ${
            isDark
              ? 'bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-indigo-900/20 border border-white/10'
              : 'bg-gradient-to-br from-white/80 via-pink-50/60 to-rose-50/40 border border-pink-200/30'
          } backdrop-blur-md relative overflow-hidden`}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Background Animation */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${
              isDark ? 'from-indigo-500/5 to-purple-500/5' : 'from-pink-500/5 to-rose-500/5'
            }`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <motion.div
              className="mb-6"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaInbox className={`mx-auto text-6xl lg:text-7xl ${
                isDark ? 'text-gray-600' : 'text-gray-300'
              } opacity-50`} />
            </motion.div>
            
            <motion.h3
              className={`text-3xl lg:text-4xl font-black mb-4 bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                  : 'bg-gradient-to-r from-gray-500 to-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              No posts yet
            </motion.h3>
            
            <motion.p
              className={`text-lg lg:text-xl mb-8 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } max-w-2xl mx-auto leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Be the first to share something positive and educational with the community!
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: FaMagic, text: "Share insights" },
                { icon: FiTrendingUp, text: "Start discussions" },
                { icon: FaFire, text: "Inspire others" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-gray-400'
                      : 'bg-gray-100/60 border border-gray-200/50 text-gray-500'
                  } backdrop-blur-sm`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-8"
          variants={containerVariants}
        >
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              variants={itemVariants}
              custom={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Load More Indicator (if needed) */}
      {posts.length > 0 && (
        <motion.div
          className={`text-center py-8 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-2 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <HiSparkles className="w-4 h-4" />
            <span>You're all caught up!</span>
            <HiSparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsFeed;