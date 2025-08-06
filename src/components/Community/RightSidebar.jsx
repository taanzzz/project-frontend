// 📁 File: src/components/Community/RightSidebar.jsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaBalanceScale, FaHandsHelping, FaLightbulb, FaTimesCircle, FaUsers } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";

const RightSidebar = () => {
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
        <aside className="bg-base-100/50 backdrop-blur-xl border border-base-300/20 p-4 rounded-2xl shadow-xl space-y-6 fixed top-24 max-h-[calc(100vh-7rem)] overflow-y-auto w-72">
            
            {/* --- Who to Follow Section --- */}
            <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <FaUsers /> Who to Follow
                </h3>
                {isLoading ? <LoadingSpinner /> : (
                    <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {suggestions.length > 0 ? (
                            suggestions
                                .filter(user => user.email !== currentUser?.email)
                                .slice(0, 5) // Show top 5 suggestions
                                .map(user => (
                                    <motion.div key={user._id} variants={itemVariants} className="flex items-center justify-between">
                                        <Link to={`/profiles/${user._id}`} className="flex items-center gap-3 group">
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-full group-hover:ring-2 ring-secondary ring-offset-base-100 ring-offset-2 transition-all">
                                                    <img src={user.image} alt={user.name} />
                                                </div>
                                            </div>
                                            <p className="font-semibold group-hover:text-primary transition-colors">{user.name}</p>
                                        </Link>
                                        <button 
                                            onClick={() => handleFollowClick(user._id)}
                                            className="btn btn-sm border-none text-white bg-gradient-to-r from-primary to-secondary rounded-full transform transition-transform hover:scale-105"
                                            disabled={mutation.isLoading && mutation.variables === user._id}
                                        >
                                            {mutation.isLoading && mutation.variables === user._id ? <span className="loading loading-spinner loading-xs"></span> : 'Follow'}
                                        </button>
                                    </motion.div>
                                ))
                        ) : <p className="text-sm text-base-content/70">No new suggestions.</p>}
                    </motion.div>
                )}
            </div>
            
            <div className="divider my-2"></div>
            
            {/* --- Community Guidelines Section --- */}
            <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    <FiInfo /> Community Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-base-content/90">
                    <li className="flex items-start gap-3"><FaHandsHelping className="text-primary text-xl mt-0.5 flex-shrink-0" /> <span><b className='font-semibold'>Be Respectful:</b> Engage in constructive criticism, not personal attacks.</span></li>
                    <li className="flex items-start gap-3"><FaLightbulb className="text-secondary text-xl mt-0.5 flex-shrink-0" /> <span><b className='font-semibold'>Share Knowledge:</b> Post content that is educational and insightful.</span></li>
                    <li className="flex items-start gap-3"><FaBalanceScale className="text-accent text-xl mt-0.5 flex-shrink-0" /> <span><b className='font-semibold'>Intellectual Honesty:</b> Cite sources and do not spread misinformation.</span></li>
                    <li className="flex items-start gap-3"><FaTimesCircle className="text-error text-xl mt-0.5 flex-shrink-0" /> <span><b className='font-semibold'>No Spam or Hate Speech:</b> Hateful and logicless content will not be tolerated.</span></li>
                </ul>
            </div>
        </aside>
    );
};

export default RightSidebar;