// 📁 File: src/pages/Dashboard/Member/Tabs/MyPostsTab.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../../api/Axios';
import LoadingSpinner from '../../../../components/Shared/LoadingSpinner';
import PostCard from '../../../../components/Community/PostCard'; // ✅ PostCard পুনরায় ব্যবহার করা হচ্ছে

const MyPostsTab = () => {
    const { data: myPosts = [], isLoading } = useQuery({
        queryKey: ['my-posts'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/my-posts');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            {myPosts.length > 0 ? (
                <div className="space-y-6">
                    {myPosts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-base-content/60">
                    <h3 className="text-2xl font-bold">You haven't posted anything yet.</h3>
                    <p>Share your thoughts with the community!</p>
                </div>
            )}
        </div>
    );
};

export default MyPostsTab;