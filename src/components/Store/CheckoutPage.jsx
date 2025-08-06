// 📁 File: src/pages/Store/CheckoutPage.jsx

import React from 'react';
import { useCart } from '../../Providers/CartProvider';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { FaShieldAlt, FaUser, FaMapMarkerAlt, FaCity, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CheckoutPage = () => {
    const { cartItems, cartTotal } = useCart();

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
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
                <motion.h1 
                    className="text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Final Step to Your Order
                </motion.h1>
                
                <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-start"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    
                    {/* --- Shipping Details Form (Left Pane) --- */}
                    <motion.div className="lg:col-span-3" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-content font-bold text-lg">1</span>
                            <h2 className="text-2xl font-bold text-base-content">Shipping Details</h2>
                        </div>
                        <form className="space-y-8">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="text" placeholder="Full Name" className="input bg-transparent border-0 border-b-2 border-base-300 w-full pl-10 focus:border-primary transition-colors" required />
                            </div>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="text" placeholder="Street Address" className="input bg-transparent border-0 border-b-2 border-base-300 w-full pl-10 focus:border-primary transition-colors" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="relative">
                                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                    <input type="text" placeholder="City" className="input bg-transparent border-0 border-b-2 border-base-300 w-full pl-10 focus:border-primary transition-colors" required />
                                </div>
                                <input type="text" placeholder="Postal Code" className="input bg-transparent border-0 border-b-2 border-base-300 w-full focus:border-primary transition-colors" required />
                            </div>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                                <input type="tel" placeholder="Phone Number" className="input bg-transparent border-0 border-b-2 border-base-300 w-full pl-10 focus:border-primary transition-colors" required />
                            </div>
                        </form>
                    </motion.div>

                    {/* --- Order Summary (Right Pane) --- */}
                    <motion.div className="lg:col-span-2 lg:sticky lg:top-32 bg-base-100 p-6 sm:p-8 rounded-2xl shadow-2xl" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-content font-bold text-lg">2</span>
                            <h2 className="text-2xl font-bold text-base-content">Order Summary</h2>
                        </div>
                        <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <li key={item._id} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <p className="font-semibold text-base-content line-clamp-1">{item.name}</p>
                                            <p className="text-sm text-base-content/70">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-base-content/90">${(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="divider my-4"></div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-base-content/80"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-base-content/80"><span>Shipping</span><span>Free</span></div>
                            <div className="divider my-2"></div>
                            <div className="flex justify-between font-bold text-xl text-base-content"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
                        </div>
                        <button 
                            onClick={handleConfirmOrder} 
                            className="btn btn-lg w-full mt-6 border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105 transition-transform shadow-lg hover:shadow-primary/50" 
                            disabled={mutation.isLoading}
                        >
                            <FaShieldAlt className="mr-2" />
                            {mutation.isLoading ? "Processing..." : "Confirm & Pay"}
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutPage;