// 📁 File: src/pages/Dashboard/Member/Tabs/FollowersTab.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../../api/Axios';
import LoadingSpinner from '../../../../components/Shared/LoadingSpinner';
import { Link } from 'react-router';

const FollowersTab = () => {
    const { data: followers = [], isLoading } = useQuery({
        queryKey: ['my-followers'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/activity/my-followers');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            {followers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {followers.map(user => (
                        <div key={user._id} className="bg-base-100 p-4 rounded-lg shadow flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img src={user.image} alt={user.name} />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold">{user.name}</p>
                                </div>
                            </div>
                            <Link to={`/profiles/${user._id}`} className="btn btn-primary btn-sm">
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center py-16 text-base-content/60">You have no followers yet.</p>
            )}
        </div>
    );
};

export default FollowersTab;