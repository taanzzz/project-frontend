// 📁 File: src/pages/PublicProfile.jsx

import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router'; // Correct import for modern react-router
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import PostCard from '../components/Community/PostCard';
import useAuth from '../hooks/useAuth';

// --- Icons ---
import { FaPaperPlane } from "react-icons/fa";
import { FiUsers, FiUserPlus, FiMessageSquare } from "react-icons/fi";

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const PublicProfile = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['public-profile', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/users/profile-details/${id}`);
            return data;
        },
        enabled: !!id,
    });
    
    useEffect(() => {
        socket.on('update_reaction', ({ postId, reactions, totalReactions, whoReacted }) => {
            queryClient.setQueryData(['public-profile', id], (oldData) => {
                if (!oldData) return;
                const updatedPosts = oldData.posts.map(post => 
                    post._id === postId 
                        ? { ...post, reactions, totalReactions, whoReacted } 
                        : post
                );
                return { ...oldData, posts: updatedPosts };
            });
        });
        return () => {
            socket.off('update_reaction');
        };
    }, [id, queryClient]);

    if (isLoading) return <LoadingSpinner />;
    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-error">Profile Not Found</h2>
                <p className="text-base-content/70 mt-2">The user profile you are looking for does not exist.</p>
                <Link to="/community" className="btn btn-primary mt-6">Back to Community</Link>
            </div>
        );
    }

    const { user, posts, followingDetails } = data;
    const isOwnProfile = currentUser?.email === user?.email;

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4">
                
                {/* --- Profile Header --- */}
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content p-8 md:p-12 rounded-2xl shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
                    <div className="absolute -bottom-12 -right-8 w-48 h-48 bg-white/10 rounded-full"></div>
                    
                    <div className="avatar online mx-auto z-10 relative">
                        <div className="w-36 h-36 rounded-full ring-4 ring-offset-4 ring-white/50 ring-offset-primary/80">
                            <img src={user.image} alt={user.name} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold mt-5 z-10 relative">{user.name}</h1>
                    <p className="text-base-content/70  z-10 relative">{user.email}</p>
                    
                    <div className="divider divider-horizontal before:bg-white/20 after:bg-white/20 my-6"></div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-4 z-10 relative">
                        <div className="text-center">
                            <p className="text-3xl font-bold">{user.followers?.length || 0}</p>
                            <p className="opacity-80">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{user.following?.length || 0}</p>
                            <p className="opacity-80">Following</p>
                        </div>
                         <div className="text-center">
                            <p className="text-3xl font-bold">{posts?.length || 0}</p>
                            <p className="opacity-80">Posts</p>
                        </div>
                    </div>

                    {!isOwnProfile && (
                        <div className="mt-8 z-10 relative">
                            <Link 
                                to="/messages" 
                                state={{ recipient: user }} 
                                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
                            >
                                <FaPaperPlane className="mr-2" /> Send Message
                            </Link>
                        </div>
                    )}
                </div>

                {/* --- "Following" Section --- */}
                <div className="mt-10 bg-base-100 p-6 md:p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FiUsers /> Following ({followingDetails.length})</h2>
                    {followingDetails.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {followingDetails.map(followedUser => (
                                <Link to={`/profiles/${followedUser._id}`} key={followedUser._id} className="text-center group flex flex-col items-center">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 ring-2 ring-offset-2 ring-transparent group-hover:ring-secondary ring-offset-base-100">
                                            <img src={followedUser.image} alt={followedUser.name} />
                                        </div>
                                    </div>
                                    <p className="mt-3 font-semibold transition-colors duration-300 group-hover:text-primary">{followedUser.name}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FiUserPlus className="mx-auto text-5xl text-base-content/30" />
                            <p className="text-base-content/60 mt-4">Not following anyone yet.</p>
                        </div>
                    )}
                </div>

                {/* --- User's Posts --- */}
                <div className="mt-10">
                    <h2 className="text-3xl font-bold mb-6 text-base-content flex items-center gap-3"><FiMessageSquare /> Posts by {user.name}</h2>
                    <div className="space-y-8">
                        {posts.length > 0 ? (
                            posts.map(post => <PostCard key={post._id} post={post} />)
                        ) : (
                            <div className="bg-base-100 p-12 rounded-2xl shadow-xl text-center">
                                <h3 className="text-xl font-semibold">No Posts Yet</h3>
                                <p className="text-base-content/60 mt-2">When {user.name} shares a post, it will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;