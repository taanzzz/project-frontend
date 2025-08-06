// 📁 File: src/pages/Dashboard/Contributor/MyContent.jsx

import React, { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { AuthContext } from './../../../contexts/AuthProvider';
import axiosSecure from './../../../api/Axios';
import LoadingSpinner from './../../../components/Shared/LoadingSpinner';

const MyContent = () => {
    const { user } = useContext(AuthContext);
    const { data: myContent = [], isLoading } = useQuery({
        queryKey: ['my-content', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/content/my-content/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="w-full min-h-screen p-8 bg-base-200">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold">My Content</h1>
                    <p className="mt-2 text-lg text-base-content/70">Track the status and performance of your submissions.</p>
                </header>

                {myContent.length === 0 ? (
                    <div className="text-center py-20 bg-base-100 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold">You haven't submitted any content yet.</h2>
                        <Link to="/dashboard/add-content" className="btn btn-primary text-white mt-4">Submit Your First Piece</Link>
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {myContent.map(item => (
                            <motion.div
                                key={item._id}
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                                className="card bg-base-100 shadow-xl border border-base-300/20"
                            >
                                <figure className="h-56"><img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" /></figure>
                                <div className="card-body">
                                    <h2 className="card-title">{item.title}</h2>
                                    <div className="card-actions justify-end mt-2">
                                        <span className={`badge badge-lg ${
                                            item.status === 'approved' ? 'badge-success' : 
                                            item.status === 'pending' ? 'badge-warning' : 'badge-error'
                                        }`}>{item.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyContent;