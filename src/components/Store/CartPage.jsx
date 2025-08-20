import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCart } from '../../Providers/CartProvider';
import { FaTrash, FaShoppingBag, FaPlus, FaMinus } from 'react-icons/fa';
import { FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
    const { cartItems, removeFromCart, cartTotal, totalItems } = useCart();
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

    // Placeholder function for quantity update
    const handleUpdateQuantity = (itemId, newQuantity) => {
        console.log(`Updating item ${itemId} to quantity ${newQuantity}`);
        // Example: updateCartItemQuantity(itemId, newQuantity);
    };

    return (
        <motion.div
            className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-100'} transition-all duration-300`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <motion.h1
                    className={`text-4xl sm:text-5xl font-extrabold mb-8 flex items-center gap-4 bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} text-shadow-sm`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <FaShoppingBag /> My Shopping Bag
                </motion.h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                        {/* Cart Items List */}
                        <motion.div
                            className="lg:col-span-2 space-y-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <AnimatePresence>
                                {cartItems.map(item => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                        className={`rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-2xl transition-all duration-300`}
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                                {item.name}
                                            </h3>
                                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Price: ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <motion.button
                                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                className={`btn btn-ghost btn-sm btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                                                disabled={item.quantity <= 1}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaMinus />
                                            </motion.button>
                                            <span className={`font-bold text-lg w-8 text-center ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                                {item.quantity}
                                            </span>
                                            <motion.button
                                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                className={`btn btn-ghost btn-sm btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaPlus />
                                            </motion.button>
                                        </div>
                                        <div className="text-center sm:text-right w-28 flex-shrink-0">
                                            <p className={`font-semibold text-lg ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <motion.button
                                                onClick={() => removeFromCart(item._id)}
                                                className={`btn btn-ghost btn-xs ${isDark ? 'text-red-400 hover:bg-white/20' : 'text-red-500 hover:bg-white/90'} mt-1 transition-all duration-300`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <FaTrash /> Remove
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            className={`lg:col-span-1 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md p-6 rounded-3xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} lg:sticky lg:top-32 transition-all duration-300`}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                        >
                            <h2 className={`text-2xl font-bold border-b ${isDark ? 'border-white/20 text-gray-100' : 'border-pink-200/50 text-gray-600'} pb-4 mb-4`}>
                                Order Summary
                            </h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        Subtotal ({totalItems} items)
                                    </span>
                                    <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        Shipping
                                    </span>
                                    <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>
                                        Free
                                    </span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between font-bold text-xl">
                                    <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>
                                        Total
                                    </span>
                                    <span className={isDark ? 'text-gray-100' : 'text-gray-600'}>
                                        ${cartTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <Link
                                to="/store/checkout"
                                className={`btn btn-lg w-full mt-6 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-xl transition-all duration-300`}
                            >
                                Proceed to Checkout <FiArrowRight className="ml-2"/>
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    // Empty Cart View
                    <motion.div
                        className={`text-center py-20 ${isDark ? 'bg-gray-900/95 border-white/20' : 'bg-white/95 border-pink-200/50'} backdrop-blur-md rounded-3xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} transition-all duration-300`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-gradient-to-br from-pink-500 to-rose-500'} text-white mb-6 shadow-lg`}>
                            <FaShoppingBag className="text-5xl" />
                        </div>
                        <h2 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                            Your Cart is Currently Empty
                        </h2>
                        <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <Link
                            to="/store"
                            className={`btn mt-8 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} rounded-xl shadow-lg ${isDark ? 'shadow-indigo-500/30' : 'shadow-pink-500/30'} hover:shadow-xl transition-all duration-300`}
                        >
                            Continue Shopping
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default CartPage;