import React, { useState, useEffect } from 'react';
import { useCart } from '../../Providers/CartProvider';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { FaShieldAlt, FaUser, FaMapMarkerAlt, FaCity, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { cartItems, cartTotal } = useCart();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

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

    const mutation = useMutation({
        mutationFn: (paymentData) => axiosSecure.post('/api/payment/initiate', paymentData),
        onSuccess: (data) => {
            window.location.replace(data.data.url);
        }
    });

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        mutation.mutate({ cartItems, totalAmount: cartTotal });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div
            className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-100'} transition-all duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <motion.h1
                    className={`text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Final Step to Your Order
                </motion.h1>
                
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-16 items-start"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* --- Shipping Details Form (Left Pane) --- */}
                    <motion.div className="lg:col-span-3" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-8">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isDark ? 'bg-indigo-500 text-white' : 'bg-pink-500 text-white'} font-bold text-lg shadow-sm`}>1</span>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>Shipping Details</h2>
                        </div>
                        <form className="space-y-8">
                            <div className="relative">
                                <FaUser className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className={`input bg-transparent border-0 border-b-2 ${isDark ? 'border-white/20 text-gray-300' : 'border-pink-200/50 text-gray-600'} w-full pl-10 focus:outline-none focus:border-b-2 ${isDark ? 'focus:border-indigo-500' : 'focus:border-pink-500'} transition-colors duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <FaMapMarkerAlt className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    className={`input bg-transparent border-0 border-b-2 ${isDark ? 'border-white/20 text-gray-300' : 'border-pink-200/50 text-gray-600'} w-full pl-10 focus:outline-none focus:border-b-2 ${isDark ? 'focus:border-indigo-500' : 'focus:border-pink-500'} transition-colors duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div className="relative">
                                    <FaCity className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className={`input bg-transparent border-0 border-b-2 ${isDark ? 'border-white/20 text-gray-300' : 'border-pink-200/50 text-gray-600'} w-full pl-10 focus:outline-none focus:border-b-2 ${isDark ? 'focus:border-indigo-500' : 'focus:border-pink-500'} transition-colors duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    className={`input bg-transparent border-0 border-b-2 ${isDark ? 'border-white/20 text-gray-300' : 'border-pink-200/50 text-gray-600'} w-full focus:outline-none focus:border-b-2 ${isDark ? 'focus:border-indigo-500' : 'focus:border-pink-500'} transition-colors duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <FaPhone className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className={`input bg-transparent border-0 border-b-2 ${isDark ? 'border-white/20 text-gray-300' : 'border-pink-200/50 text-gray-600'} w-full pl-10 focus:outline-none focus:border-b-2 ${isDark ? 'focus:border-indigo-500' : 'focus:border-pink-500'} transition-colors duration-300 placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    required
                                />
                            </div>
                        </form>
                    </motion.div>

                    {/* --- Order Summary (Right Pane) --- */}
                    <motion.div
                        className={`lg:col-span-2 lg:sticky lg:top-32 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} transition-all duration-300`}
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${isDark ? 'bg-purple-500 text-white' : 'bg-rose-500 text-white'} font-bold text-lg shadow-sm`}>2</span>
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>Order Summary</h2>
                        </div>
                        <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <li key={item._id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <p className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-600'} line-clamp-1`}>{item.name}</p>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>${(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="divider my-4"></div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                                <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Shipping</span>
                                <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>Free</span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="flex justify-between font-bold text-xl">
                                <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>Total</span>
                                <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <motion.button
                            onClick={handleConfirmOrder}
                            className={`btn btn-lg w-full mt-6 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-xl transition-all duration-300`}
                            disabled={mutation.isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaShieldAlt className="mr-2" />
                            {mutation.isLoading ? "Processing..." : "Confirm & Pay"}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CheckoutPage;