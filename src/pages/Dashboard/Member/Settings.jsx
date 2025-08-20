import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../api/Axios";
import { toast } from "react-toastify";
import { FaUserCog, FaSave, FaMoon, FaBell, FaLock, FaLanguage, FaCamera, FaTrash, FaKey } from "react-icons/fa";
import { motion } from "framer-motion";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import useUserProfile from "../../../hooks/useUserProfile";
import Swal from 'sweetalert2';

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "bn", label: "Bengali" },
];
const TIMEZONES = [ "Asia/Dhaka", "America/New_York", "Europe/London" ];

const defaultSettings = {
    theme: "system",
    notifications: { email: true, push: true, sms: false },
    privacy: "public",
    language: "en",
    timezone: "Asia/Dhaka",
    profileImage: '',
};

const Settings = () => {
    const { user, logout, reauthenticate, updateUserEmail } = useAuth();
    const queryClient = useQueryClient();
    const { data: userProfile, refetch: refetchProfile } = useUserProfile();
    const fileInputRef = useRef(null);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const [formState, setFormState] = useState(defaultSettings);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [passwordModal, setPasswordModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [reauthModal, setReauthModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [imgUploading, setImgUploading] = useState(false);

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

    const { data: settingsData, isLoading } = useQuery({
        queryKey: ["user-settings", user?.email],
        queryFn: async () => (await axiosSecure.get("/api/settings")).data,
        enabled: !!user,
    });

    useEffect(() => {
        if (settingsData) {
            setFormState(settingsData);
        }
        if (userProfile) {
            setUserInfo({ name: userProfile.name, email: userProfile.email });
        }
    }, [settingsData, userProfile]);

    // --- মিউটেশন হুকগুলো ---
    const updateSettingsMutation = useMutation({
        mutationFn: (data) => axiosSecure.patch("/api/settings", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-settings", user?.email] });
        },
        onError: () => toast.error("Failed to update settings."),
    });
    
    const updateImageMutation = useMutation({
        mutationFn: (data) => axiosSecure.patch("/api/settings/profile-image", data),
        onSuccess: () => {
            toast.success("Profile image updated!");
            queryClient.invalidateQueries({ queryKey: ["user-settings", user?.email] });
            refetchProfile();
        },
        onError: () => toast.error("Failed to update profile image."),
    });

    const userInfoMutation = useMutation({
        mutationFn: (data) => axiosSecure.patch("/api/settings/user-info", data),
        onSuccess: () => {
            refetchProfile();
        },
        onError: () => toast.error("Failed to update profile info.")
    });

    const deleteMutation = useMutation({
        mutationFn: () => axiosSecure.delete("/api/settings/delete-account"),
        onSuccess: () => {
            Swal.fire(
                'Deleted!',
                'Your account has been permanently deleted.',
                'success'
            );
            logout().then(() => {
                setTimeout(() => window.location.href = "/", 1500);
            });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to delete account."),
    });

    const passwordMutation = useMutation({
        mutationFn: (data) => axiosSecure.patch("/api/settings/change-password", data),
        onSuccess: () => {
            toast.success("Password changed successfully!");
            setPasswordModal(false);
            setPasswords({ oldPassword: "", newPassword: "" });
        },
        onError: () => toast.error("Failed to change password.")
    });

    // --- হ্যান্ডলার ফাংশনগুলো ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith("notifications.")) {
            const notifKey = name.split(".")[1];
            setFormState(prev => ({...prev, notifications: { ...prev.notifications, [notifKey]: checked }}));
        } else {
            setFormState(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImgUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            
            const { data } = await axiosSecure.post("/api/upload/profile-image", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.imageUrl) {
                updateImageMutation.mutate({ imageUrl: data.imageUrl });
            } else {
                toast.error("Image upload failed.");
            }
        } catch {
            toast.error("Image upload failed.");
        }
        setImgUploading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const settingsPromise = updateSettingsMutation.mutateAsync(formState);
        const userInfoPromise = userInfo.name !== userProfile.name 
            ? userInfoMutation.mutateAsync({ name: userInfo.name, email: userProfile.email })
            : Promise.resolve();

        Promise.all([settingsPromise, userInfoPromise])
            .then(() => {
                if (userInfo.email !== userProfile.email) {
                    setReauthModal(true);
                } else {
                    toast.success("All changes saved successfully!");
                }
            })
            .catch(() => {
                toast.error("An error occurred while saving some changes.");
            });
    };
    
    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        try {
            await reauthenticate(currentPassword);
            await updateUserEmail(userInfo.email);
            await userInfoMutation.mutateAsync(userInfo);
            
            toast.success("Verification link sent to your new email! Please log out and log in again.");
            setReauthModal(false);
        } catch (error) {
            toast.error("Incorrect password. Please try again.");
        }
        setCurrentPassword('');
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        passwordMutation.mutate(passwords);
    };

    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'Are you absolutely sure?',
            text: "This action cannot be undone and will permanently delete your account and all its data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete my account!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate();
            }
        });
    };

    if (isLoading || !formState) return <LoadingSpinner />;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-10 left-1/4 w-72 h-72 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-10 right-1/4 w-72 h-72 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 py-12">
                <motion.div
                    className={`p-8 rounded-3xl shadow-lg ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md border transition-all duration-300 hover:scale-[1.01]`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.h2 
                        className={`text-4xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <FaUserCog /> User Settings
                    </motion.h2>
                    
                    <motion.div 
                        className="flex flex-col items-center mb-10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    >
                        <div className="relative group">
                            <img
                                src={settingsData?.profileImage || "/avatar-placeholder.png"}
                                alt="Profile"
                                className={`w-32 h-32 rounded-full object-cover border-4 shadow-xl ${isDark ? 'border-indigo-400/50' : 'border-pink-400/50'} ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}
                            />
                            <motion.button
                                className={`absolute bottom-2 right-2 p-3 rounded-full shadow-lg transition-all duration-300 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'}`}
                                onClick={() => fileInputRef.current.click()}
                                title="Change Profile Image"
                                disabled={imgUploading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {imgUploading ? <span className="loading loading-spinner loading-xs"></span> : <FaCamera />}
                            </motion.button>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} disabled={imgUploading} />
                        </div>
                    </motion.div>
                    
                    <motion.form 
                        onSubmit={handleSubmit} 
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                    >
                        <div className="space-y-2">
                            <label className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Full Name</label>
                            <input 
                                type="text" 
                                value={userInfo.name} 
                                onChange={e => setUserInfo({...userInfo, name: e.target.value})} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
                            <input 
                                type="email" 
                                value={userInfo.email} 
                                onChange={e => setUserInfo({...userInfo, email: e.target.value})} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FaMoon /> Theme
                            </label>
                            <select 
                                name="theme" 
                                value={formState.theme} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            >
                                <option value="system">System</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FaLanguage /> Language
                            </label>
                            <select 
                                name="language" 
                                value={formState.language} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            >
                                {LANGUAGES.map(lang => (<option key={lang.code} value={lang.code}>{lang.label}</option>))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FaLock /> Profile Privacy
                            </label>
                            <select 
                                name="privacy" 
                                value={formState.privacy} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Timezone</label>
                            <select 
                                name="timezone" 
                                value={formState.timezone} 
                                onChange={handleChange} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                            >
                                {TIMEZONES.map(tz => (<option key={tz} value={tz}>{tz}</option>))}
                            </select>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className={`font-semibold flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                <FaBell /> Notifications
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <motion.label 
                                    className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-md border ${isDark ? 'border-white/10' : 'border-pink-200/30'} cursor-pointer transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input 
                                        type="checkbox" 
                                        name="notifications.email" 
                                        checked={formState.notifications.email} 
                                        onChange={handleChange} 
                                        className={`toggle ${isDark ? 'toggle-info' : 'toggle-primary'}`}
                                    />
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</span>
                                </motion.label>
                                <motion.label 
                                    className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-md border ${isDark ? 'border-white/10' : 'border-pink-200/30'} cursor-pointer transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input 
                                        type="checkbox" 
                                        name="notifications.push" 
                                        checked={formState.notifications.push} 
                                        onChange={handleChange} 
                                        className={`toggle ${isDark ? 'toggle-info' : 'toggle-primary'}`}
                                    />
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Push</span>
                                </motion.label>
                                <motion.label 
                                    className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-md border ${isDark ? 'border-white/10' : 'border-pink-200/30'} cursor-pointer transition-all duration-300`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <input 
                                        type="checkbox" 
                                        name="notifications.sms" 
                                        checked={formState.notifications.sms} 
                                        onChange={handleChange} 
                                        className={`toggle ${isDark ? 'toggle-info' : 'toggle-primary'}`}
                                    />
                                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>SMS</span>
                                </motion.label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <motion.button 
                                type="submit" 
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} transition-all duration-300 flex items-center justify-center gap-2`}
                                disabled={updateSettingsMutation.isLoading || userInfoMutation.isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {updateSettingsMutation.isLoading || userInfoMutation.isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaSave />
                                )}
                                {updateSettingsMutation.isLoading || userInfoMutation.isLoading ? "Saving..." : "Save All Changes"}
                            </motion.button>
                        </div>
                    </motion.form>

                    <motion.div 
                        className={`mt-12 pt-8 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                    >
                        <h3 className="font-bold text-xl mb-6 text-red-500 flex items-center gap-2">
                            <FaLock /> Danger Zone
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.button 
                                className={`py-3 px-6 rounded-xl font-medium border-2 ${isDark ? 'border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10' : 'border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10'} transition-all duration-300 flex items-center justify-center gap-2`}
                                onClick={() => setPasswordModal(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaKey /> Change Password
                            </motion.button>
                            <motion.button 
                                className={`py-3 px-6 rounded-xl font-medium border-2 border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center gap-2`}
                                onClick={handleDeleteAccount} 
                                disabled={deleteMutation.isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {deleteMutation.isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaTrash />
                                )}
                                {deleteMutation.isLoading ? "Deleting..." : "Delete Account"}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Password Change Modal */}
            {passwordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div 
                        className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-pink-200/50'} backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-md relative border`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <button 
                            className={`absolute top-4 right-4 w-8 h-8 rounded-full ${isDark ? 'hover:bg-white/20' : 'hover:bg-gray-100'} flex items-center justify-center transition-all duration-200 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                            onClick={() => setPasswordModal(false)}
                        >
                            ✕
                        </button>
                        <h3 className={`font-bold text-xl mb-6 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                            <FaKey /> Change Password
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <input 
                                type="password" 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                placeholder="Old Password" 
                                value={passwords.oldPassword} 
                                onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))} 
                                required 
                            />
                            <input 
                                type="password" 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                placeholder="New Password" 
                                value={passwords.newPassword} 
                                onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} 
                                required 
                            />
                            <motion.button 
                                type="submit" 
                                className={`w-full py-3 px-6 rounded-xl font-semibold text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} transition-all duration-300 flex items-center justify-center gap-2`}
                                disabled={passwordMutation.isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {passwordMutation.isLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    "Change Password"
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Re-authentication Modal */}
            {reauthModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div 
                        className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/90 border-pink-200/50'} backdrop-blur-md rounded-2xl p-8 shadow-2xl w-full max-w-md relative border`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <button 
                            className={`absolute top-4 right-4 w-8 h-8 rounded-full ${isDark ? 'hover:bg-white/20' : 'hover:bg-gray-100'} flex items-center justify-center transition-all duration-200 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                            onClick={() => setReauthModal(false)}
                        >
                            ✕
                        </button>
                        <h3 className={`font-bold text-xl mb-4 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Confirm Your Identity</h3>
                        <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>To change your email, please enter your current password.</p>
                        <form onSubmit={handleEmailUpdate} className="space-y-4">
                            <input 
                                type="password" 
                                value={currentPassword} 
                                onChange={e => setCurrentPassword(e.target.value)} 
                                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                placeholder="Current Password" 
                                required 
                            />
                            <motion.button 
                                type="submit" 
                                className={`w-full py-3 px-6 rounded-xl font-semibold text-white border-none ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} transition-all duration-300`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Confirm & Update Email
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Settings;