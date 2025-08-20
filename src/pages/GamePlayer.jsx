// 📁 File: src/pages/GamePlayer.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { IoArrowBack, IoGameController } from 'react-icons/io5';
import { motion } from 'framer-motion';

const GamePlayer = () => {
  const { id } = useParams();

  // Theme sync (matches your global pattern)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };
    window.addEventListener('storage', handleStorageChange);

    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/games/${id}`);
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (!game) {
    return (
      <div className={`text-center py-20 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Game not found.
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-screen ${
        isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50'
      } ${isDark ? 'text-gray-300' : 'text-gray-700'} flex flex-col items-center p-4 sm:p-6 overflow-hidden`}
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-10 left-1/4 w-72 h-72 ${
            isDark ? 'bg-indigo-500/20' : 'bg-pink-400/15'
          } rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-0 right-1/5 w-80 h-80 ${
            isDark ? 'bg-purple-500/20' : 'bg-rose-400/15'
          } rounded-full blur-3xl animate-pulse delay-1000`}
        />
      </div>

      {/* Header */}
      <motion.header
        className={`relative w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border ${
          isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'
        } backdrop-blur-md rounded-2xl px-4 sm:px-6 py-4 shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center sm:text-left">
          <h1
            className={`text-4xl font-extrabold tracking-tight bg-clip-text text-transparent ${
              isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'
            }`}
          >
            {game.title}
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} font-semibold`}>{game.category}</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/gaming-zone"
            className={`btn border-none text-white rounded-xl ${
              isDark
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                : 'bg-gradient-to-r from-pink-500 to-rose-500'
            } shadow-lg`}
          >
            <IoArrowBack className="mr-2" /> Back to Gaming Zone
          </Link>
        </motion.div>
      </motion.header>

      {/* Game iframe with glowing gradient ring */}
      <motion.div
        className={`relative w-full max-w-7xl flex-grow aspect-video rounded-2xl shadow-2xl p-[2px] ${
          isDark ? 'bg-gradient-to-br from-indigo-500/60 to-purple-500/60' : 'bg-gradient-to-br from-pink-500/60 to-rose-500/60'
        } animate-pulse-slow`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full h-full bg-black rounded-xl overflow-hidden">
          <iframe
            src={game.gameUrl}
            title={game.title}
            className="w-full h-full"
            style={{ border: 'none' }}
            allowFullScreen
            scrolling="no"
          />
        </div>
      </motion.div>

      {/* Description */}
      <motion.footer
        className={`relative w-full max-w-7xl mt-8 p-6 rounded-2xl shadow-lg border ${
          isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50'
        } backdrop-blur-md`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h3
          className={`text-2xl font-bold mb-3 flex items-center gap-2 bg-clip-text text-transparent ${
            isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'
          }`}
        >
          <IoGameController /> About The Game
        </h3>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{game.description}</p>
      </motion.footer>
    </div>
  );
};

export default GamePlayer;