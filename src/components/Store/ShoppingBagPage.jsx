// 📁 File: src/pages/Store/ShoppingBagPage.jsx

import React from 'react';
import { Link } from 'react-router';
import { useCart } from '../../Providers/CartProvider';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { FaTrash, FaShoppingBag, FaPlus, FaMinus, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- Cart Item Row Sub-component ---
const CartItemRow = ({ item, removeFromCart }) => {
    // Placeholder for quantity update logic
    const handleUpdateQuantity = (newQuantity) => {
        console.log(`Updating ${item._id} to quantity ${newQuantity}`);
        // You would need to implement updateCartItemQuantity(item._id, newQuantity) in your CartProvider
    };

    return (
        <motion.tr
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="border-b border-base-200"
        >
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="font-semibold text-base-content">{item.name}</span>
                </div>
            </td>
            <td className="p-4 text-center text-base-content/80">${item.price.toFixed(2)}</td>
            <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleUpdateQuantity(item.quantity - 1)} className="btn btn-ghost btn-xs btn-circle" disabled={item.quantity <= 1}><FaMinus /></button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.quantity + 1)} className="btn btn-ghost btn-xs btn-circle"><FaPlus /></button>
                </div>
            </td>
            <td className="p-4 text-center font-semibold text-base-content">${(item.price * item.quantity).toFixed(2)}</td>
            <td className="p-4 text-center">
                <button onClick={() => removeFromCart(item._id)} className="text-error hover:text-error/70 transition-colors">
                    <FaTrash />
                </button>
            </td>
        </motion.tr>
    );
};


const ShoppingBagPage = () => {
    const { cartItems, removeFromCart, cartTotal } = useCart();

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
            <div className="bg-base-200 min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <motion.div
                    className="text-center p-12 bg-base-100 rounded-2xl shadow-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-content mb-6">
                        <FaShoppingBag className="text-5xl" />
                    </div>
                    <h2 className="text-3xl font-bold">Your Shopping Bag is Empty</h2>
                    <p className="text-base-content/70 mt-2">Add items to your bag to see them here.</p>
                    <Link to="/store" className="btn btn-primary mt-8 transform hover:scale-105 transition-transform">
                        Continue Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-extrabold text-center mb-10">Shopping Cart & Checkout</h1>
                
                <div className="bg-base-100 p-6 sm:p-8 rounded-2xl shadow-xl space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="border-b border-base-300">
                                        <th className="p-4 text-left">Product</th>
                                        <th className="p-4 text-center">Price</th>
                                        <th className="p-4 text-center">Quantity</th>
                                        <th className="p-4 text-center">Subtotal</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {cartItems.map(item => <CartItemRow key={item._id} item={item} removeFromCart={removeFromCart} />)}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <form onSubmit={handleConfirmOrder}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                                <div className="space-y-4">
                                    <input type="email" placeholder="Email" className="input input-bordered w-full" required />
                                    <input type="tel" placeholder="Phone Number" className="input input-bordered w-full" required />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Full Name" className="input input-bordered w-full" required />
                                    <input type="text" placeholder="Address" className="input input-bordered w-full" required />
                                </div>
                            </div>
                        </div>

                        <div className="divider mt-10 mb-6"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="payment_method" className="radio radio-primary" checked readOnly />
                                        <span className="font-semibold">Mobile Banking / SSLCOMMERZ</span>
                                    </label>
                                    <p className="text-xs text-base-content/70 mt-2 ml-9">You will be redirected to a secure payment gateway to complete your purchase.</p>
                                </div>
                            </div>
                            <div className="bg-base-200 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
                                    <div className="divider my-1"></div>
                                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${cartTotal.toFixed(2)}</span></div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full mt-6" disabled={mutation.isLoading}>
                                    <FaLock className="mr-2" />
                                    {mutation.isLoading ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShoppingBagPage;