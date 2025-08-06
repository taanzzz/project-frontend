// 📁 File: src/Providers/CartProvider.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // পেইজ রিলোড হলেও যেন কার্টের ডেটা থেকে যায়, তার জন্য localStorage থেকে লোড করা হচ্ছে
        try {
            const localData = localStorage.getItem('mindovermyth_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    // কার্টের ডেটা পরিবর্তন হলে localStorage-এ সেভ করা হচ্ছে
    useEffect(() => {
        localStorage.setItem('mindovermyth_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // কার্টে নতুন প্রোডাক্ট যোগ করার ফাংশন
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                // যদি প্রোডাক্টটি আগে থেকেই থাকে, তবে শুধু পরিমাণ বাড়ানো হচ্ছে
                toast.info(`${product.name} quantity updated in cart!`);
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                // যদি না থাকে, তবে নতুন করে যোগ করা হচ্ছে
                toast.success(`${product.name} added to cart!`);
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // কার্ট থেকে প্রোডাক্ট মুছে ফেলার ফাংশন
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        toast.error("Item removed from cart.");
    };

    // কার্ট খালি করার ফাংশন
    const clearCart = () => {
        setCartItems([]);
        toast.warn("Cart has been cleared.");
    };

    // মোট মূল্য এবং আইটেম সংখ্যা গণনা করা
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};