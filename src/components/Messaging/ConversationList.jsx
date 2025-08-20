import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../Shared/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

// Date formatting utility
const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) return 'just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
};

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

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

    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/messages/conversations');
            return data;
        },
        enabled: !!currentUser,
    });

    useEffect(() => {
        const handleNewMessage = () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        };
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [queryClient]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden flex-grow ${isDark ? 'bg-gradient-to-b from-gray-900/95 to-indigo-950/95' : 'bg-gradient-to-b from-pink-50/95 to-rose-50/95'} backdrop-blur-md`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-1/4 right-0 w-32 h-32 ${isDark ? 'bg-indigo-500/15' : 'bg-pink-400/10'} rounded-full blur-2xl animate-pulse`} />
                <div className={`absolute bottom-1/3 left-0 w-24 h-24 ${isDark ? 'bg-purple-500/15' : 'bg-rose-400/10'} rounded-full blur-xl animate-pulse delay-1000`} />
            </div>

            <motion.ul
                className="relative flex-grow overflow-y-auto scrollbar-hide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {conversations.length > 0 ? (
                    conversations.map((convo, index) => (
                        <motion.li
                            key={convo._id}
                            onClick={() => onSelectConversation(convo)}
                            className={`relative flex items-center p-5 sm:p-6 cursor-pointer transition-all duration-300 border-b ${
                              isDark ? 'border-white/10' : 'border-pink-200/30'
                            } ${
                              selectedConversationId === convo.otherParticipant._id
                                ? `${isDark ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-gray-100 shadow-lg shadow-indigo-500/20' : 'bg-gradient-to-r from-pink-500/20 to-rose-500/10 text-gray-600 shadow-lg shadow-pink-500/20'} backdrop-blur-md`
                                : `${isDark ? 'hover:bg-white/10' : 'hover:bg-white/80'} shadow-none hover:backdrop-blur-md`
                            } ${isDark ? 'hover:shadow-indigo-500/20' : 'hover:shadow-pink-500/20'} hover:shadow-lg group`}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                                duration: 0.5, 
                                ease: 'easeOut',
                                delay: index * 0.1
                            }}
                            whileHover={{ 
                                scale: 1.02,
                                x: 5,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ 
                                scale: 0.98,
                                transition: { duration: 0.1 }
                            }}
                        >
                            {/* Selection Indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                selectedConversationId === convo.otherParticipant._id
                                    ? `${isDark ? 'bg-gradient-to-b from-indigo-400 to-purple-400' : 'bg-gradient-to-b from-pink-500 to-rose-500'} opacity-100`
                                    : 'opacity-0'
                                } transition-all duration-300 rounded-r-lg`}
                            />

                            {/* Avatar with enhanced styling */}
                            <div className="relative mr-4">
                                <div className="avatar online">
                                    <div className={`w-14 h-14 rounded-full ring-2 ring-offset-2 shadow-lg ${
                                      selectedConversationId === convo.otherParticipant._id
                                        ? `${isDark ? 'ring-indigo-400/70 ring-offset-gray-900 shadow-indigo-500/30' : 'ring-pink-500/70 ring-offset-white shadow-pink-500/30'}`
                                        : `${isDark ? 'ring-indigo-400/30 ring-offset-gray-900 group-hover:ring-indigo-400/60 group-hover:shadow-indigo-500/20' : 'ring-pink-400/30 ring-offset-white group-hover:ring-pink-500/60 group-hover:shadow-pink-500/20'}`
                                    } transition-all duration-300 group-hover:scale-105`}>
                                        <img 
                                            src={convo.otherParticipant.image} 
                                            alt={convo.otherParticipant.name} 
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                </div>
                                
                                {/* Online Status with Pulse Animation */}
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isDark ? 'bg-green-400' : 'bg-green-500'} rounded-full ring-2 ${isDark ? 'ring-gray-900' : 'ring-white'} transition-all duration-300`}>
                                    <div className={`absolute inset-0 ${isDark ? 'bg-green-400' : 'bg-green-500'} rounded-full animate-ping opacity-75`}></div>
                                </div>
                                
                                {/* Hover Glow Effect */}
                                <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 ${isDark ? 'bg-gradient-to-br from-indigo-400/20 to-purple-400/20' : 'bg-gradient-to-br from-pink-400/20 to-rose-400/20'} blur-lg transition-all duration-300`} />
                            </div>

                            {/* Content with enhanced typography */}
                            <div className="w-full overflow-hidden">
                                <div className="flex justify-between items-center mb-2">
                                    <motion.p 
                                        className={`font-bold text-lg ${
                                            selectedConversationId === convo.otherParticipant._id
                                                ? `${isDark ? 'text-gray-100' : 'text-gray-600'}`
                                                : `${isDark ? 'text-gray-200 group-hover:text-indigo-400' : 'text-gray-700 group-hover:text-pink-500'}`
                                        } transition-colors duration-300`}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {convo.otherParticipant.name}
                                    </motion.p>
                                    <p className={`text-xs font-medium ${
                                        selectedConversationId === convo.otherParticipant._id
                                            ? `${isDark ? 'text-gray-300' : 'text-gray-500'}`
                                            : `${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`
                                    } transition-colors duration-300`}>
                                        {formatDistanceToNow(convo.updatedAt)}
                                    </p>
                                </div>
                                <p className={`text-sm truncate ${
                                    selectedConversationId === convo.otherParticipant._id
                                        ? `${isDark ? 'text-gray-300' : 'text-gray-600'}`
                                        : `${isDark ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`
                                } transition-colors duration-300 leading-relaxed`}>
                                    {convo.lastMessage}
                                </p>
                            </div>

                            {/* Unread Message Indicator */}
                            {Math.random() > 0.7 && ( // Random for demo - replace with actual unread logic
                                <div className={`absolute top-4 right-4 w-3 h-3 ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} rounded-full animate-pulse`}>
                                    <div className={`absolute inset-0 ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} rounded-full animate-ping opacity-75`}></div>
                                </div>
                            )}
                        </motion.li>
                    ))
                ) : (
                    <motion.li
                        className="flex flex-col items-center justify-center p-8 sm:p-12 text-center mt-20"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <motion.div
                            className={`p-6 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md shadow-2xl ${isDark ? 'shadow-indigo-500/10' : 'shadow-pink-500/10'} mb-6`}
                            animate={{ 
                                boxShadow: [
                                    isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.1)' : '0 25px 50px -12px rgba(236, 72, 153, 0.1)',
                                    isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.3)' : '0 25px 50px -12px rgba(236, 72, 153, 0.3)',
                                    isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.1)' : '0 25px 50px -12px rgba(236, 72, 153, 0.1)'
                                ]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <FiMessageSquare className={`text-6xl ${isDark ? 'text-indigo-400/60' : 'text-pink-500/60'}`} />
                        </motion.div>
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            No conversations yet
                        </h3>
                        <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-relaxed max-w-sm`}>
                            You have no messages yet. Start a conversation from a user's profile!
                        </p>
                        
                        {/* Animated dots */}
                        <motion.div 
                            className="flex space-x-2 mt-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className={`w-2 h-2 ${isDark ? 'bg-indigo-400/40' : 'bg-pink-400/40'} rounded-full`}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.li>
                )}
            </motion.ul>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ConversationList;