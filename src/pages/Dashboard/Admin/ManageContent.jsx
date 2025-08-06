// 📁 File: src/pages/Dashboard/Admin/ManageContent.jsx

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axiosSecure from './../../../api/Axios';
import LoadingSpinner from './../../../components/Shared/LoadingSpinner';

const ManageContent = () => {
    const queryClient = useQueryClient();

    const { data: content = [], isLoading } = useQuery({
        queryKey: ['all-content-admin'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/content/admin/all');
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: ({ contentId, status }) => axiosSecure.patch(`/api/content/admin/status/${contentId}`, { status }),
        onSuccess: (data, variables) => {
            toast.success(`Content has been ${variables.status}!`);
            queryClient.invalidateQueries({ queryKey: ['all-content-admin'] });
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Action failed.')
    });

    const handleStatusUpdate = (contentId, status) => {
        mutation.mutate({ contentId, status });
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="w-full p-8">
            <h1 className="text-4xl font-extrabold mb-8">Manage Content</h1>
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
                <table className="table w-full">
                    <thead className="bg-base-300">
                        <tr>
                            <th>Content Info</th>
                            <th>Contributor</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.map(item => {
                            // --- Solution: Handle both old and new data structures ---
                            const contributorName = item.contributor?.name || item.userName || 'N/A';
                            
                            return (
                                <tr key={item._id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar"><div className="mask mask-squircle w-12 h-12"><img src={item.coverImage} alt={item.title} /></div></div>
                                            <div><div className="font-bold">{item.title}</div><div className="text-sm opacity-50">{item.category}</div></div>
                                        </div>
                                    </td>
                                    <td>{contributorName}</td>
                                    <td><span className={`badge ${item.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span></td>
                                    <td className="text-center space-x-2">
                                        <button onClick={() => handleStatusUpdate(item._id, 'approved')} disabled={item.status !== 'pending'} className="btn btn-sm btn-success text-white">Approve</button>
                                        <button onClick={() => handleStatusUpdate(item._id, 'rejected')} disabled={item.status !== 'pending'} className="btn btn-sm btn-error text-white">Reject</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageContent;