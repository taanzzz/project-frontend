// 📁 File: src/components/Messaging/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import useUserProfile from '../../hooks/useUserProfile';
import { Link, useParams, useNavigate } from 'react-router';
import io from 'socket.io-client';
import { format } from 'date-fns';
import LoadingSpinner from '../Shared/LoadingSpinner';

// --- Icons ---
import { IoSend, IoArrowBack } from "react-icons/io5";
import { FaRegThumbsUp } from "react-icons/fa";
import { FiMessageSquare, FiPaperclip, FiVideo, FiPhone, FiMoreVertical } from "react-icons/fi";

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const ChatWindow = () => {
    // --- All hooks and logic remain 100% unchanged ---
    const { conversationId } = useParams();
    const { user } = useAuth();
    const { data: currentUserProfile } = useUserProfile();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

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
        if(currentUserProfile?._id) {
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
    
    // --- Main Component Render ---
    
    // Fallback for when no conversation is selected
    if (!conversationId) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-base-200 text-center p-4">
                <FiMessageSquare className="text-8xl text-base-content/20 mb-4" />
                <h2 className="text-2xl font-bold text-base-content/70">Select a conversation</h2>
                <p className="text-base-content/50">Choose a person from the left to start chatting.</p>
            </div>
        );
    }
    
    if (isConvoLoading) return <LoadingSpinner />;
    if (!conversation || !otherParticipant) return <div className="p-4 text-center">Could not load conversation details.</div>;

    return (
        // ✅ Outer container with gradient background and padding for the "windowed" effect on PC
        <div className="w-full h-full p-0 md:p-8 bg-gradient-to-br from-base-200 via-base-300 to-base-200 flex items-center justify-center">
            
            {/* ✅ The main chat window with max-width and height constraints */}
            <div className="w-full max-w-4xl mx-auto h-full md:h-[calc(100vh-100px)] md:max-h-[800px] bg-base-100 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-base-300/50">
                
                {/* --- Enhanced Chat Header --- */}
                <header className="flex items-center justify-between flex-shrink-0 px-4 py-3 bg-base-100 border-b border-base-300/60 shadow-md z-10">
                    <div className='flex items-center gap-3'>
                        <button onClick={() => navigate('/messages')} className="btn btn-ghost btn-circle lg:hidden">
                            <IoArrowBack className="text-xl" />
                        </button>
                        <Link to={`/profiles/${otherParticipant._id}`} className="flex items-center gap-3">
                            <div className="avatar online">
                                <div className="w-12 h-12 rounded-full">
                                    <img src={otherParticipant.image} alt={otherParticipant.name} />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-lg">{otherParticipant.name}</p>
                                <p className="text-xs text-success font-semibold">Active now</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-ghost btn-circle"><FiPhone className="text-xl text-base-content/70"/></button>
                        <button className="btn btn-ghost btn-circle"><FiVideo className="text-xl text-base-content/70"/></button>
                        <button className="btn btn-ghost btn-circle"><FiMoreVertical className="text-xl text-base-content/70"/></button>
                    </div>
                </header>
                
                {/* --- Enhanced Messages Area --- */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 bg-base-200">
                    {messages.map((msg, index) => {
                        const isSender = msg.senderId === currentUserProfile?._id;
                        const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                        
                        return (
                            <div key={msg._id || msg.createdAt} className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
                                <div className="chat-image avatar">
                                    {showAvatar ? (
                                        <div className="w-10 h-10 rounded-full">
                                            <img src={isSender ? currentUserProfile.image : otherParticipant.image} alt="avatar"/>
                                        </div>
                                    ) : ( <div className="w-10 h-10"></div> )}
                                </div>
                                <div className={`chat-bubble flex items-center text-base break-words max-w-md md:max-w-lg shadow-lg ${msg.content === '👍' ? 'bg-transparent text-5xl p-0 shadow-none' : (isSender ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-bl-2xl' : 'bg-base-100 text-base-content rounded-br-2xl')}`}>
                                    {msg.content}
                                </div>
                                <div className="chat-footer">
                                    <time className="text-xs opacity-60">{format(new Date(msg.createdAt), 'p')}</time>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </main>

                {/* --- Enhanced Message Input Form --- */}
                <footer className="flex items-center gap-3 p-4 bg-base-100 border-t-2 border-base-300/20">
                    <button type="button" className="btn btn-ghost btn-circle"><FiPaperclip className="text-2xl text-base-content/60" /></button>
                    <form onSubmit={handleSendMessage} className='w-full flex items-center gap-3'>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="input input-bordered w-full rounded-full bg-base-200 focus:ring-2 focus:ring-primary transition-all text-base py-5" 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                        />
                        {newMessage ? (
                            <button type="submit" name="send_button" className="btn btn-circle bg-gradient-to-br from-primary to-secondary text-white border-none transform transition-transform hover:scale-110">
                                <IoSend className="text-xl" />
                            </button>
                        ) : (
                            <button type="submit" name="like_button" className="btn btn-ghost btn-circle">
                                <FaRegThumbsUp className="text-primary text-3xl transition-transform hover:scale-110" />
                            </button>
                        )}
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default ChatWindow;