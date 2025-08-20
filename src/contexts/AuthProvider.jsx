// 📁 File: src/contexts/AuthProvider.jsx

import React, { createContext, useEffect, useState, useMemo } from 'react';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    updateEmail, // ✅ নতুন ইম্পোর্ট
    updatePassword, // ✅ নতুন ইম্পোর্ট
    reauthenticateWithCredential, // ✅ নতুন ইম্পোর্ট
    EmailAuthProvider,
    sendEmailVerification // ✅ নতুন ইম্পোর্ট
} from 'firebase/auth';
import { auth } from './../firebase/firebase.init';
import axiosSecure from './../api/Axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

    const getJwtAndRole = async (userInfo) => {
        try {
            const { data } = await axiosSecure.post('/api/auth/jwt', userInfo);
            localStorage.setItem("access-token", data.token);
            setUserRole(data.role);
        } catch (err) {
            console.error("Failed to fetch JWT or Role:", err);
            localStorage.removeItem("access-token");
            setUserRole(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            setUser(currentUser);
            if (currentUser && currentUser.emailVerified) {
                const userInfo = {
                    email: currentUser.email,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                };
                await getJwtAndRole(userInfo);
            } else {
                localStorage.removeItem('access-token');
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // ✅ register ফাংশনটি আপডেট করা হয়েছে
    const register = async (name, email, photoURL, password) => {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(result.user);
        await updateProfile(result.user, {
            displayName: name,
            photoURL: photoURL,
        });
        const userInfo = {
            email: result.user.email,
            name,
            photoURL,
        };
        await axiosSecure.post('/api/auth/jwt', userInfo);
        return result;
    };

    const googleSignIn = () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };
    
    const resetPassword = (email) => {
        setLoading(true); 
        return sendPasswordResetEmail(auth, email);
    };
    
    // ইমেইল এবং পাসওয়ার্ড পরিবর্তনের মতো সংবেদনশীল কাজের আগে ব্যবহারকারীকে পুনরায় প্রমাণীকরণ করা
    const reauthenticate = (currentPassword) => {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        return reauthenticateWithCredential(user, credential);
    };

    // Firebase-এ ইমেইল আপডেট করার ফাংশন
    const updateUserEmail = (newEmail) => {
        setLoading(true);
        return updateEmail(auth.currentUser, newEmail);
    };

    // Firebase-এ পাসওয়ার্ড আপডেট করার ফাংশন
    const updateUserPassword = (newPassword) => {
        setLoading(true);
        return updatePassword(auth.currentUser, newPassword);
    };

    const authInfo = useMemo(() => ({
        user,
        userRole,
        loading,
        setLoading,
        login,
        register,
        googleSignIn,
        logout,
        resetPassword,
        reauthenticate, // ✅ Context-এ যোগ করা হয়েছে
        updateUserEmail, // ✅ Context-এ যোগ করা হয়েছে
        updateUserPassword, // ✅ Context-এ যোগ করা হয়েছে
        updateProfile,
    }), [user, userRole, loading]);

    const isDark = theme === 'dark';

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={isDark ? "dark" : "light"}
                limit={3}
                toastStyle={{
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.95), rgba(139, 92, 246, 0.95))' 
                        : 'linear-gradient(135deg, rgba(236, 72, 153, 0.95), rgba(239, 68, 68, 0.95))',
                    backdropFilter: 'blur(20px)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(236, 72, 153, 0.2)',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontWeight: '500',
                    fontSize: '14px',
                    boxShadow: isDark 
                        ? '0 20px 25px -5px rgba(99, 102, 241, 0.3), 0 10px 10px -5px rgba(99, 102, 241, 0.1)' 
                        : '0 20px 25px -5px rgba(236, 72, 153, 0.3), 0 10px 10px -5px rgba(236, 72, 153, 0.1)',
                }}
                bodyStyle={{
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    lineHeight: '1.4',
                    padding: '8px 0',
                }}
                progressStyle={{
                    background: isDark 
                        ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))' 
                        : 'linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                    height: '3px',
                    borderRadius: '2px',
                }}
                closeButton={({ closeToast }) => (
                    <button
                        onClick={closeToast}
                        className="absolute top-2 right-3 text-white/80 hover:text-white transition-colors duration-200 text-lg font-bold leading-none"
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                        }}
                    >
                        ×
                    </button>
                )}
                toastClassName={() => 
                    "relative flex mt-20 p-4 min-h-14 rounded-2xl justify-between overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
                }
                bodyClassName={() => "text-sm font-medium flex-1 pr-6"}
                style={{
                    '--toastify-color-success': isDark 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))' 
                        : 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.95))',
                    '--toastify-color-error': isDark 
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 127, 0.95))' 
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 127, 0.95))',
                    '--toastify-color-warning': isDark 
                        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))' 
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))',
                    '--toastify-color-info': isDark 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.95))' 
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(99, 102, 241, 0.95))',
                }}
            />
        </AuthContext.Provider>
    );
};