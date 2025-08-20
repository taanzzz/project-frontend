// 📁 File: src/pages/Store/ShoppingBagPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCart } from '../../Providers/CartProvider';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { FaTrash, FaShoppingBag, FaPlus, FaMinus, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- Cart Item Row Sub-component ---
const CartItemRow = ({ item, removeFromCart, isDark }) => {
    // Placeholder for quantity update logic
    const handleUpdateQuantity = (newQuantity) => {
        console.log(`Updating ${item._id} to quantity ${newQuantity}`);
        // You would need to implement updateCartItemQuantity(item._id, newQuantity) in your CartProvider
    };

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`${isDark ? 'border-white/20' : 'border-pink-200/50'} border-b last:border-b-0 hover:${isDark ? 'bg-white/5' : 'bg-pink-50/50'} transition-all duration-300`}
        >
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <motion.img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    <span className={`font-semibold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                        {item.name}
                    </span>
                </div>
            </td>
            <td className={`p-6 text-center font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                ${item.price.toFixed(2)}
            </td>
            <td className="p-6">
                <div className="flex items-center justify-center gap-3">
                    <motion.button
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        className={`btn btn-sm btn-circle ${isDark ? 'bg-gray-800/50 border-white/20 hover:bg-white/20 text-gray-300' : 'bg-white/80 border-pink-200/50 hover:bg-pink-50 text-gray-600'} backdrop-blur-md transition-all duration-300`}
                        disabled={item.quantity <= 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaMinus className="text-xs" />
                    </motion.button>
                    <span className={`font-bold text-lg w-12 text-center ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                        {item.quantity}
                    </span>
                    <motion.button
                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        className={`btn btn-sm btn-circle ${isDark ? 'bg-gray-800/50 border-white/20 hover:bg-white/20 text-gray-300' : 'bg-white/80 border-pink-200/50 hover:bg-pink-50 text-gray-600'} backdrop-blur-md transition-all duration-300`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus className="text-xs" />
                    </motion.button>
                </div>
            </td>
            <td className={`p-6 text-center font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                ${(item.price * item.quantity).toFixed(2)}
            </td>
            <td className="p-6 text-center">
                <motion.button
                    onClick={() => removeFromCart(item._id)}
                    className={`btn btn-sm btn-circle ${isDark ? 'bg-red-500/20 border-red-400/30 hover:bg-red-500/30 text-red-400' : 'bg-red-50 border-red-200 hover:bg-red-100 text-red-500'} transition-all duration-300`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaTrash className="text-sm" />
                </motion.button>
            </td>
        </motion.tr>
    );
};

const ShoppingBagPage = () => {
    const { cartItems, removeFromCart, cartTotal } = useCart();
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

    // --- Empty Cart View ---
    if (cartItems.length === 0) {
        return (
            <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-screen flex items-center justify-center p-4`}>
                {/* Background Gradient Orbs */}
                <div className="absolute inset-0">
                    <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
                </div>

                <motion.div
                    className={`text-center p-12 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md rounded-3xl shadow-2xl relative z-10`}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} text-white mb-8 shadow-2xl`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
                    >
                        <FaShoppingBag className="text-6xl" />
                    </motion.div>
                    <motion.h2
                        className={`text-4xl font-bold mb-4 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        Your Shopping Bag is Empty
                    </motion.h2>
                    <motion.p
                        className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-lg mb-8`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Add items to your bag to see them here.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <Link
                            to="/store"
                            className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 transform hover:scale-105`}
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
                <motion.h1
                    className={`text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    Shopping Cart & Checkout
                </motion.h1>
                
                <motion.div
                    className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl space-y-12`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                >
                    <section>
                        <motion.h2
                            className={`text-3xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Your Cart
                        </motion.h2>
                        <motion.div
                            className="overflow-x-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <table className="table w-full">
                                <thead>
                                    <tr className={`${isDark ? 'border-white/30' : 'border-pink-300/50'} border-b-2`}>
                                        <th className={`p-6 text-left font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Product</th>
                                        <th className={`p-6 text-center font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Price</th>
                                        <th className={`p-6 text-center font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Quantity</th>
                                        <th className={`p-6 text-center font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Subtotal</th>
                                        <th className={`p-6 text-center font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {cartItems.map(item => (
                                            <CartItemRow 
                                                key={item._id} 
                                                item={item} 
                                                removeFromCart={removeFromCart} 
                                                isDark={isDark}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </motion.div>
                    </section>

                    <form onSubmit={handleConfirmOrder}>
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} backdrop-blur-md p-6 rounded-2xl border`}>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Contact Information</h2>
                                <div className="space-y-4">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className={`input w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 placeholder:text-gray-400' : 'bg-white/80 text-gray-600 border-pink-200/50 placeholder:text-gray-500'} backdrop-blur-md rounded-xl p-4 text-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className={`input w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 placeholder:text-gray-400' : 'bg-white/80 text-gray-600 border-pink-200/50 placeholder:text-gray-500'} backdrop-blur-md rounded-xl p-4 text-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} backdrop-blur-md p-6 rounded-2xl border`}>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Shipping Address</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className={`input w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 placeholder:text-gray-400' : 'bg-white/80 text-gray-600 border-pink-200/50 placeholder:text-gray-500'} backdrop-blur-md rounded-xl p-4 text-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className={`input w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20 placeholder:text-gray-400' : 'bg-white/80 text-gray-600 border-pink-200/50 placeholder:text-gray-500'} backdrop-blur-md rounded-xl p-4 text-lg focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                        required
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <div className={`divider mt-12 mb-8 ${isDark ? 'divider-neutral' : 'divider-primary'}`}></div>
                        
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-pink-200/30'} backdrop-blur-md p-6 rounded-2xl border`}>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Payment Method</h2>
                                <div className={`p-6 border-2 rounded-2xl ${isDark ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-pink-500/50 bg-pink-500/10'} backdrop-blur-md`}>
                                    <label className="flex items-center gap-4 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            className={`radio ${isDark ? 'radio-primary [--chkbg:theme(colors.indigo.500)]' : 'radio-primary [--chkbg:theme(colors.pink.500)]'} radio-lg`}
                                            checked
                                            readOnly
                                        />
                                        <span className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                            Mobile Banking / SSLCOMMERZ
                                        </span>
                                    </label>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-3 ml-12 leading-relaxed`}>
                                        You will be redirected to a secure payment gateway to complete your purchase.
                                    </p>
                                </div>
                            </div>
                            <div className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'} backdrop-blur-md p-8 rounded-2xl shadow-xl`}>
                                <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>Order Summary</h3>
                                <div className="space-y-4">
                                    <div className={`flex justify-between text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span>Subtotal</span>
                                        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className={`flex justify-between text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span>Shipping</span>
                                        <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>Free</span>
                                    </div>
                                    <div className={`divider my-4 ${isDark ? 'divider-neutral' : 'divider-primary'}`}></div>
                                    <div className={`flex justify-between font-bold text-2xl ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <motion.button
                                    type="submit"
                                    className={`btn btn-lg w-full mt-8 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300 text-lg font-bold`}
                                    disabled={mutation.isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaLock className="mr-3" />
                                    {mutation.isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm mr-2"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        "Place Order"
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ShoppingBagPage;