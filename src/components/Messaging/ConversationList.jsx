// 📁 File: src/components/Messaging/ConversationList.jsx

import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../Shared/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
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
        const handleNewMessage = () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        };
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [queryClient]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <ul className="flex-grow overflow-y-auto">
            {conversations.length > 0 ? conversations.map(convo => (
                // ✅ Link-এর পরিবর্তে li-তে onClick ব্যবহার করা হয়েছে
                <li key={convo._id} onClick={() => onSelectConversation(convo)}>
                    <div className={`flex items-center p-3 cursor-pointer transition-colors duration-200 border-b border-base-300 ${
                        selectedConversationId === convo.otherParticipant._id ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
                    }`}>
                        <div className="avatar mr-4 online">
                            <div className="w-14 rounded-full">
                                <img src={convo.otherParticipant.image} alt={convo.otherParticipant.name} />
                            </div>
                        </div>
                        <div className="w-full overflow-hidden">
                           <div className="flex justify-between items-center">
                                <p className="font-bold text-lg">{convo.otherParticipant.name}</p>
                                <p className="text-xs opacity-70">
                                    {formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true })}
                                </p>
                            </div>
                            <p className="text-sm opacity-80 truncate">{convo.lastMessage}</p>
                        </div>
                    </div>
                </li>
            )) : (
                <p className="p-4 text-center text-gray-500 mt-10">You have no messages yet. Start a conversation from a user's profile!</p>
            )}
        </ul>
    );
};

export default ConversationList;