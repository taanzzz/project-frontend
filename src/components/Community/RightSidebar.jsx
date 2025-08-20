// 📁 File: src/components/Community/RightSidebar.jsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBalanceScale, FaHandsHelping, FaLightbulb, FaTimesCircle, FaUsers, FaTimes } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

const RightSidebar = ({ isDark, onClose }) => {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: suggestions = [], isLoading } = useQuery({
        queryKey: ['follow-suggestions'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/users/suggestions');
            return data;
        },
        enabled: !!currentUser,
    });

    const mutation = useMutation({
        mutationFn: (userIdToFollow) => axiosSecure.patch(`/api/users/${userIdToFollow}/follow`),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['follow-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['user-profile', currentUser?.email] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to update follow status.")
    });

    const handleFollowClick = (userIdToFollow) => {
        if (!currentUser) return toast.error("Please log in to follow users.");
        mutation.mutate(userIdToFollow);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.aside 
            className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-xl border rounded-3xl z-100 shadow-2xl p-6 space-y-8 fixed top-24 max-h-[calc(100vh-7rem)] overflow-y-auto w-72`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Mobile Close Button */}
            {onClose && (
                <motion.button
                    onClick={onClose}
                    className={`absolute top-4 right-4 btn btn-circle btn-sm border-none ${isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-pink-100/80 text-gray-600 hover:bg-pink-200/80'} lg:hidden`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaTimes />
                </motion.button>
            )}
           
            {/* Who to Follow Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <h3 className={`font-bold text-xl mb-6 flex items-center gap-3 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                    <FaUsers className={isDark ? 'text-indigo-400' : 'text-pink-500'} /> Who to Follow
                </h3>
                
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {suggestions.length > 0 ? (
                            suggestions
                                .filter(user => user.email !== currentUser?.email)
                                .slice(0, 5)
                                .map(user => (
                                    <motion.div 
                                        key={user._id} 
                                        variants={itemVariants} 
                                        className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/60 hover:bg-white/80'} backdrop-blur-sm transition-all duration-300`}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <Link to={`/profiles/${user._id}`} className="flex items-center gap-3 group">
                                            <div className="avatar">
                                                <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'} group-hover:ring-4 transition-all duration-300`}>
                                                    <img src={user.image} alt={user.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className={`font-semibold ${isDark ? 'text-gray-100 group-hover:text-indigo-400' : 'text-gray-600 group-hover:text-pink-600'} transition-colors duration-300`}>
                                                    {user.name}
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    @{user.name.toLowerCase().replace(/\s+/g, '')}
                                                </p>
                                            </div>
                                        </Link>
                                        <motion.button
                                            onClick={() => handleFollowClick(user._id)}
                                            className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-full transition-all duration-300 shadow-lg`}
                                            disabled={mutation.isLoading && mutation.variables === user._id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {mutation.isLoading && mutation.variables === user._id ? 
                                                <span className="loading loading-spinner loading-xs"></span> : 
                                                'Follow'
                                            }
                                        </motion.button>
                                    </motion.div>
                                ))
                        ) : (
                            <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No new suggestions.
                            </p>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Divider */}
            <div className={`divider ${isDark ? 'divider-neutral' : 'divider-primary'} my-6`}></div>

            {/* Community Guidelines Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
                <h3 className={`font-bold text-xl mb-6 flex items-center gap-3 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                    <FiInfo className={isDark ? 'text-indigo-400' : 'text-pink-500'} /> Community Guidelines
                </h3>
                <motion.ul 
                    className="space-y-4 text-sm"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.li 
                        variants={itemVariants}
                        className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-sm`}
                    >
                        <FaHandsHelping className={`${isDark ? 'text-indigo-400' : 'text-pink-500'} text-lg mt-0.5 flex-shrink-0`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            <b className='font-semibold'>Be Respectful:</b> Engage in constructive criticism, not personal attacks.
                        </span>
                    </motion.li>
                    
                    <motion.li 
                        variants={itemVariants}
                        className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-sm`}
                    >
                        <FaLightbulb className={`${isDark ? 'text-purple-400' : 'text-rose-500'} text-lg mt-0.5 flex-shrink-0`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            <b className='font-semibold'>Share Knowledge:</b> Post content that is educational and insightful.
                        </span>
                    </motion.li>
                    
                    <motion.li 
                        variants={itemVariants}
                        className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-sm`}
                    >
                        <FaBalanceScale className={`${isDark ? 'text-violet-400' : 'text-orange-500'} text-lg mt-0.5 flex-shrink-0`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            <b className='font-semibold'>Intellectual Honesty:</b> Cite sources and do not spread misinformation.
                        </span>
                    </motion.li>
                    
                    <motion.li 
                        variants={itemVariants}
                        className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/60'} backdrop-blur-sm`}
                    >
                        <FaTimesCircle className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            <b className='font-semibold'>No Spam or Hate Speech:</b> Hateful and logicless content will not be tolerated.
                        </span>
                    </motion.li>
                </motion.ul>
            </motion.div>
        </motion.aside>
    );
};

export default RightSidebar;