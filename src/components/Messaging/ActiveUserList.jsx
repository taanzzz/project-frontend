// 📁 File: src/components/Messaging/ActiveUserList.jsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Add useQueryClient
import { useNavigate } from 'react-router';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';

const ActiveUserList = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // Add queryClient

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
            // Invalidate messages query for the new conversationId
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate(`/messages/${conversationId}`);
        },
    });

    const handleUserClick = (recipientId) => {
        mutation.mutate(recipientId);
    };

    if (isLoading) return <div className="px-4 h-24"><span className="loading loading-dots loading-sm"></span></div>;

    return (
        <div className="flex-shrink-0 px-4 pt-4 pb-2 border-b border-base-300">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                {users.map(user => (
                    <div onClick={() => handleUserClick(user._id)} key={user._id} className="flex flex-col items-center space-y-1 flex-shrink-0 group cursor-pointer">
                        <div className="avatar">
                            <div className="w-14 rounded-full ring ring-offset-base-100 ring-offset-2 group-hover:ring-primary transition-all">
                                <img src={user.image} alt={user.name} />
                            </div>
                        </div>
                        <p className="text-xs w-16 text-center truncate">{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActiveUserList;