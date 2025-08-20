import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaFileUpload, FaPaperPlane, FaUser, FaLightbulb, FaRocket, FaHeart, FaStar, FaBookOpen } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useMediaQuery } from '@react-hook/media-query';

// Mock components and hooks for demonstration
const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
    </div>
);

const useAuth = () => ({ user: { email: 'demo@example.com' } });

const axiosSecure = {
    post: async (url, data, config) => {
        // Mock API calls
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (url.includes('upload')) {
            return { data: { imageUrl: 'https://example.com/uploaded-file.pdf' } };
        }
        return { data: { message: 'Application submitted successfully!' } };
    }
};

const BecomeContributor = () => {
    const { user } = useAuth();
    const queryClient = { invalidateQueries: () => {} };
    const [sampleWorkUrl, setSampleWorkUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [theme, setTheme] = useState('light');
    const { register, handleSubmit, reset } = useForm();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isDark = theme === 'dark';

    // Theme detection
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.getAttribute('data-theme') || 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const mutation = useMutation({
        mutationFn: (applicationData) => axiosSecure.post('/api/applications', applicationData),
        onSuccess: (data) => {
            toast.success(data.data.message);
            queryClient.invalidateQueries({ queryKey: ['user-profile', user?.email] });
            reset();
            setSampleWorkUrl('');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit application.");
        }
    });

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const { data } = await axiosSecure.post('/api/upload/profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSampleWorkUrl(data.imageUrl);
            toast.success("Sample work uploaded successfully!");
        } catch (error) {
            toast.error("File upload failed.");
        }
        setUploading(false);
    };

    const onSubmit = (data) => {
        const finalSampleUrl = data.sampleWorkUrl || sampleWorkUrl;
        if (!finalSampleUrl) {
            return toast.error("Please provide a sample of your work.");
        }
        const applicationData = {
            reason: data.reason,
            sampleWorkUrl: finalSampleUrl
        };
        mutation.mutate(applicationData);
    };

    // Animation variants
    const fadeUp = isMobile
        ? {
              hidden: { opacity: 0, y: 10 },
              visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, ease: 'easeOut' }
              }
          }
        : {
              hidden: { opacity: 0, y: 50 },
              visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: 'easeOut' }
              }
          };

    const staggerContainer = isMobile
        ? {
              hidden: { opacity: 0 },
              visible: {
                  opacity: 1,
                  transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.05
                  }
              }
          }
        : {
              hidden: { opacity: 0 },
              visible: {
                  opacity: 1,
                  transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.1
                  }
              }
          };

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-pink-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse'}`} />
                <div className={`absolute bottom-20 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/20' : 'bg-rose-400/20'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-1000'}`} />
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${isDark ? 'bg-cyan-500/10' : 'bg-orange-400/10'} rounded-full blur-3xl ${isMobile ? '' : 'animate-pulse delay-500'}`} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16 sm:mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeUp}
                >
                    <motion.div 
                        className="inline-flex items-center gap-3 mb-8"
                        whileHover={isMobile ? {} : { scale: 1.05 }}
                        transition={isMobile ? {} : { type: 'spring', stiffness: 300 }}
                    >
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} ${isMobile ? '' : 'animate-pulse'}`} />
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-500'} ${isMobile ? '' : 'animate-pulse delay-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-orange-500'} ${isMobile ? '' : 'animate-pulse delay-400'}`} />
                    </motion.div>

                    <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 via-purple-400 to-cyan-400' : 'from-pink-600 via-rose-600 to-orange-600'} drop-shadow-2xl tracking-tight`}>
                        Become a Contributor
                    </h1>
                    
                    <p className={`text-lg sm:text-2xl lg:text-3xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-light max-w-4xl mx-auto leading-relaxed px-4`}>
                        Share your <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>wisdom</span> and 
                        <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'} mx-2`}>insights</span> 
                        with our growing community of seekers
                    </p>

                    {/* Stats Preview */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12"
                        initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.8 }}
                        whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                        transition={isMobile ? { delay: 0.2, duration: 0.3 } : { delay: 0.5, duration: 0.6 }}
                    >
                        <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-white/10 border border-white/20' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md`}>
                            <FaUser className={`${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />
                            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>50+ Contributors</span>
                        </div>
                        <div className={`flex items-center gap-2 px-6 py-3 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
                            <FaStar className="text-amber-400" />
                            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Premium Quality</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Main Application Form */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12"
                >
                    {/* Left Side - Benefits */}
                    <motion.div 
                        variants={fadeUp}
                        className="lg:col-span-1 space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b ${isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'}`} />
                                <h2 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                                    Why Join Us?
                                </h2>
                            </div>
                        </div>

                        <motion.div 
                            className="space-y-6"
                            variants={staggerContainer}
                        >
                            <motion.div 
                                variants={fadeUp}
                                className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-indigo-500/20' : 'bg-pink-100'} flex items-center justify-center mb-4 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                    <FaLightbulb className={`text-xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                                </div>
                                <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Share Knowledge</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Help thousands discover new perspectives and insights through your unique content
                                </p>
                            </motion.div>

                            <motion.div 
                                variants={fadeUp}
                                className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-rose-100'} flex items-center justify-center mb-4 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                    <FaRocket className={`text-xl ${isDark ? 'text-purple-400' : 'text-rose-600'}`} />
                                </div>
                                <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Grow Your Reach</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Expand your audience and connect with like-minded individuals across the platform
                                </p>
                            </motion.div>

                            <motion.div 
                                variants={fadeUp}
                                className={`p-6 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md group ${isMobile ? '' : 'hover:scale-105 transition-all duration-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-cyan-500/20' : 'bg-orange-100'} flex items-center justify-center mb-4 ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                    <FaHeart className={`text-xl ${isDark ? 'text-cyan-400' : 'text-orange-600'}`} />
                                </div>
                                <h3 className={`font-bold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Make Impact</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Create meaningful change in people's lives through thoughtful, quality content
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Application Form */}
                    <motion.div 
                        variants={fadeUp}
                        className="lg:col-span-2"
                    >
                        <div className={`p-8 sm:p-12 rounded-2xl sm:rounded-3xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-white/80 border border-pink-200/50'} backdrop-blur-md shadow-2xl`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-1 h-12 sm:h-16 rounded-full bg-gradient-to-b ${isDark ? 'from-indigo-500 to-purple-500' : 'from-pink-500 to-rose-500'}`} />
                                <h2 className={`text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                                    Application Form
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                {/* Step 1: Motivation */}
                                <motion.div
                                    variants={fadeUp}
                                >
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-indigo-500/20 border border-indigo-400/50' : 'bg-pink-100 border border-pink-300/50'} flex items-center justify-center text-sm font-bold ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>
                                                1
                                            </div>
                                            <h3 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-indigo-400 to-purple-400' : 'from-pink-600 to-rose-600'}`}>
                                                Your Motivation
                                            </h3>
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ml-11`}>
                                            Tell us why you're passionate about sharing knowledge with our community
                                        </p>
                                    </div>

                                    <motion.div
                                        whileFocus={isMobile ? {} : { scale: 1.02 }}
                                        transition={isMobile ? {} : { duration: 0.2 }}
                                    >
                                        <textarea 
                                            {...register("reason", { required: true })}
                                            className={`w-full h-32 px-4 py-4 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500 focus:border-indigo-400' : 'focus:ring-pink-500 focus:border-pink-400'} transition-all duration-300 resize-none`}
                                            placeholder="I am passionate about sharing knowledge because..."
                                        />
                                    </motion.div>
                                </motion.div>

                                {/* Step 2: Sample Work */}
                                <motion.div
                                    variants={fadeUp}
                                >
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-purple-500/20 border border-purple-400/50' : 'bg-rose-100 border border-rose-300/50'} flex items-center justify-center text-sm font-bold ${isDark ? 'text-purple-400' : 'text-rose-600'}`}>
                                                2
                                            </div>
                                            <h3 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-purple-400 to-cyan-400' : 'from-rose-600 to-orange-600'}`}>
                                                Share Your Best Work
                                            </h3>
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} ml-11`}>
                                            Provide a link to your work or upload a sample file to showcase your expertise
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <motion.div
                                            whileFocus={isMobile ? {} : { scale: 1.02 }}
                                            transition={isMobile ? {} : { duration: 0.2 }}
                                        >
                                            <input 
                                                type="url" 
                                                {...register("sampleWorkUrl")}
                                                placeholder="Paste a link to your work here (e.g., Flipbook, Portfolio, etc.)" 
                                                className={`w-full px-4 py-4 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-white/20 text-gray-300 placeholder:text-gray-500' : 'bg-white/80 border-pink-200/50 text-gray-700 placeholder:text-gray-500'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-purple-500 focus:border-purple-400' : 'focus:ring-rose-500 focus:border-rose-400'} transition-all duration-300`}
                                            />
                                        </motion.div>

                                        <div className={`relative flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className="flex-grow border-t border-current opacity-30"></div>
                                            <span className="flex-shrink mx-4 text-sm font-medium">OR</span>
                                            <div className="flex-grow border-t border-current opacity-30"></div>
                                        </div>

                                        <motion.div 
                                            className={`relative w-full h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-center ${
                                                isDark 
                                                    ? sampleWorkUrl 
                                                        ? 'border-indigo-400/70 bg-indigo-900/50' 
                                                        : 'border-indigo-400/50 bg-indigo-900/30 hover:bg-indigo-900/50 hover:border-indigo-400/70' 
                                                    : sampleWorkUrl 
                                                        ? 'border-pink-400/70 bg-pink-100/70' 
                                                        : 'border-pink-300/50 bg-pink-100/30 hover:bg-pink-100/50 hover:border-pink-400/70'
                                            } transition-all duration-300 cursor-pointer group`}
                                            whileHover={isMobile ? {} : { scale: 1.02 }}
                                            transition={isMobile ? {} : { duration: 0.2 }}
                                        >
                                            {uploading ? (
                                                <LoadingSpinner />
                                            ) : sampleWorkUrl ? (
                                                <motion.div
                                                    className="space-y-3"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                >
                                                    <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-pink-100'} flex items-center justify-center mx-auto`}>
                                                        <FaBookOpen className={`text-2xl ${isDark ? 'text-indigo-400' : 'text-pink-600'}`} />
                                                    </div>
                                                    <p className={`font-bold text-lg ${isDark ? 'text-indigo-300' : 'text-pink-600'}`}>
                                                        File Uploaded Successfully!
                                                    </p>
                                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Click to upload a different file
                                                    </p>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    className="space-y-4"
                                                    whileHover={isMobile ? {} : { y: -5 }}
                                                >
                                                    <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-purple-500/20' : 'bg-rose-100'} flex items-center justify-center mx-auto ${isMobile ? '' : 'group-hover:scale-110 transition-all duration-300'}`}>
                                                        <FaFileUpload className={`text-2xl ${isDark ? 'text-purple-400' : 'text-rose-600'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                                            Upload Sample File
                                                        </p>
                                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            PDF, DOC, or other formats supported
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                                onChange={(e) => handleFileUpload(e.target.files[0])} 
                                                disabled={uploading} 
                                            />
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div
                                    className="pt-6"
                                    variants={fadeUp}
                                >
                                    <motion.button 
                                        type="submit" 
                                        className={`w-full py-4 px-8 rounded-2xl font-bold text-white border-none ${
                                            isDark 
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/30' 
                                                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-pink-500/30'
                                        } shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg`}
                                        disabled={mutation.isLoading || uploading}
                                        whileHover={isMobile ? {} : { scale: mutation.isLoading || uploading ? 1 : 1.05 }}
                                        whileTap={isMobile ? {} : { scale: mutation.isLoading || uploading ? 1 : 0.95 }}
                                    >
                                        <FaPaperPlane className="text-xl" />
                                        {mutation.isLoading ? "Submitting Application..." : "Submit Application"}
                                    </motion.button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    className="text-center mt-16 sm:mt-24"
                    initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9 }}
                    whileInView={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <p className={`text-lg sm:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} font-light max-w-3xl mx-auto leading-relaxed px-4`}>
                        Join our community of passionate contributors and help shape the future of 
                        <span className={`font-bold mx-2 ${isDark ? 'text-indigo-400' : 'text-pink-600'}`}>mindful learning</span>
                        together.
                    </p>
                    
                    <motion.div
                        className="flex justify-center items-center gap-3 mt-8"
                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
                        whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                        transition={isMobile ? { delay: 0.1, duration: 0.3 } : { delay: 0.3, duration: 0.6 }}
                    >
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-pink-500'} ${isMobile ? '' : 'animate-pulse'}`} />
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-purple-400' : 'bg-rose-500'} ${isMobile ? '' : 'animate-pulse delay-200'}`} />
                        <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-orange-500'} ${isMobile ? '' : 'animate-pulse delay-400'}`} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default BecomeContributor;