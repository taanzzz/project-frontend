// 📁 File: src/pages/Store/CartPage.jsx

import React from 'react';
import { Link } from 'react-router';
import { useCart } from '../../Providers/CartProvider';
import { FaTrash, FaShoppingBag, FaPlus, FaMinus } from 'react-icons/fa';
import { FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
    const { cartItems, removeFromCart, cartTotal, totalItems } = useCart();
    
    // Placeholder function for quantity update. You would need to implement this in your CartProvider.
    const handleUpdateQuantity = (itemId, newQuantity) => {
        console.log(`Updating item ${itemId} to quantity ${newQuantity}`);
        // Example: updateCartItemQuantity(itemId, newQuantity);
    };

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <motion.h1 
                    className="text-4xl sm:text-5xl font-extrabold mb-8 flex items-center gap-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <FaShoppingBag /> My Shopping Bag
                </motion.h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <motion.div 
                            className="lg:col-span-2 space-y-6"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <AnimatePresence>
                                {cartItems.map(item => (
                                    <motion.div 
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                                        className="bg-base-100 rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4"
                                    >
                                        <img src={item.imageUrl} alt={item.name} className="w-28 h-28 object-cover rounded-lg flex-shrink-0"/>
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <p className="text-sm text-base-content/70">Price: ${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="btn btn-ghost btn-sm btn-circle" disabled={item.quantity <= 1}><FaMinus /></button>
                                            <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="btn btn-ghost btn-sm btn-circle"><FaPlus /></button>
                                        </div>
                                        <div className="text-center sm:text-right w-28 flex-shrink-0">
                                            <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button onClick={() => removeFromCart(item._id)} className="btn btn-ghost btn-xs text-error mt-1">
                                                <FaTrash /> Remove
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div 
                            className="lg:col-span-1 bg-base-100 p-6 rounded-2xl shadow-2xl lg:sticky lg:top-32"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold border-b border-base-300/60 pb-4 mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className='text-base-content/80'>Subtotal ({totalItems} items)</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className='text-base-content/80'>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link to="/store/checkout" className="btn btn-lg w-full mt-6 border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105 transition-transform">
                                Proceed to Checkout <FiArrowRight className="ml-2"/>
                            </Link>
                        </motion.div>
                    </div>
                ) : (
                    // Empty Cart View
                    <motion.div 
                        className="text-center py-20 bg-base-100 rounded-2xl shadow-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-content mb-6">
                            <FaShoppingBag className="text-5xl" />
                        </div>
                        <h2 className="text-3xl font-bold">Your Cart is Currently Empty</h2>
                        <p className="text-base-content/70 mt-2">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/store" className="btn btn-primary mt-8 transform hover:scale-105 transition-transform">
                            Continue Shopping
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CartPage;