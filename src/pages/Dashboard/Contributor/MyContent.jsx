// 📁 File: src/pages/Dashboard/Contributor/MyContent.jsx

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import { format } from 'date-fns';
import { FaEdit, FaEye, FaTrash, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPlus, FaBookmark, FaCalendarAlt, FaUser, FaMagic, FaUpload, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { useForm, Controller } from 'react-hook-form';



const contentTypes = ["E-book", "Audiobook", "PDF"];

// --- Premium Content Card Component ---
const ContentCard = ({ item, onEdit, isDark }) => {
    const getStatusInfo = (status) => {
        switch (status) {
            case 'approved': return { 
                text: 'Approved', 
                icon: FaCheckCircle,
                gradient: 'from-green-500 to-emerald-500',
                bg: 'bg-green-500/10',
                border: 'border-green-400/30'
            };
            case 'pending': return { 
                text: 'Pending Review', 
                icon: FaHourglassHalf,
                gradient: 'from-yellow-500 to-amber-500',
                bg: 'bg-yellow-500/10',
                border: 'border-yellow-400/30'
            };
            case 'rejected': return { 
                text: 'Needs Review', 
                icon: FaTimesCircle,
                gradient: 'from-red-500 to-rose-500',
                bg: 'bg-red-500/10',
                border: 'border-red-400/30'
            };
            default: return { 
                text: 'Unknown', 
                icon: FaBookmark,
                gradient: 'from-gray-500 to-gray-600',
                bg: 'bg-gray-500/10',
                border: 'border-gray-400/30'
            };
        }
    };
    const statusInfo = getStatusInfo(item.status);
    const StatusIcon = statusInfo.icon;

    return (
        <motion.div 
            className={`group relative overflow-hidden rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            {/* Background Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-600/10 to-purple-600/10' : 'from-pink-500/10 to-rose-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r ${statusInfo.gradient} text-white text-sm font-semibold shadow-lg backdrop-blur-md`}>
                    <StatusIcon className="text-xs" />
                    {statusInfo.text}
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button 
                        onClick={() => onEdit(item)}
                        className={`p-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-white/90'} backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 mr-3`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaEdit className={`text-lg ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    </motion.button>
                    <motion.button 
                        className={`p-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-white/90'} backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaEye className={`text-lg ${isDark ? 'text-white' : 'text-gray-700'}`} />
                    </motion.button>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative p-6 space-y-4">
                <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-2 line-clamp-2 group-hover:${isDark ? 'text-indigo-300' : 'text-pink-600'} transition-colors duration-300`}>
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <FaUser className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium`}>
                            {item.author}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {format(new Date(item.createdAt), 'dd MMM, yyyy')}
                        </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.border} border`}>
                        {item.category || 'General'}
                    </div>
                </div>

                {/* Type badges */}
                <div className="flex flex-wrap gap-2">
                    {item.type?.map((type, index) => (
                        <span 
                            key={index}
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-pink-500/20 text-pink-600'}`}
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- Premium Edit Modal Component ---
const EditContentModal = ({ content, onClose, isDark }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [coverImage, setCoverImage] = useState(content.coverImage);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const { register, handleSubmit, control, watch } = useForm({
        defaultValues: {
            ...content,
            type: (content.type || []).reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
        }
    });

    const mutation = useMutation({
        mutationFn: (updatedContent) => axiosSecure.patch(`/api/content/update/${content._id}`, updatedContent),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['my-content', user?.email] });
            onClose();
        },
        onError: (error) => toast.error(error.response?.data?.message)
    });

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await axiosSecure.post('/api/upload/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCoverImage(data.imageUrl);
            toast.success("Cover image updated!");
        } catch (error) {
            toast.error("Image upload failed.");
        }
        setUploading(false);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const onSubmit = (data) => {
        const selectedTypes = Object.entries(data.type || {}).filter(([, value]) => value === true).map(([key]) => key);
        mutation.mutate({ ...data, type: selectedTypes, coverImage });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md border shadow-2xl overflow-hidden`}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Header */}
                    <div className={`p-8 border-b ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
                                    <FaEdit className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                        Edit Your Content
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-amber-600'} mt-1`}>
                                        ⚠️ After editing, your content will be sent for review again.
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors duration-200`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                            Title
                                        </label>
                                        <input 
                                            {...register("title")} 
                                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                            Author
                                        </label>
                                        <input 
                                            {...register("author")} 
                                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                            Description
                                        </label>
                                        <textarea 
                                            {...register("description")} 
                                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 resize-none`}
                                            rows={4}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                                            Content Type
                                        </label>
                                        <div className="space-y-3">
                                            {contentTypes.map(type => (
                                                <label key={type} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                                                    watch(`type.${type}`) 
                                                        ? (isDark ? 'border-indigo-400 bg-indigo-500/20' : 'border-pink-400 bg-pink-100/50')
                                                        : (isDark ? 'border-white/20 bg-gray-800/30' : 'border-pink-200/50 bg-white/60')
                                                } hover:${isDark ? 'border-indigo-400' : 'border-pink-400'} backdrop-blur-sm`}>
                                                    <input 
                                                        type="checkbox" 
                                                        {...register(`type.${type}`)} 
                                                        className="sr-only"
                                                    />
                                                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-3 transition-all duration-200 ${
                                                        watch(`type.${type}`) 
                                                            ? (isDark ? 'border-indigo-400 bg-indigo-400' : 'border-pink-400 bg-pink-400')
                                                            : (isDark ? 'border-gray-400' : 'border-gray-300')
                                                    }`}>
                                                        {watch(`type.${type}`) && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="w-2 h-2 bg-white rounded-full"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                                        {type}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Image Upload */}
                                <div>
                                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                        Cover Image
                                    </label>
                                    <div 
                                        className={`relative h-96 w-full border-2 border-dashed rounded-2xl transition-all duration-300 ${
                                            dragActive 
                                                ? (isDark ? 'border-indigo-400 bg-indigo-500/20' : 'border-pink-400 bg-pink-100/50')
                                                : (isDark ? 'border-white/30 bg-gray-800/30' : 'border-pink-200/50 bg-white/60')
                                        } backdrop-blur-md overflow-hidden hover:${isDark ? 'border-indigo-400' : 'border-pink-400'}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <AnimatePresence>
                                            {coverImage ? (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative h-full w-full"
                                                >
                                                    <img 
                                                        src={coverImage} 
                                                        alt="Cover preview" 
                                                        className="h-full w-full object-cover rounded-xl" 
                                                    />
                                                    <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/40'} opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl`}>
                                                        <div className="text-center">
                                                            <FaUpload className={`text-3xl ${isDark ? 'text-white' : 'text-gray-700'} mb-2 mx-auto`} />
                                                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                                Click to change
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-center p-6">
                                                    <div className="space-y-4">
                                                        <FaUpload className={`mx-auto text-4xl ${isDark ? 'text-indigo-400' : 'text-pink-400'}`} />
                                                        <div>
                                                            <p className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                                                {uploading ? "Uploading..." : "Drop new image here"}
                                                            </p>
                                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                                or click to browse
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                            onChange={(e) => handleImageUpload(e.target.files[0])} 
                                            disabled={uploading}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer Actions */}
                    <div className={`p-6 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'} flex items-center justify-end gap-4`}>
                        <motion.button 
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-3 rounded-xl ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} font-medium transition-colors duration-200`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button 
                            onClick={handleSubmit(onSubmit)}
                            className={`px-6 py-3 rounded-xl text-white font-semibold ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50`}
                            disabled={mutation.isPending || uploading}
                            whileHover={{ scale: mutation.isPending || uploading ? 1 : 1.02 }}
                            whileTap={{ scale: mutation.isPending || uploading ? 1 : 0.98 }}
                        >
                            {mutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Save & Re-submit
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const MyContent = () => {
    const { user } = useAuth();
    const [editingContent, setEditingContent] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Theme synchronization
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

    const { data: myContent = [], isLoading, error } = useQuery({
        queryKey: ['my-content', user?.email],
        queryFn: async () => (await axiosSecure.get(`/api/content/my-content/${user.email}`)).data,
        enabled: !!user?.email,
    });

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500">Failed to load your content.</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.6,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' }
        }
    };

    return (
        <div className={`relative min-h-screen overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900' : 'bg-gradient-to-br from-pink-50 via-white to-rose-50'}`}>
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-20 w-72 h-72 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/10'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-20 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/10'} rounded-full blur-3xl animate-pulse delay-1000`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isDark ? 'bg-indigo-400/10' : 'bg-pink-300/8'} rounded-full blur-3xl animate-pulse delay-500`} />
            </div>

            <motion.div 
                className="relative z-10 p-4 sm:p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
    variants={itemVariants}
    className={`text-center p-5 lg:p-8 rounded-3xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} backdrop-blur-md border shadow-2xl mb-8`}
