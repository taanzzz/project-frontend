// 📁 File: src/pages/Dashboard/Contributor/AddContent.jsx

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import { toast } from 'react-toastify';
import useAuth from '../../../hooks/useAuth';
import { FaPlusCircle, FaUpload, FaInfoCircle, FaBookOpen, FaMagic, FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const contentTypes = ["E-book", "Audiobook", "PDF"];
const categories = ["Philosophy", "Self-Development", "Psychology"];

const AddContent = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [coverImage, setCoverImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
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

    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm();

    const mutation = useMutation({
        mutationFn: (newContent) => axiosSecure.post('/api/content', newContent),
        onSuccess: () => {
            toast.success("Content submitted for review successfully!");
            queryClient.invalidateQueries({ queryKey: ['my-content'] });
            reset();
            setCoverImage(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit content.");
        }
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
            toast.success("Cover image uploaded!");
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
        if (!coverImage) {
            return toast.error("Please upload a cover image.");
        }
        // ✅ 'type' field-ke array hishebe format kora hocche
        const selectedTypes = Object.entries(data.type)
            .filter(([, value]) => value === true)
            .map(([key]) => key);

        const contentData = {
            ...data,
            type: selectedTypes,
            coverImage
        };
        mutation.mutate(contentData);
    };

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
                <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/10'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/10'} rounded-full blur-3xl animate-pulse delay-1000`} />
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
            Submit Your Content
        </h1>
    </div>
    <p className={`text-base lg:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto leading-relaxed`}>
        Share your wisdom with the community. Create something extraordinary that inspires and educates others.
    </p>
</motion.div>
                
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Main Content Form */}
                    <motion.div
    variants={itemVariants}
    className={`xl:col-span-3 rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-2xl p-4 lg:p-8`}
>
    <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
            <FaBookOpen className="text-white text-xl" />
        </div>
        <h2 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
            Content Details
        </h2>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:space-y-8">
        {/* Basic Information Section */}
        <div className={`p-4 lg:p-6 rounded-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} border backdrop-blur-sm`}>
            <h3 className={`text-lg lg:text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6`}>
                Basic Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., The Stoic Mind"
                            {...register("title", { required: "Title is required." })}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Subtitle (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="A short, catchy subtitle"
                            {...register("subtitle")}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Author *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Marcus Aurelius"
                            {...register("author", { required: "Author is required." })}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                        />
                        {errors.author && <p className="text-red-500 text-sm mt-1">Author is required.</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Category *
                        </label>
                        <select
                            {...register("category", { required: "Category is required." })}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">Category is required.</p>}
                    </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 mt-6 lg:mt-0`}>
                        Cover Image *
                    </label>
                    <div
                        className={`relative h-64 lg:h-80 w-full border-2 border-dashed rounded-2xl transition-all duration-300 ${
                            dragActive
                                ? (isDark ? 'border-indigo-400 bg-indigo-500/20' : 'border-pink-400 bg-pink-100/50')
                                : (isDark ? 'border-white/30 bg-gray-800/30' : 'border-pink-200/50 bg-white/60')
                        } backdrop-blur-md overflow-hidden group hover:${isDark ? 'border-indigo-400' : 'border-pink-400'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <AnimatePresence>
                            {coverImage ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative h-full w-full"
                                >
                                    <img
                                        src={coverImage}
                                        alt="Cover preview"
                                        className="h-full w-full object-cover rounded-xl"
                                    />
                                    <div className={`absolute inset-0 ${isDark ? 'bg-black/40' : 'bg-white/40'} opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl`}>
                                        <div className="text-center">
                                            <FaCheckCircle className={`text-4xl ${isDark ? 'text-green-400' : 'text-green-500'} mb-2 mx-auto`} />
                                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                                Click to change
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center p-4">
                                    <div className="space-y-4">
                                        <motion.div
                                            animate={{
                                                y: uploading ? [-10, 10, -10] : 0,
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: uploading ? Infinity : 0,
                                            }}
                                        >
                                            <FaCloudUploadAlt className={`mx-auto text-5xl lg:text-6xl ${isDark ? 'text-indigo-400' : 'text-pink-400'} group-hover:scale-110 transition-transform duration-300`} />
                                        </motion.div>
                                        <div>
                                            <p className={`text-base lg:text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                                {uploading ? "Uploading..." : "Drop your image here"}
                                            </p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                or click to browse
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                                                PNG, JPG (MAX. 800x1200px)
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
        </div>

        {/* Description Section */}
        <div className={`p-4 lg:p-6 rounded-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} border backdrop-blur-sm`}>
            <h3 className={`text-lg lg:text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6`}>
                Description
            </h3>
            <textarea
                {...register("description", { required: "Description is required." })}
                className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 resize-none`}
                rows="5"
                placeholder="Provide a compelling and detailed description of your content..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">Description is required.</p>}
        </div>

        {/* Content Type & Settings */}
        <div className={`p-4 lg:p-6 rounded-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} border backdrop-blur-sm`}>
            <h3 className={`text-lg lg:text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-700'} mb-6`}>
                Content Settings
            </h3>
            <div className="space-y-6">
                <div>
                    <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
                        Content Type (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {contentTypes.map(type => (
                            <label key={type} className={`relative flex items-center p-3 lg:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                watch(`type.${type}`)
                                    ? (isDark ? 'border-indigo-400 bg-indigo-500/20' : 'border-pink-400 bg-pink-100/50')
                                    : (isDark ? 'border-white/20 bg-gray-800/30' : 'border-pink-200/50 bg-white/60')
                            } hover:${isDark ? 'border-indigo-400' : 'border-pink-400'} backdrop-blur-md`}>
                                <input
                                    type="checkbox"
                                    {...register(`type.${type}`)}
                                    className={`sr-only`}
                                />
                                <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 mr-2 transition-all duration-200 ${
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
                                <span className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Flipbook Embed Code/URL *
                        </label>
                        <input
                            type="text"
                            {...register("flipbookEmbedCode", { required: "Flipbook URL is required." })}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            placeholder="https://example.com/flipbook"
                        />
                        {errors.flipbookEmbedCode && <p className="text-red-500 text-sm mt-1">Flipbook URL is required.</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                            Audiobook URL (Optional)
                        </label>
                        <input
                            type="url"
                            {...register("audioUrl")}
                            className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 focus:border-indigo-400' : 'bg-white/80 text-gray-700 border-pink-200/50 focus:border-pink-400'} border backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            placeholder="https://example.com/audio.mp3"
                        />
                    </div>
                </div>

                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white/60'} backdrop-blur-md`}>
                    <div>
                        <label className={`text-base lg:text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Make this item available for sale?
                        </label>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                            Enable monetization for this content
                        </p>
                    </div>
                    <Controller
                        name="isForSale"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    {...field}
                                />
                                <div className={`w-16 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ${isDark ? 'peer-focus:ring-indigo-800' : 'peer-focus:ring-pink-300'} dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all ${isDark ? 'peer-checked:bg-indigo-600' : 'peer-checked:bg-pink-600'}`}></div>
                            </label>
                        )}
                    />
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <motion.button
            type="submit"
            className={`w-full py-3 lg:py-4 px-8 rounded-2xl text-white text-base lg:text-lg font-semibold ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
            disabled={mutation.isPending || uploading}
            whileHover={{ scale: mutation.isPending || uploading ? 1 : 1.02 }}
            whileTap={{ scale: mutation.isPending || uploading ? 1 : 0.98 }}
        >
            {mutation.isPending ? (
                <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Submitting...
                </>
            ) : (
                <>
                    <FaPlusCircle className="text-xl" />
                    Submit for Review
                </>
            )}
        </motion.button>
    </form>
</motion.div>
                    {/* Guidelines Sidebar */}
                    <motion.div 
                        variants={itemVariants}
                        className={`xl:col-span-1 rounded-3xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-md border shadow-2xl p-6 h-fit sticky top-24`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} shadow-lg`}>
                                <FaInfoCircle className="text-white text-xl" />
                            </div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                Submission Guidelines
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: FaCheckCircle, title: "Content Quality", desc: "Must be educational, insightful, or philosophical" },
                                { icon: FaUpload, title: "Cover Image", desc: "High-quality and relevant (min. 800x1200px)" },
                                { icon: FaBookOpen, title: "Description", desc: "Clear, concise, and compelling summary" },
                                { icon: FaCheckCircle, title: "Audio Quality", desc: "Clear audio with no background noise" },
                                { icon: FaTimesCircle, title: "Prohibited", desc: "No hate speech, misinformation, or spam" }
                            ].map((guideline, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} border backdrop-blur-sm`}
                                >
                                    <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-pink-500/20'} flex-shrink-0`}>
                                        <guideline.icon className={`text-lg ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                                            {guideline.title}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                                            {guideline.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-indigo-500/10 border-indigo-400/30' : 'bg-pink-100/50 border-pink-300/30'} border backdrop-blur-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                                <FaInfoCircle className={`${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                                <span className={`font-semibold ${isDark ? 'text-indigo-300' : 'text-pink-700'}`}>
                                    Pro Tip
                                </span>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-indigo-200' : 'text-pink-600'} leading-relaxed`}>
                                Content with high-quality cover images and detailed descriptions get approved faster and receive better engagement.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddContent;