// 📁 File: src/pages/Dashboard/Member/Tabs/EngagementsTab.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../../api/Axios';
import LoadingSpinner from '../../../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaComment } from 'react-icons/fa';

const EngagementsTab = () => {
    const { data: engagements = { comments: [], reactions: [] }, isLoading } = useQuery({
        queryKey: ['my-engagements'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/engagements');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    const { comments, reactions } = engagements;

    return (
        <div className="space-y-8">
            {/* Comments Section */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Latest Comments on Your Posts</h3>
                {comments.length > 0 ? (
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment._id} className="bg-base-100 p-4 rounded-lg shadow flex items-start gap-4">
                                <FaComment className="text-secondary mt-1" />
                                <div className="flex-grow">
                                    <p>
                                        <span className="font-bold">{comment.authorInfo.name}</span> commented: "{comment.content || 'sticker'}"
                                    </p>
                                    <Link to={`/post/${comment.postId}?highlight=${comment._id}`} className="text-sm text-blue-500 hover:underline">
                                        View Post
                                    </Link>
                                    <p className="text-xs text-base-content/60 mt-1">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p>No one has commented on your posts yet.</p>}
            </div>

            {/* Reactions Section */}
            <div>
                <h3 className="text-2xl font-bold mb-4">Latest Reactions on Your Posts</h3>
                {reactions.length > 0 ? (
                    <div className="space-y-4">
                        {/* We need to process the reactions array to show individual reactions */}
                        <p>Reaction display coming soon...</p>
                    </div>
                ) : <p>No one has reacted to your posts yet.</p>}
            </div>
        </div>
    );
};

export default EngagementsTab;