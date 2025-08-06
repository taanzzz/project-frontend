// 📁 File: src/pages/mindfulness/BodyScanPlayer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const BodyScanPlayer = () => {
    const [currentPart, setCurrentPart] = useState('');

    // This useEffect simulates the guided meditation audio
    useEffect(() => {
        const parts = ['Feet', 'Legs', 'Stomach', 'Chest', 'Arms', 'Head', ''];
        let i = 0;
        const interval = setInterval(() => {
            setCurrentPart(parts[i]);
            i = (i + 1) % parts.length;
        }, 3000); // Change body part every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-screen bg-base-200 flex flex-col items-center justify-center text-base-content relative">
            <Link to="/mindfulness" className="btn btn-ghost btn-circle absolute top-6 left-6 z-20">
                <IoArrowBack className="text-2xl" />
            </Link>

            <h1 className="text-4xl font-bold mb-4">Body Scan Meditation</h1>
            <p className="text-xl text-base-content/70 mb-8">Bring gentle awareness to each part of your body.</p>
            
            <div className="relative h-[60vh] w-48">
                {/* Placeholder for human silhouette */}
                <svg viewBox="0 0 100 200" className="w-full h-full">
                    <circle cx="50" cy="20" r="15" fill="hsl(var(--b3))" />
                    <rect x="40" y="40" width="20" height="60" fill="hsl(var(--b3))" />
                    {/* ... other body parts */}
                </svg>

                {/* Animated scan line */}
                <motion.div 
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{ y: [0, 200, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>
            
            <motion.p 
                key={currentPart}
                className="text-2xl font-semibold mt-8 p-3 px-6 bg-base-100 rounded-full shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {currentPart ? `Focus on your ${currentPart}` : 'Feel your whole body'}
            </motion.p>
        </div>
    );
};

export default BodyScanPlayer;