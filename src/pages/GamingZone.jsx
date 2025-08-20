// 📁 File: src/pages/GamingZone.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { Link } from 'react-router';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { motion } from 'framer-motion';
import { FaPlay } from "react-icons/fa";

const GamingZone = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';
  const [ambientOn, setAmbientOn] = useState(false);

  // Sync theme with localStorage and data-theme (same pattern as your error-fixed component)
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

  // Optional ambient sound toggle for immersion (calming layer)
  useEffect(() => {
    const audio = new Audio('/ambient-sound.mp3');
    audio.loop = true;
    if (ambientOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
    };
  }, [ambientOn]);

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: async () => (await axiosSecure.get('/api/games')).data
  });

  const categories = useMemo(() => ['All', ...new Set(games.map(g => g.category))], [games]);

  const filteredGames = useMemo(
    () => (selectedCategory === 'All' ? games : games.filter(g => g.category === selectedCategory)),
    [games, selectedCategory]
  );

  const featuredGame = useMemo(() => (games.length > 0 ? games[0] : null), [games]);

  // Mood-based gradient for a calmer, time-aware feel
  const getMoodGradient = () => {
    const hour = new Date().getHours();
    if (hour < 6 || hour > 18) {
      return isDark ? 'from-gray-900 to-indigo-950' : 'from-blue-100 to-purple-100';
    }
    return isDark ? 'from-indigo-800 to-purple-900' : 'from-pink-50 to-rose-50';
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-b ${getMoodGradient()} ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-all duration-300`}>
      {/* Ambient floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-indigo-400/30' : 'bg-pink-400/30'}`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.4, y: [0, -20, 0] }}
            transition={{ duration: 4 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12 relative z-10">
        {/* Top controls */}
        <div className="flex items-center justify-between mb-6 gap-3">
          {/* Ambient toggle */}
          <button
            onClick={() => setAmbientOn(!ambientOn)}
            className={`btn btn-sm rounded-full ${isDark ? 'btn-ghost text-gray-300 hover:bg-white/10' : 'btn-ghost text-gray-600 hover:bg-white/90'}`}
            aria-pressed={ambientOn}
          >
            {ambientOn ? '🔊 Ambient On' : '🔇 Ambient Off'}
          </button>

          {/* Total games counter (subtle info) */}
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
          </div>
        </div>

        {/* Featured Game */}
        {featuredGame && (
          <motion.div
            className="relative min-h-[60vh] rounded-3xl overflow-hidden shadow-2xl mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <img
              src={featuredGame.thumbnailUrl}
              alt={featuredGame.title}
              className="absolute inset-0 w-full h-full object-cover brightness-50 scale-110 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-3xl" />
            <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
              <div className="max-w-lg">
                <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'} pb-2`}>
                  {featuredGame.title}
                </h1>
                <p className="mb-5 text-lg leading-relaxed text-white/80">
                  {featuredGame.description}
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/gaming-zone/${featuredGame._id}`}
                    className={`btn btn-lg border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'} rounded-xl shadow-lg transition-transform duration-300`}
                  >
                    <FaPlay className="mr-2" /> Play Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filters */}
        <div className={`mb-12 flex justify-center items-center flex-wrap gap-2 p-3 rounded-full max-w-lg mx-auto ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md`}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn btn-sm rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? `text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`
                  : `${isDark ? 'btn-ghost text-gray-300 hover:bg-white/10' : 'btn-ghost text-gray-600 hover:bg-white/90'}`
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filteredGames.map(game => (
            <motion.div
              key={game._id}
              variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to={`/gaming-zone/${game._id}`}
                className={`card overflow-hidden rounded-2xl transition-all duration-300 group border-2 ${
                  isDark
                    ? 'bg-white/10 border-white/20 hover:border-indigo-400 hover:shadow-indigo-400/30'
                    : 'bg-white/80 border-pink-200/50 hover:border-pink-400 hover:shadow-pink-400/30'
                } backdrop-blur-md shadow-lg`}
              >
                <figure className="h-48 relative">
                  <img
                    src={game.thumbnailUrl}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ rotate: 2 }}
                  >
                    <FaPlay className="text-white text-4xl" />
                  </motion.div>
                </figure>
                <div className="card-body p-5">
                  <h2 className={`card-title ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{game.title}</h2>
                  <div className={`badge text-xs border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                    {game.category}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GamingZone;