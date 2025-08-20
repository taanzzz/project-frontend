// 📁 File: src/pages/mindfulness/BodyScanPlayer.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { IoArrowBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

// Theme sync
const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateTheme = () => setTheme(localStorage.getItem('theme') || 'light');
    window.addEventListener('storage', updateTheme);
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('storage', updateTheme);
      observer.disconnect();
    };
  }, []);

  return { isDark };
};

const BodyScanPlayer = () => {
  const { isDark } = useTheme();
  const [currentPart, setCurrentPart] = useState('');

  useEffect(() => {
    const parts = ['Feet', 'Legs', 'Stomach', 'Chest', 'Arms', 'Head', ''];
    let i = 0;
    const interval = setInterval(() => {
      setCurrentPart(parts[i]);
      i = (i + 1) % parts.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full h-screen flex flex-col items-center justify-center ${
        isDark
          ? 'bg-gradient-to-b from-gray-900 to-indigo-950 text-gray-300'
          : 'bg-gradient-to-b from-pink-50 to-rose-50 text-gray-700'
      } transition-all duration-300 overflow-hidden`}
    >
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/3 w-72 h-72 ${isDark ? 'bg-indigo-400/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 ${isDark ? 'bg-purple-400/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
      </div>

      <Link to="/mindfulness-zone" className="btn btn-ghost btn-circle absolute top-6 left-6 z-10">
        <IoArrowBack className="text-2xl" />
      </Link>

      <motion.h1
        className={`text-4xl font-bold mb-4 z-10 bg-clip-text text-transparent ${
          isDark
            ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
            : 'bg-gradient-to-r from-pink-500 to-rose-500'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Body Scan Meditation
      </motion.h1>

      <motion.p
        className="text-xl mb-8 text-center max-w-md px-4 text-white/70 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Bring gentle awareness to each part of your body.
      </motion.p>

      {/* Silhouette + scan */}
      <div className="relative h-[60vh] w-48 z-10">
        <svg viewBox="0 0 100 200" className="w-full h-full">
          <circle cx="50" cy="20" r="15" fill={isDark ? '#7f9cf5' : '#f3accf'} />
          <rect x="40" y="40" width="20" height="60" fill={isDark ? '#7f9cf5' : '#f3accf'} />
          {/* Future enhancements: detailed limbs */}
        </svg>

        <motion.div
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
          animate={{ y: [0, 200, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.p
        key={currentPart}
        className={`text-2xl font-semibold mt-8 px-6 py-3 rounded-full shadow-xl backdrop-blur-md ${
          isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-pink-600'
        } transition-all duration-300 z-10`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {currentPart ? `Focus on your ${currentPart}` : 'Feel your whole body'}
      </motion.p>
    </div>
  );
};

export default BodyScanPlayer;