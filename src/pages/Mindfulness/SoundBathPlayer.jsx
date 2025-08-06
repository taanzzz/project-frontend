// 📁 File: src/pages/mindfulness/SoundBathPlayer.jsx

import React from 'react';
import { Link } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const SoundBathPlayer = () => {
    // This is a placeholder UI. You would integrate your AudioProvider here.
    const soundBath = {
        title: "432Hz Deep Resonance",
        description: "A sound bath designed to align your mind and body, promoting deep relaxation and clarity.",
    };

    return (
        <div className="w-full h-screen bg-base-100 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Gradient Background */}
            <motion.div 
                className="absolute inset-0"
                animate={{ 
                    background: [
                        "linear-gradient(135deg, hsl(var(--p)) 0%, hsl(var(--s)) 100%)",
                        "linear-gradient(135deg, hsl(var(--s)) 0%, hsl(var(--a)) 100%)",
                        "linear-gradient(135deg, hsl(var(--a)) 0%, hsl(var(--p)) 100%)",
                    ]
                }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            />
            
            <Link to="/mindfulness" className="btn btn-ghost btn-circle absolute top-6 left-6 z-20 text-primary-content/80 hover:bg-white/10">
                <IoArrowBack className="text-2xl" />
            </Link>

            <div className="relative z-10 text-center text-primary-content flex flex-col items-center">
                {/* Audio Visualizer Placeholder */}
                <motion.div 
                    className="w-72 h-72 rounded-full border-4 border-primary-content/20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div 
                        className="w-48 h-48 bg-primary-content/10 rounded-full"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    />
                </motion.div>
                
                <h1 className="text-4xl font-extrabold mt-10">{soundBath.title}</h1>
                <p className="mt-2 text-primary-content/80 max-w-md">{soundBath.description}</p>
                {/* You can place your AudioPlayer component here */}
            </div>
        </div>
    );
};

export default SoundBathPlayer;