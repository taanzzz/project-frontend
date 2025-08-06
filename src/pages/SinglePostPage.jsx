// 📁 File: src/pages/SinglePostPage.jsx

import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import PostCard from '../components/Community/PostCard'; // আমরা PostCard ব্যবহার করব

const SinglePostPage = () => {
    const { id } = useParams();

    const { data: post, isLoading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/posts/${id}`);
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;
    if (!post) return <div className="text-center py-20">Post not found.</div>;

    return (
        <div className="bg-base-200 min-h-screen py-12">
            <div className="max-w-2xl mx-auto">
                <PostCard post={post} />
                {/* ভবিষ্যতে এখানে কমেন্ট সেকশনও দেখানো যেতে পারে */}
            </div>
        </div>
    );
};

export default SinglePostPage;