>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
        <div className={`p-3 lg:p-4 rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg mb-3 sm:mb-0`}>
            <FaMagic className="text-white text-2xl lg:text-3xl" />
        </div>
        <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
            My Content Submissions
        </h1>
    </div>
    <p className={`text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
        Track the status and manage all your submitted content with ease and style.
    </p>
</motion.div>

                <motion.div variants={itemVariants} className="mt-8">
                    {myContent.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {myContent.map((item) => (
                                <ContentCard 
                                    key={item._id} 
                                    item={item} 
                                    onEdit={setEditingContent} 
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            variants={itemVariants}
                            className={`text-center p-12 rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-2xl`}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
                                className={`mx-auto w-32 h-32 rounded-full ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20' : 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'} flex items-center justify-center mb-8`}
                            >
                                <FaBookmark className={`text-6xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            </motion.div>
                            
                            <h3 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-4`}>
                                No Content Found
                            </h3>
                            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-md mx-auto leading-relaxed`}>
                                You haven't submitted any content yet. Start your creative journey by sharing your first piece of content with our community.
                            </p>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/dashboard/add-content"
                                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-lg font-semibold ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} shadow-lg transition-all duration-300`}
                                >
                                    <FaPlus className="text-xl" />
                                    Submit Your First Content
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Statistics Overview */}
                {myContent.length > 0 && (
                    <motion.div 
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
                    >
                        {[
                            { 
                                label: 'Total Submissions', 
                                value: myContent.length, 
                                icon: FaBookmark,
                                gradient: isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'
                            },
                            { 
                                label: 'Approved', 
                                value: myContent.filter(item => item.status === 'approved').length, 
                                icon: FaCheckCircle,
                                gradient: 'from-green-500 to-emerald-500'
                            },
                            { 
                                label: 'Pending Review', 
                                value: myContent.filter(item => item.status === 'pending').length, 
                                icon: FaHourglassHalf,
                                gradient: 'from-yellow-500 to-amber-500'
                            }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className={`p-6 rounded-2xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                                whileHover={{ scale: 1.02, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                            {stat.label}
                                        </p>
                                        <p className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="text-white text-xl" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            {/* Edit Modal */}
            {editingContent && (
                <EditContentModal 
                    content={editingContent}
                    onClose={() => setEditingContent(null)}
                    isDark={isDark}
                />
            )}
        </div>
    );
};

export default MyContent;