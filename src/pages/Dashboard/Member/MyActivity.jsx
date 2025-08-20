// 📁 File: src/pages/Dashboard/Member/MyActivity.jsx

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import PostCard from '../../../components/Community/PostCard';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { FaEdit, FaComments, FaUserFriends, FaHeart, FaComment, FaEye, FaShareAlt, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
    { id: 'my-posts', label: 'My Posts', icon: FaEdit },
    { id: 'engagements', label: 'Engagements', icon: FaComments },
    { id: 'followers', label: 'Followers', icon: FaUserFriends },
];

// --- MyPostsTab Component (Integrated) ---
const MyPostsTab = ({ isDark }) => {
    const { data: myPosts = [], isLoading } = useQuery({
        queryKey: ['my-posts'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/my-posts');
            return data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center py-12">
            <span className={`loading loading-dots loading-lg ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}></span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {myPosts.length > 0 ? (
                <motion.div 
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {myPosts.map((post, index) => (
                        <motion.div
                            key={post._id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300`}>
                                <PostCard post={post} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    className={`text-center py-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-3xl shadow-lg`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className={`w-20 h-20 mx-auto mb-6 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} flex items-center justify-center`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <FaEdit className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        You haven't posted anything yet.
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                        Share your thoughts with the community!
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                            to="/community" 
                            className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                        >
                            <FaEdit className="mr-2" /> Create Your First Post
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

// --- EngagementsTab Component (Integrated) ---
const EngagementsTab = ({ isDark }) => {
    const { data: engagements = { comments: [], reactions: [] }, isLoading } = useQuery({
        queryKey: ['my-engagements'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/engagements');
            return data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center py-12">
            <span className={`loading loading-dots loading-lg ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}></span>
        </div>
    );

    const { comments, reactions } = engagements;

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Comments Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}>
                    <FaComment /> Latest Comments on Your Posts
                </h3>
                {comments.length > 0 ? (
                    <motion.div 
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {comments.map((comment, index) => (
                            <motion.div 
                                key={comment._id}
                                className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border p-6 rounded-2xl shadow-lg hover:scale-[1.01] transition-all duration-300`}
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    visible: { opacity: 1, x: 0 }
                                }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'}`}>
                                        <FaComment className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                                            <span className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                                {comment.authorInfo.name}
                                            </span> commented: "{comment.content || 'sticker'}"
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <Link 
                                                to={`/post/${comment.postId}?highlight=${comment._id}`}
                                                className={`text-sm font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-pink-500 hover:text-pink-600'} hover:underline transition-colors duration-200`}
                                            >
                                                <FaEye className="inline mr-1" /> View Post
                                            </Link>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        className={`text-center py-16 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-2xl shadow-lg`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} flex items-center justify-center`}>
                            <FaComment className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        </div>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No one has commented on your posts yet.
                        </p>
                    </motion.div>
                )}
            </motion.div>

            {/* Reactions Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}>
                    <FaHeart /> Latest Reactions on Your Posts
                </h3>
                {reactions.length > 0 ? (
                    <motion.div 
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        <motion.div 
                            className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border p-6 rounded-2xl shadow-lg`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-center`}>
                                Reaction display coming soon...
                            </p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div 
                        className={`text-center py-16 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-2xl shadow-lg`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${isDark ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20' : 'bg-gradient-to-br from-red-500/20 to-pink-500/20'} flex items-center justify-center`}>
                            <FaHeart className="w-6 h-6 text-red-500" />
                        </div>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No one has reacted to your posts yet.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

// --- FollowersTab Component (Integrated) ---
const FollowersTab = ({ isDark }) => {
    const { data: followers = [], isLoading } = useQuery({
        queryKey: ['my-followers'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/my-followers');
            return data;
        }
    });

    if (isLoading) return (
        <div className="flex justify-center py-12">
            <span className={`loading loading-dots loading-lg ${isDark ? 'text-indigo-400' : 'text-pink-500'}`}></span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {followers.length > 0 ? (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {followers.map((user, index) => (
                        <motion.div 
                            key={user._id}
                            className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border p-6 rounded-3xl shadow-lg hover:scale-[1.02] transition-all duration-300`}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="avatar">
                                    <div className={`w-16 h-16 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                                        <img src={user.image} alt={user.name} />
                                    </div>
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <p className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                        {user.name}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {user.email || 'No email provided'}
                                    </p>
                                </div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link 
                                        to={`/profiles/${user._id}`}
                                        className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 w-full sm:w-auto`}
                                    >
                                        <FaUser className="mr-1" /> View Profile
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    className={`text-center py-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-3xl shadow-lg`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className={`w-20 h-20 mx-auto mb-6 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} flex items-center justify-center`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <FaUserFriends className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        You have no followers yet.
                    </h3>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
                        Start engaging with the community to gain followers!
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                            to="/community" 
                            className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                        >
                            <FaUserFriends className="mr-2" /> Join Community
                        </Link>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

// --- Main MyActivity Component ---
const MyActivity = () => {
    // --- Theme Management ---
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'light';
        }
        return 'light';
    });
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

    const [activeTab, setActiveTab] = useState(tabs[0].id);

    const renderContent = () => {
        switch (activeTab) {
            case 'my-posts':
                return <MyPostsTab isDark={isDark} />;
            case 'engagements':
                return <EngagementsTab isDark={isDark} />;
            case 'followers':
                return <FollowersTab isDark={isDark} />;
            default:
                return null;
        }
    };

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isDark ? 'bg-blue-500/15' : 'bg-orange-400/10'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent mb-2`}>
                        My Activity
                    </h1>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                        Track your contributions and engagements across the community.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border rounded-2xl p-2 shadow-lg`}>
                        <div className="flex flex-col sm:flex-row gap-2">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 py-3 px-4 sm:px-6 font-semibold text-sm sm:text-lg transition-all duration-300 rounded-xl ${
                                        activeTab === tab.id 
                                            ? (isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/30')
                                            : (isDark ? 'text-gray-300 hover:bg-white/10 hover:text-gray-100' : 'text-gray-600 hover:bg-white/60 hover:text-gray-800')
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                    </div>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            className="absolute inset-0 rounded-xl pointer-events-none"
                                            layoutId="activeTab"
                                            style={{
                                                background: isDark
                                                    ? 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
                                                    : 'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(244, 63, 94, 0.1))',
                                            }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MyActivity;