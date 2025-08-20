import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import { Link, useParams, useNavigate } from 'react-router';
import io from 'socket.io-client';
// Date formatting utility
const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
};
import LoadingSpinner from '../Shared/LoadingSpinner';
import { motion } from 'framer-motion';

// --- Icons ---
import { IoSend, IoArrowBack } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";
import { FiMessageSquare, FiPaperclip, FiVideo, FiPhone, FiMoreVertical } from "react-icons/fi";

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const ChatWindow = () => {
    const { conversationId } = useParams();
    const { user } = useAuth();
    const { data: currentUserProfile } = useUserProfile();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const messagesEndRef = useRef(null);

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

    const { data: conversation, isLoading: isConvoLoading } = useQuery({
        queryKey: ['conversation', conversationId],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/messages/conversations/${conversationId}`);
            return data;
        },
        enabled: !!conversationId,
    });

    useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/messages/${conversationId}`);
            setMessages(data);
            return data;
        },
        enabled: !!conversationId,
    });

    useEffect(() => {
        if (currentUserProfile?._id) {
            socket.emit("addUser", currentUserProfile._id);
        }
        const handleNewMessage = (incomingMessage) => {
            if (String(incomingMessage.conversationId) === String(conversationId)) {
                setMessages((prevMessages) => [...prevMessages, incomingMessage]);
            }
        };
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [conversationId, currentUserProfile]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const otherParticipant = conversation?.participantDetails?.find(p => p._id !== currentUserProfile?._id);

    const handleSendMessage = (e) => {
        e.preventDefault();
        const content = newMessage.trim();
        const isLike = e.nativeEvent?.submitter?.name === 'like_button';
        const messageContent = isLike ? '👍' : content;

        if (!messageContent || !currentUserProfile || !otherParticipant) return;

        socket.emit('sendMessage', {
            senderId: currentUserProfile._id,
            recipientId: otherParticipant._id,
            content: messageContent,
            conversationId: conversationId,
            createdAt: new Date().toISOString()
        });

        setNewMessage('');
    };

    // Fallback for when no conversation is selected
    if (!conversationId) {
        return (
            <div className={`relative overflow-hidden w-full h-full flex flex-col items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-900 to-indigo-950' : 'bg-gradient-to-br from-pink-50 to-rose-50'} text-center p-4 sm:p-6`}>
                {/* Background Gradient Orbs */}
                <div className="absolute inset-0">
                    <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                </div>

                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className={`p-8 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md shadow-2xl ${isDark ? 'shadow-indigo-500/20' : 'shadow-pink-500/20'} mb-8`}
                        animate={{ 
                            boxShadow: [
                                isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.2)' : '0 25px 50px -12px rgba(236, 72, 153, 0.2)',
                                isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.4)' : '0 25px 50px -12px rgba(236, 72, 153, 0.4)',
                                isDark ? '0 25px 50px -12px rgba(99, 102, 241, 0.2)' : '0 25px 50px -12px rgba(236, 72, 153, 0.2)'
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <FiMessageSquare className={`text-8xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                    </motion.div>
                    <h2 className={`text-3xl font-extrabold mb-4 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                        Select a conversation
                    </h2>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Choose a person from the left to start chatting.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (isConvoLoading) return <LoadingSpinner />;
    if (!conversation || !otherParticipant) return (
        <motion.div
            className={`p-6 text-center ${isDark ? 'bg-white/10 text-gray-300' : 'bg-white/80 text-gray-600'} backdrop-blur-md rounded-3xl shadow-2xl ${isDark ? 'shadow-indigo-500/20' : 'shadow-pink-500/20'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                Could not load conversation details.
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Please try refreshing or selecting another conversation.
            </p>
        </motion.div>
    );

    return (
        <div className={`relative overflow-hidden w-full h-full p-0 md:p-8 ${isDark ? 'bg-gradient-to-br from-gray-900 to-indigo-950' : 'bg-gradient-to-br from-pink-50 to-rose-50'} flex items-center justify-center`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <motion.div
                className={`relative w-full max-w-4xl mx-auto h-full md:h-[calc(100vh-100px)] md:max-h-[800px] ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-pink-200/50'} backdrop-blur-md md:rounded-3xl shadow-2xl ${isDark ? 'shadow-indigo-500/20' : 'shadow-pink-500/20'} flex flex-col overflow-hidden transition-all duration-300`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                {/* --- Enhanced Chat Header --- */}
                <motion.header 
                    className={`flex items-center justify-between flex-shrink-0 px-4 sm:px-6 py-4 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-lg border-b shadow-sm z-10`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className='flex items-center gap-4'>
                        <motion.button
                            onClick={() => navigate('/messages')}
                            className={`btn btn-ghost btn-circle lg:hidden ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoArrowBack className="text-xl" />
                        </motion.button>
                        <Link to={`/profiles/${otherParticipant._id}`} className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="avatar online">
                                    <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 shadow-lg ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900 group-hover:ring-indigo-300/80' : 'ring-pink-400/50 ring-offset-white group-hover:ring-pink-500/80'} transition-all duration-300`}>
                                        <img src={otherParticipant.image} alt={otherParticipant.name} className="object-cover" />
                                    </div>
                                </div>
                                {/* Pulse Animation for Online Status */}
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isDark ? 'bg-green-400' : 'bg-green-500'} rounded-full animate-pulse`}>
                                    <div className={`absolute inset-0 ${isDark ? 'bg-green-400' : 'bg-green-500'} rounded-full animate-ping opacity-75`}></div>
                                </div>
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${isDark ? 'text-gray-100 group-hover:text-indigo-400' : 'text-gray-600 group-hover:text-pink-500'} transition-colors duration-300`}>
                                    {otherParticipant.name}
                                </p>
                                <p className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-500'}`}>
                                    Active now
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <motion.button 
                            className={`btn btn-ghost btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20 hover:text-indigo-400' : 'text-gray-600 hover:bg-white/90 hover:text-pink-500'} transition-all duration-300`} 
                            whileHover={{ scale: 1.1, rotate: 15 }} 
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiPhone className="text-xl" />
                        </motion.button>
                        <motion.button 
                            className={`btn btn-ghost btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20 hover:text-indigo-400' : 'text-gray-600 hover:bg-white/90 hover:text-pink-500'} transition-all duration-300`} 
                            whileHover={{ scale: 1.1, rotate: -15 }} 
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiVideo className="text-xl" />
                        </motion.button>
                        <motion.button 
                            className={`btn btn-ghost btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20 hover:text-indigo-400' : 'text-gray-600 hover:bg-white/90 hover:text-pink-500'} transition-all duration-300`} 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiMoreVertical className="text-xl" />
                        </motion.button>
                    </div>
                </motion.header>

                {/* --- Enhanced Messages Area --- */}
                <main className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 ${isDark ? 'bg-gradient-to-b from-gray-800/30 to-gray-900/30' : 'bg-gradient-to-b from-white/30 to-gray-50/30'} backdrop-blur-sm scrollbar-hide`}>
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === currentUserProfile?._id;
                        const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;

                        return (
                            <motion.div
                                key={msg._id || msg.createdAt}
                                className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    duration: 0.4, 
                                    ease: 'easeOut',
                                    delay: index * 0.05
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="chat-image avatar">
                                    {showAvatar ? (
                                        <motion.div 
                                            className={`w-10 h-10 rounded-full ring-2 ring-offset-2 shadow-md ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img src={isSender ? currentUserProfile.image : otherParticipant.image} alt="avatar" className="object-cover rounded-full" />
                                        </motion.div>
                                    ) : (<div className="w-10 h-10"></div>)}
                                </div>
                                <motion.div 
                                    className={`chat-bubble flex items-center text-base break-words max-w-md md:max-w-lg shadow-lg ${msg.content === '👍' ? 'bg-transparent text-5xl p-2 shadow-none' : (isSender ? `${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-indigo-500/30' : 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-pink-500/30'} text-white rounded-2xl backdrop-blur-md` : `${isDark ? 'bg-white/10 text-gray-300 border-white/20 shadow-white/10' : 'bg-white/90 text-gray-600 border-pink-200/50 shadow-pink-200/20'} rounded-2xl border backdrop-blur-md`)}`}
                                    whileHover={{ 
                                        scale: msg.content === '👍' ? 1.2 : 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {msg.content}
                                </motion.div>
                                <div className="chat-footer">
                                    <time className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} opacity-70`}>
                                        {formatTime(msg.createdAt)}
                                    </time>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </main>

                {/* --- Enhanced Message Input Form --- */}
                <motion.footer 
    className={`flex items-center gap-4 p-4 sm:p-6 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-lg border-t-2 shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
>
    <motion.button
        type="button"
        className={`btn btn-ghost btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20 hover:text-indigo-400' : 'text-gray-600 hover:bg-white/90 hover:text-pink-500'} transition-all duration-300`}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
    >
        <FiPaperclip className="text-xl" />
    </motion.button>
    <form 
      onSubmit={handleSendMessage} 
      className='w-full flex items-center gap-4'
    >
        <motion.input
            type="text"
            placeholder="Type a message..."
            className={`input w-full ${isDark ? 'bg-white/10 text-gray-300 border-white/20 placeholder-gray-400' : 'bg-white/90 text-gray-600 border-pink-200/50 placeholder-gray-500'} backdrop-blur-md rounded-xl px-6 py-4 text-base shadow-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500 focus:shadow-indigo-500/30' : 'focus:ring-pink-500 focus:shadow-pink-500/30'} transition-all duration-300`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        />
        {newMessage ? (
            <motion.button
                type="submit"
                className={`btn btn-circle border-none text-white ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/40' : 'bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/40'} shadow-xl transition-all duration-300`}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
                <IoSend className="text-xl" />
            </motion.button>
        ) : (
            <motion.button
                type="submit"
                name="like_button"
                className={`btn btn-ghost btn-circle text-2xl ${isDark ? 'text-indigo-400 hover:bg-white/20 hover:text-indigo-300' : 'text-pink-500 hover:bg-white/90 hover:text-pink-600'} transition-all duration-300`}
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaRegThumbsUp />
            </motion.button>
        )}
    </form>
</motion.footer>

            </motion.div>

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

export default ChatWindow;