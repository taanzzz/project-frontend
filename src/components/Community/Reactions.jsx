// 📁 File: src/components/Community/Reactions.jsx

import React from 'react';
import axiosSecure from '../../api/Axios';
import { FaThumbsUp, FaHeart, FaSadCry, FaGrinStars, FaHandHoldingHeart } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Reaction types with enhanced styling properties
const reactionTypes = [
    { type: 'like',    icon: FaThumbsUp,         color: 'text-blue-500',    bg: 'bg-blue-500/10' },
    { type: 'love',    icon: FaHeart,            color: 'text-red-500',     bg: 'bg-red-500/10' },
    { type: 'care',    icon: FaHandHoldingHeart, color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
    { type: 'wow',     icon: FaGrinStars,        color: 'text-pink-500',    bg: 'bg-pink-500/10' },
    { type: 'sad',     icon: FaSadCry,           color: 'text-gray-500',    bg: 'bg-gray-500/10' },
];

const Reactions = ({ post }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const currentUserReaction = post.whoReacted?.find(r => r.userEmail === user?.email);

    const handleReactClick = async (reactionType) => {
        if (!user) {
            return toast.error("You must be logged in to react.");
        }
        
        // Optimistically update UI
        queryClient.setQueryData(['posts'], (oldData) => {
            // Find the specific post and update its reaction state
            // Note: This is an advanced technique and can be complex.
            // For simplicity, we will stick to invalidation.
            return oldData;
        });

        try {
            // The type for sad reaction is 'dislike' in the backend as per original code
            const typeToSend = reactionType === 'sad' ? 'dislike' : reactionType;
            await axiosSecure.patch(`/api/posts/${post._id}/react`, { reactionType: typeToSend });
            
            // Invalidate queries to refetch data from server
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (error) {
            console.error("Failed to react:", error);
            toast.error(error.response?.data?.message || "Failed to submit reaction.");
            // Revert optimistic update on error if implemented
        }
    };
    
    return (
        <div className="flex items-center gap-1 w-full justify-start">
            {reactionTypes.map(({ type, icon: Icon, color, bg }) => {
                const isActive = currentUserReaction?.reactionType === type || (type === 'sad' && currentUserReaction?.reactionType === 'dislike');
                const count = post.reactions[type === 'sad' ? 'dislike' : type] || 0;

                return (
                    <button 
                        key={type}
                        onClick={() => handleReactClick(type)}
                        // Apply a background color if the reaction is active
                        className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 group ${isActive ? bg : 'bg-transparent hover:bg-base-300/50'}`}
                        aria-label={`React with ${type}`}
                    >
                        <Icon className={`text-xl transition-transform duration-300 group-hover:scale-125 ${
                            isActive ? color : 'text-base-content/50 group-hover:text-base-content'
                        }`} />
                        
                        {/* Show count only if it's greater than 0 */}
                        <span className={`text-sm font-semibold transition-opacity duration-300 ${
                            isActive ? color : 'text-base-content/60'
                        } ${
                            count > 0 ? 'opacity-100' : 'opacity-0 w-0'
                        }`}>
                            {count}
                        </span>
                    </button>
                )
            })}
        </div>
    );
};

export default Reactions;