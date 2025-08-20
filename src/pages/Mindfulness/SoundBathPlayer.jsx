// 📁 File: src/pages/mindfulness/SoundBathPlayer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

// --- Theme Hook ---
const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateTheme = () => setTheme(localStorage.getItem('theme') || 'light');
    window.addEventListener('storage', updateTheme);
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('storage', updateTheme);
      observer.disconnect();
    };
  }, []);

  return { isDark };
};

const SoundBathPlayer = () => {
  const { isDark } = useTheme();

  const soundBath = {
    title: "432Hz Deep Resonance",
    description:
      "A sound bath designed to align your mind and body, promoting deep relaxation and clarity."
  };

  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950 text-gray-300' : 'bg-gradient-to-b from-pink-50 to-rose-50 text-gray-700'
      }`}
    >
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/3 w-72 h-72 ${isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 ${isDark ? 'bg-purple-400/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
      </div>

      {/* Animated Fullscreen Gradient Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(135deg, #A78BFA 0%, #C084FC 100%)',
            'linear-gradient(135deg, #C084FC 0%, #F472B6 100%)',
            'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut'
        }}
      />

      {/* Back Button */}
      <Link
        to="/mindfulness"
        className={`btn btn-ghost btn-circle absolute top-6 left-6 z-10 ${
          isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-600 hover:bg-white/90'
        }`}
      >
        <IoArrowBack className="text-2xl" />
      </Link>

      {/* Player Content */}
      <div className="relative z-10 text-center flex flex-col items-center px-4">
        {/* Audio Visualizer */}
        <motion.div
          className={`w-72 h-72 rounded-full border-4 ${isDark ? 'border-white/30' : 'border-pink-300/30'} flex items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className={`w-48 h-48 rounded-full ${
              isDark ? 'bg-white/10' : 'bg-pink-200/20'
            }`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut'
            }}
          />
        </motion.div>

        <motion.h1
          className={`text-4xl font-extrabold mt-10 bg-clip-text text-transparent ${
            isDark
              ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
              : 'bg-gradient-to-r from-pink-500 to-rose-500'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {soundBath.title}
        </motion.h1>

        <motion.p
          className={`mt-2 max-w-md text-lg leading-relaxed ${
            isDark ? 'text-white/80' : 'text-gray-600'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {soundBath.description}
        </motion.p>

        {/* 🔊 Optional: Insert AudioPlayer here */}
      </div>
    </div>
  );
};

export default SoundBathPlayer;