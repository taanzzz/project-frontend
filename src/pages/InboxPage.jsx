// 📁 File: src/pages/InboxPage.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router'; // useParams যোগ করা হয়েছে
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { formatDistanceToNow } from 'date-fns'; // formatDistanceToNowStrict এর পরিবর্তে
import { FaSearch, FaPlus } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';
import { FiMessageSquare } from "react-icons/fi";

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

// --- সাব-কম্পোনেন্ট: ActiveUserList (উন্নত) ---
const ActiveUserList = () => {
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

    if (isLoading) return <div className="px-4 h-28 flex items-center"><span className="loading loading-dots loading-md"></span></div>;

    return (
        <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-base-300/60">
            <h2 className="text-sm font-semibold text-base-content/70 mb-3 px-1">START A CONVERSATION</h2>
            <div className="flex items-center space-x-2 overflow-x-auto pb-3">
                {users.map(user => (
                    <div onClick={() => handleUserClick(user._id)} key={user._id} className="flex flex-col items-center justify-center space-y-2 p-2 w-20 flex-shrink-0 group cursor-pointer hover:bg-base-200/50 rounded-xl transition-colors duration-300">
                        <div className="avatar">
                            <div className="w-16 h-16 rounded-full ring-2 ring-offset-2 ring-offset-base-100 ring-secondary/30 group-hover:ring-secondary transition-all duration-300">
                                <img src={user.image} alt={user.name} />
                            </div>
                        </div>
                        <p className="text-xs w-full text-center truncate font-medium text-base-content/80">{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- সাব-কম্পোনেন্ট: ConversationList (উন্নত) ---
const ConversationList = () => {
    const { conversationId: selectedConversationId } = useParams(); // URL থেকে সিলেক্টেড আইডি নেওয়া হচ্ছে
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

    if (isLoading) return <div className="flex-grow flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <ul className="flex-grow overflow-y-auto pr-1">
            {conversations.length > 0 ? conversations.map(convo => (
                <li key={convo._id}>
                    <Link 
                        to={`/messages/${convo._id}`} 
                        className={`flex items-center p-3 m-2 rounded-xl cursor-pointer transition-all duration-300 border-l-4 ${
                            selectedConversationId === convo._id 
                            ? 'bg-primary/10 border-primary' 
                            : 'border-transparent hover:bg-base-200/50'
                        }`}
                    >
                        <div className="avatar mr-4 online">
                            <div className="w-14 h-14 rounded-full">
                                <img src={convo.otherParticipant.image} alt={convo.otherParticipant.name} />
                            </div>
                        </div>
                        <div className="w-full overflow-hidden">
                            <div className="flex justify-between items-center">
                                <p className={`font-bold text-lg ${selectedConversationId === convo._id ? 'text-primary' : 'text-base-content'}`}>{convo.otherParticipant.name}</p>
                                <p className="text-xs text-base-content/50">{formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}</p>
                            </div>
                            <p className="text-sm text-base-content/60 truncate">{convo.lastMessage}</p>
                        </div>
                    </Link>
                </li>
            )) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-base-content/60 p-4">
                    <FiMessageSquare className="text-6xl opacity-50 mb-4" />
                    <h3 className="font-semibold text-lg">No Conversations Yet</h3>
                    <p className="max-w-xs mx-auto">Start a new conversation by selecting a user from the list above.</p>
                </div>
            )}
        </ul>
    );
};

// --- মূল পেইজ: InboxPage (উন্নত) ---
const InboxPage = () => {
    return (
        <div className="h-full flex flex-col bg-base-100 relative">
            <div className="flex-shrink-0 p-4 flex justify-between items-center border-b border-base-300/60">
                <h1 className="text-3xl font-extrabold tracking-tight">Messages</h1>
                <button className="btn btn-ghost btn-circle">
                    <FaSearch className="text-xl text-base-content/70" />
                </button>
            </div>
            
            <ActiveUserList />

            <div className="px-4 mt-4 mb-2">
                 <h2 className="text-sm font-semibold text-base-content/70 px-1">RECENT CHATS</h2>
            </div>
            <ConversationList />
            
            <div className="tooltip tooltip-left" data-tip="New Message">
                <button className="btn btn-circle border-none text-white bg-gradient-to-br from-primary to-secondary absolute bottom-6 right-6 shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                    <FaPlus className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default InboxPage;