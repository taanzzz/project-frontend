import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import axiosSecure from '../../api/Axios';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const ActiveUserList = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
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
            queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate(`/messages/${conversationId}`);
        },
    });

    const handleUserClick = (recipientId) => {
        mutation.mutate(recipientId);
    };

    if (isLoading) {
        return (
            <div className={`px-6 h-24 flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`w-6 h-6 border-2 border-transparent ${isDark ? 'border-t-indigo-400 border-r-purple-400' : 'border-t-pink-400 border-r-rose-400'} rounded-full`}
                />
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-gray-900/95 to-indigo-950/95' : 'bg-gradient-to-r from-pink-50/95 to-rose-50/95'} backdrop-blur-md`}>
            {/* Background Gradient Orb */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/2 w-32 h-32 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-2xl animate-pulse`} />
            </div>

            <motion.div
                className={`relative flex-shrink-0 px-4 sm:px-6 pt-4 pb-2 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'} backdrop-blur-md transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                    {users.map((user, index) => (
                        <motion.div
                            onClick={() => handleUserClick(user._id)}
                            key={user._id}
                            className="flex flex-col items-center space-y-2 flex-shrink-0 group cursor-pointer"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: 'easeOut', 
                                delay: 0.1 * index 
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.3, ease: 'easeOut' }
                            }}
                            whileTap={{ 
                                scale: 0.95,
                                transition: { duration: 0.2, ease: 'easeOut' }
                            }}
                        >
                            <div className="relative">
                                <div className="avatar">
                                    <div className={`w-14 h-14 rounded-full ring-2 ring-offset-2 shadow-lg ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900 group-hover:ring-indigo-300/80 group-hover:shadow-indigo-500/30' : 'ring-pink-400/50 ring-offset-white group-hover:ring-pink-500/80 group-hover:shadow-pink-500/30'} transition-all duration-300`}>
                                        <img src={user.image} alt={user.name} className="object-cover rounded-full" />
                                    </div>
                                </div>
                                
                                {/* Hover Glow Effect */}
                                <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 ${isDark ? 'bg-gradient-to-br from-indigo-400/20 to-purple-400/20' : 'bg-gradient-to-br from-pink-400/20 to-rose-400/20'} blur-xl transition-all duration-300`} />
                            </div>
                            
                            <p className={`text-sm font-semibold w-16 text-center truncate ${isDark ? 'text-gray-300 group-hover:text-indigo-400' : 'text-gray-600 group-hover:text-pink-500'} transition-colors duration-300`}>
                                {user.name}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Scroll Indicator */}
                {users.length > 0 && (
                    <motion.div 
                        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 0.6, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className={`w-2 h-8 ${isDark ? 'bg-gradient-to-b from-indigo-400/30 to-purple-400/30' : 'bg-gradient-to-b from-pink-400/30 to-rose-400/30'} rounded-full`} />
                    </motion.div>
                )}
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

export default ActiveUserList;