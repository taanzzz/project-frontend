// 📁 File: src/pages/Dashboard/Common/Profile.jsx

import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaEnvelope, FaEdit } from 'react-icons/fa';
import { MdVerified } from "react-icons/md";
import { FaBrain } from 'react-icons/fa6'; // নতুন আইকন
import { AuthContext } from './../../../contexts/AuthProvider';
import axiosSecure from './../../../api/Axios';
import LoadingSpinner from './../../../components/Shared/LoadingSpinner';
import EditProfileModal from './EditProfileModal';

const Profile = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: profileData, refetch } = useQuery({
        queryKey: ['profile', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/users/profile/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    if (authLoading || !profileData) return <LoadingSpinner />;
    
    const { name, email, image, role } = profileData;
    const userImage = image || `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

    return (
        <>
            <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 bg-base-200">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* ব্যানার */}
                        <div className="h-48 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg"></div>
                        {/* প্রোফাইল ছবি এবং নাম */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                            <div className="avatar">
                                <div className="w-32 rounded-full ring-4 ring-base-100 shadow-xl">
                                    <img src={userImage} alt={name} />
                                </div>
                            </div>
                            <h1 className="text-3xl font-extrabold text-base-content mt-4">{name}</h1>
                            <span className="badge badge-lg badge-outline border-accent text-accent font-semibold mt-2">
                                {role} <MdVerified className="ml-1" />
                            </span>
                        </div>
                    </div>

                    {/* বিস্তারিত তথ্যের কার্ড (ব্যানারের নিচে জায়গা রাখার জন্য) */}
                    <div className="mt-32 p-8 bg-base-100 rounded-2xl shadow-xl border border-base-300/20">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-outline btn-primary btn-sm">
                                <FaEdit /> Edit Profile
                            </button>
                        </div>
                        <div className="divider"></div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <FaEnvelope className="w-6 h-6 text-secondary" />
                                <div>
                                    <p className="text-sm text-base-content/70">Email</p>
                                    <p className="text-lg font-medium text-base-content">{email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <FaBrain className="w-6 h-6 text-secondary" />
                                <div>
                                    <p className="text-sm text-base-content/70">Role</p>
                                    <p className="text-lg font-medium text-base-content">{role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <EditProfileModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileData={profileData}
            />
        </>
    );
};

export default Profile;