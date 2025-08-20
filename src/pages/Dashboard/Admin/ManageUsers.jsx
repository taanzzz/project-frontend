// 📁 File: src/pages/Dashboard/Admin/ManageUsers.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import UserCard from './UserCard';
import Swal from 'sweetalert2';
import { FaUsers, FaUserShield, FaUserEdit, FaUser, FaCrown, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced User Card Component
const EnhancedUserCard = ({ user, onChangeRole, onDeleteUser, isDark }) => {
    const getRoleInfo = (role) => {
        switch (role) {
            case 'Admin':
                return {
                    color: isDark ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30',
                    icon: FaCrown,
                    gradient: 'from-red-500 to-pink-500'
                };
            case 'Contributor':
                return {
                    color: isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-500/20 text-blue-600 border-blue-500/30',
                    icon: FaUserEdit,
                    gradient: 'from-blue-500 to-indigo-500'
                };
            case 'Member':
                return {
                    color: isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
                    icon: FaUser,
                    gradient: 'from-emerald-500 to-teal-500'
                };
            default:
                return {
                    color: isDark ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-gray-500/20 text-gray-600 border-gray-500/30',
                    icon: FaUser,
                    gradient: 'from-gray-500 to-slate-500'
                };
        }
    };

    const roleInfo = getRoleInfo(user.role);
    const RoleIcon = roleInfo.icon;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <motion.div
            className={`group relative ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border rounded-3xl shadow-lg transition-all duration-300 overflow-hidden`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-500/10 to-purple-500/10' : 'from-pink-500/10 to-rose-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6">
                {/* User Avatar and Info */}
                <div className="flex flex-col items-center text-center mb-6">
                    <motion.div 
                        className={`w-20 h-20 rounded-full ring-4 ring-offset-4 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'} mb-4 overflow-hidden`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img 
                            src={user.avatar || '/default-avatar.png'} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    
                    <h3 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-1 line-clamp-1`}>
                        {user.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3 line-clamp-1`}>
                        {user.email}
                    </p>
                    
                    {/* Role Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${roleInfo.color}`}>
                        <RoleIcon className="text-xs" />
                        {user.role}
                    </div>
                </div>

                {/* User Stats */}
                <div className={`border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} pt-4 mb-6`}>
                    <div className="grid grid-cols-1 gap-2 text-center">
                        <div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                                Joined
                            </p>
                            <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                {formatDate(user.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    <div className="dropdown dropdown-top w-full">
                        <motion.button 
                            tabIndex={0}
                            className={`btn btn-sm w-full border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUserShield className="mr-2" /> Change Role
                        </motion.button>
                        <ul tabIndex={0} className={`dropdown-content z-[1] menu p-2 shadow ${isDark ? 'bg-gray-800 border-white/20' : 'bg-white border-pink-200/50'} backdrop-blur-md border rounded-box w-52`}>
                            {['Admin', 'Contributor', 'Member'].filter(role => role !== user.role).map(role => (
                                <li key={role}>
                                    <button 
                                        onClick={() => onChangeRole(user, role)}
                                        className={`${isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-700 hover:bg-pink-50'}`}
                                    >
                                        Make {role}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <motion.button 
                        onClick={() => onDeleteUser(user)}
                        className={`btn btn-sm w-full border-none text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Delete User
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const ManageUsers = () => {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const queryClient = useQueryClient();

    // Sync theme with localStorage and data-theme
    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleStorageChange);
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(currentTheme);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            observer.disconnect();
        };
    }, []);

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => (await axiosSecure.get('/api/admin/users')).data,
    });

    const roleMutation = useMutation({
        mutationFn: ({ userId, newRole }) => axiosSecure.patch(`/api/admin/users/role/${userId}`, { newRole }),
        onSuccess: () => {
            Swal.fire('Success!', 'User role has been updated.', 'success');
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
        },
        onError: () => Swal.fire('Error!', 'Could not update user role.', 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: (userId) => axiosSecure.delete(`/api/admin/users/${userId}`),
        onSuccess: () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
        },
        onError: () => Swal.fire('Error!', 'Could not delete the user.', 'error'),
    });

    const handleChangeRole = (user, newRole) => {
        Swal.fire({
            title: `Change ${user.name}'s role to ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then((result) => {
            if (result.isConfirmed) {
                roleMutation.mutate({ userId: user._id, newRole });
            }
        });
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: `Are you sure you want to delete ${user.name}?`,
            text: "This action cannot be undone!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete user!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(user._id);
            }
        });
    };

    const filteredUsers = useMemo(() => {
        let filtered = users;
        
        // Filter by role
        if (filter !== 'All') {
            filtered = filtered.filter(user => user.role === filter);
        }
        
        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [users, filter, searchTerm]);

    const filterTabs = [
        { key: 'All', label: 'All Users', icon: FaUsers, count: users.length },
        { key: 'Admin', label: 'Admins', icon: FaCrown, count: users.filter(u => u.role === 'Admin').length },
        { key: 'Contributor', label: 'Contributors', icon: FaUserEdit, count: users.filter(u => u.role === 'Contributor').length },
        { key: 'Member', label: 'Members', icon: FaUser, count: users.filter(u => u.role === 'Member').length }
    ];

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 to-indigo-950' : 'bg-gradient-to-br from-pink-50 to-rose-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-40 right-1/3 w-80 h-80 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/3 right-10 w-64 h-64 ${isDark ? 'bg-pink-500/20' : 'bg-orange-400/15'} rounded-full blur-3xl animate-pulse delay-2000`} />
            </div>

            <div className="relative p-4 sm:p-8 z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center md:text-left mb-8"
                >
                    <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} flex items-center gap-4`}>
                        <div className={`p-3 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} rounded-2xl`}>
                            <FaUsers className={`text-3xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                        </div>
                        User Management
                    </h1>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-3 text-lg font-medium`}>
                        Manage user roles and permissions across the platform.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div 
                    className="mb-8 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                >
                    <div className="relative">
                        <FaSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 ${isDark ? 'bg-white/10 text-gray-300 border-white/20 placeholder-gray-400' : 'bg-white/80 text-gray-600 border-pink-200/50 placeholder-gray-500'} backdrop-blur-md border rounded-2xl focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                        />
                    </div>
                </motion.div>
            
                {/* Enhanced Filter Buttons */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <div className="flex flex-wrap justify-center gap-3">
                        {filterTabs.map((tab, index) => {
                            const TabIcon = tab.icon;
                            return (
                                <motion.button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                                        filter === tab.key
                                            ? isDark 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                                            : isDark
                                                ? 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                                                : 'bg-white/70 text-gray-600 hover:bg-white/90 border border-pink-200/50'
                                    } backdrop-blur-md`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 + (index * 0.1) }}
                                >
                                    <TabIcon className="text-sm" />
                                    <span>{tab.label}</span>
                                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        filter === tab.key 
                                            ? 'bg-white/20 text-white' 
                                            : isDark 
                                                ? 'bg-indigo-500/20 text-indigo-400'
                                                : 'bg-pink-500/20 text-pink-600'
                                    }`}>
                                        {tab.count}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Users Grid */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={`${filter}-${searchTerm}`}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
                            >
                                <EnhancedUserCard 
                                    user={user} 
                                    onChangeRole={handleChangeRole} 
                                    onDeleteUser={handleDeleteUser}
                                    isDark={isDark}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <motion.div 
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className={`w-24 h-24 mx-auto ${isDark ? 'bg-white/10' : 'bg-pink-500/20'} rounded-full flex items-center justify-center mb-6`}>
                            <FaUsers className={`text-4xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                            No users found
                        </h3>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {searchTerm ? 'Try adjusting your search terms.' : 'No users match the current filter criteria.'}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;