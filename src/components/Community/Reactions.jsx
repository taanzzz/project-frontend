import React, { useState, useEffect } from 'react';
import axiosSecure from '../../api/Axios';
import { FaThumbsUp, FaHeart, FaSadCry, FaGrinStars, FaHandHoldingHeart } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Reaction types with enhanced styling properties
const reactionTypes = [
    { type: 'like',    icon: FaThumbsUp,         color: 'text-blue-500',    bg: 'bg-blue-500/20' },
    { type: 'love',    icon: FaHeart,            color: 'text-red-500',     bg: 'bg-red-500/20' },
    { type: 'care',    icon: FaHandHoldingHeart, color: 'text-yellow-400',  bg: 'bg-yellow-400/20' },
    { type: 'wow',     icon: FaGrinStars,        color: 'text-pink-500',    bg: 'bg-pink-500/20' },
    { type: 'sad',     icon: FaSadCry,           color: 'text-gray-500',    bg: 'bg-gray-500/20' },
];

const Reactions = ({ post }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
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

    const currentUserReaction = post.whoReacted?.find(r => r.userEmail === user?.email);

    const handleReactClick = async (reactionType) => {
        if (!user) {
            return toast.error("You must be logged in to react.");
        }
        
        try {
            const typeToSend = reactionType === 'sad' ? 'dislike' : reactionType;
            await axiosSecure.patch(`/api/posts/${post._id}/react`, { reactionType: typeToSend });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        } catch (error) {
            console.error("Failed to react:", error);
            toast.error(error.response?.data?.message || "Failed to submit reaction.");
        }
    };
    
    return (
        <div className="flex items-center gap-2 w-full justify-start px-4 sm:px-6">
            {reactionTypes.map(({ type, icon: Icon, color, bg }) => {
                const isActive = currentUserReaction?.reactionType === type || (type === 'sad' && currentUserReaction?.reactionType === 'dislike');
                const count = post.reactions[type === 'sad' ? 'dislike' : type] || 0;

                return (
                    <motion.button
                        key={type}
                        onClick={() => handleReactClick(type)}
                        className={`flex items-center gap-1.5 p-2 rounded-full transition-all duration-300 ${isActive ? `${bg} ${isDark ? 'border-white/20' : 'border-pink-200/50'}` : `${isDark ? 'bg-white/10' : 'bg-white/80'} hover:${isDark ? 'bg-white/20' : 'bg-white/90'} backdrop-blur-md border`} shadow-sm hover:shadow-md ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'}`}
                        aria-label={`React with ${type}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon className={`text-xl transition-transform duration-300 ${isActive ? color : isDark ? 'text-gray-300' : 'text-gray-600'} group-hover:scale-125`} />
                        <span className={`text-sm font-semibold transition-opacity duration-300 ${isActive ? color : isDark ? 'text-gray-400' : 'text-gray-500'} ${count > 0 ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            {count}
                        </span>
                    </motion.button>
                )
            })}
        </div>
    );
};

export default Reactions;