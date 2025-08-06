import React, { createContext, useEffect, useState, useMemo } from 'react';
import {createUserWithEmailAndPassword,GoogleAuthProvider,onAuthStateChanged,sendPasswordResetEmail,signInWithEmailAndPassword,signInWithPopup,signOut,updateProfile} from 'firebase/auth';
import { auth } from './../firebase/firebase.init';
import axiosSecure from './../api/Axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    
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
            if (currentUser) {
                
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

    const register = (name, email, photoURL, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                return updateProfile(result.user, {
                    displayName: name,
                    photoURL: photoURL,
                }).then(() => {
                    
                    const userInfo = {
                        email: result.user.email,
                        name: name, 
                        photoURL: photoURL, 
                    };
                    axiosSecure.post('/api/auth/jwt', userInfo);
                    return result;
                });
            });
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
    }), [user, userRole, loading]);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </AuthContext.Provider>
    );
};