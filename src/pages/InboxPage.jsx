import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
// Using a simple time ago function instead of date-fns
const formatDistanceToNow = (date, options = {}) => {
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m${options.addSuffix ? ' ago' : ''}`;
    if (diffInHours < 24) return `${diffInHours}h${options.addSuffix ? ' ago' : ''}`;
    if (diffInDays < 7) return `${diffInDays}d${options.addSuffix ? ' ago' : ''}`;
    return date.toLocaleDateString();
};
import { FaSearch, FaPlus } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import { FiMessageSquare } from "react-icons/fi";
import { motion } from 'framer-motion';

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

// --- ActiveUserList Component (Redesigned) ---
const ActiveUserList = ({ isDark }) => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['active-users-suggestions'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/users/suggestions');
            return data;
        },
        enabled: !!currentUser,
    });

    const mutation = useMutation({
        mutationFn: (recipientId) => axiosSecure.post('/api/messages/conversations/find-or-create', { recipientId }),
        onSuccess: (data) => {
            const { conversationId } = data.data;
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate(`/messages/${conversationId}`);
        }
    });

    const handleUserClick = (recipientId) => {
        mutation.mutate(recipientId);
    };

    if (isLoading) {
        return (
            <div className={`flex-shrink-0 px-6 pt-6 pb-4 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                <div className="h-28 flex items-center justify-center">
                    <span className="loading loading-dots loading-md"></span>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            className={`flex-shrink-0 px-6 pt-6 pb-4 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 px-1 uppercase`}>
                Start a Conversation
            </h2>
            <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-thin">
                {users.map((user, index) => (
                    <motion.div
                        onClick={() => handleUserClick(user._id)}
                        key={user._id}
                        className="flex flex-col items-center justify-center space-y-3 p-3 w-20 flex-shrink-0 group cursor-pointer rounded-xl transition-all duration-300 hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="avatar">
                            <div className={`w-16 h-16 rounded-full ring-2 ring-offset-2 transition-all duration-300 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900 group-hover:ring-indigo-400' : 'ring-pink-400/50 ring-offset-white group-hover:ring-pink-400'}`}>
                                <img src={user.image} alt={user.name} />
                            </div>
                        </div>
                        <p className={`text-xs w-full text-center truncate font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.name}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// --- ConversationList Component (Redesigned) ---
const ConversationList = ({ isDark }) => {
    const { conversationId: selectedConversationId } = useParams();
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/messages/conversations');
            return data;
        },
        enabled: !!currentUser,
    });

    useEffect(() => {
        const handleNewMessage = () => queryClient.invalidateQueries({ queryKey: ['conversations'] });
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [queryClient]);

    if (isLoading) {
        return (
            <div className="flex-grow flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex-grow overflow-y-auto px-2 pb-4">
            {conversations.length > 0 ? (
                <motion.ul 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    {conversations.map((convo, index) => (
                        <motion.li
                            key={convo._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                        >
                            <Link 
                                to={`/messages/${convo._id}`} 
                                className={`flex items-center p-4 mx-2 rounded-xl cursor-pointer transition-all duration-300 border-l-4 ${
                                    selectedConversationId === convo._id 
                                    ? isDark 
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border-indigo-400 backdrop-blur-md' 
                                        : 'bg-gradient-to-r from-pink-500/20 to-rose-500/10 border-pink-400 backdrop-blur-md'
                                    : isDark
                                        ? 'border-transparent hover:bg-white/10 backdrop-blur-md'
                                        : 'border-transparent hover:bg-white/80 backdrop-blur-md'
                                } shadow-sm hover:shadow-lg hover:scale-[1.02]`}
                            >
                                <div className="avatar mr-4 online">
                                    <div className={`w-14 h-14 rounded-full ring-2 ring-offset-2 transition-all duration-300 ${
                                        selectedConversationId === convo._id
                                        ? isDark 
                                            ? 'ring-indigo-400/50 ring-offset-gray-900' 
                                            : 'ring-pink-400/50 ring-offset-white'
                                        : isDark
                                            ? 'ring-gray-600/30 ring-offset-gray-900'
                                            : 'ring-gray-300/50 ring-offset-white'
                                    }`}>
                                        <img src={convo.otherParticipant.image} alt={convo.otherParticipant.name} />
                                    </div>
                                </div>
                                <div className="w-full overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className={`font-bold text-lg ${
                                            selectedConversationId === convo._id 
                                            ? isDark
                                                ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'
                                                : 'bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent'
                                            : isDark ? 'text-gray-100' : 'text-gray-600'
                                        }`}>
                                            {convo.otherParticipant.name}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} truncate mt-1`}>
                                        {convo.lastMessage}
                                    </p>
                                </div>
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>
            ) : (
                <motion.div 
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className={`p-6 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md mb-6`}>
                        <FiMessageSquare className={`text-6xl ${isDark ? 'text-gray-400' : 'text-gray-500'} opacity-50`} />
                    </div>
                    <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                        No Conversations Yet
                    </h3>
                    <p className={`max-w-xs mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed`}>
                        Start a new conversation by selecting a user from the list above.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

// --- Main InboxPage Component (Redesigned) ---
const InboxPage = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
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

    return (
        <div className={`relative overflow-hidden h-full flex flex-col ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'}`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            {/* Header */}
            <motion.div 
                className={`relative z-10 flex-shrink-0 p-6 flex justify-between items-center border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'} backdrop-blur-md`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <h1 className={`text-4xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                    Messages
                </h1>
                <motion.button 
                    className={`btn btn-ghost btn-circle ${isDark ? 'hover:bg-white/20' : 'hover:bg-white/90'} transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaSearch className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </motion.button>
            </motion.div>
            
            <div className="relative z-10 flex-grow flex flex-col overflow-hidden">
                <ActiveUserList isDark={isDark} />

                <motion.div 
                    className="px-6 mt-6 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                >
                    <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'} px-1 uppercase`}>
                        Recent Chats
                    </h2>
                </motion.div>

                <ConversationList isDark={isDark} />
                
                {/* Floating Action Button */}
                <motion.div 
                    className="absolute bottom-6 right-6 z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.8 }}
                >
                    <div className="tooltip tooltip-left" data-tip="New Message">
                        <motion.button 
                            className={`btn btn-circle border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30'} shadow-lg transition-all duration-300`}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaPlus className="text-xl" />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InboxPage;