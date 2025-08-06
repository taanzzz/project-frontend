// 📁 File: src/components/Community/NewsFeed.jsx

import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import axiosSecure from '../../api/Axios';
import PostCard from './PostCard';
import LoadingSpinner from '../Shared/LoadingSpinner';

// ✅ আপনার ব্যাকএন্ড সার্ভারের URL-এর সাথে কানেক্ট করা হচ্ছে
const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

const NewsFeed = () => {
    const queryClient = useQueryClient();

    // React Query ব্যবহার করে সার্ভার থেকে সকল পোস্ট লোড করা হচ্ছে
    const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
        const res = await axiosSecure.get('/api/posts');
        console.log("Raw response from /api/posts:", res.data); // Debug log
        return res.data;
    }
});
    

    // Socket.IO থেকে রিয়েল-টাইম ইভেন্ট শোনার জন্য
    useEffect(() => {
        // নতুন পোস্ট আসলে UI আপডেট করা
        socket.on('new_post', (newPost) => {
            console.log("New post received via socket:", newPost);
            queryClient.setQueryData(['posts'], (oldData = []) => {
                // পোস্টটি আগে থেকেই আছে কিনা তা চেক করা
                if (oldData.find(post => post._id === newPost._id)) {
                    return oldData;
                }
                return [newPost, ...oldData];
            });
        });

        // রিয়্যাকশন আপডেট হলে UI আপডেট করা
        socket.on('update_reaction', ({ postId, reactions, totalReactions }) => {
            console.log("Reaction update received for post:", postId);
            queryClient.setQueryData(['posts'], (oldData = []) => 
                oldData.map(post => 
                    post._id === postId 
                        ? { ...post, reactions, totalReactions } 
                        : post
                )
            );
        });

        // কম্পোনেন্টটি আনমাউন্ট হলে লিসেনারগুলো বন্ধ করে দেওয়া
        return () => {
            socket.off('new_post');
            socket.off('update_reaction');
        };
    }, [queryClient]);

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <div className="text-center text-red-500 mt-8">Error fetching posts: {error.message}</div>;

    return (
        <div className="space-y-6">
            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                    <h3 className="text-2xl font-bold">No posts yet.</h3>
                    <p>Be the first to share something positive and educational!</p>
                </div>
            ) : (
                posts.map(post => <PostCard key={post._id} post={post} />)
            )}
        </div>
    );
};

export default NewsFeed;