// 📁 File: src/pages/MindfulnessZone.jsx

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { useAudioPlayer } from '../Providers/AudioProvider';
import { FaPlay, FaWind, FaSpa } from 'react-icons/fa';
import { motion } from 'framer-motion';

// --- Theme Setup ---
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

  return { theme, isDark };
};

// --- Content Card ---
const ContentCard = ({ item, index, isDark }) => {
  const { playTrack } = useAudioPlayer();
  const navigate = useNavigate();

  const categoryMap = {
    breathing: { text: 'Begin Session', icon: FaWind, action: () => navigate(`/mindfulness/breathing/${item._id}`) },
    sound_bath: { text: 'Start Session', icon: FaSpa, action: () => navigate(`/mindfulness/sound-bath/${item._id}`) },
    body_scan: { text: 'Start Session', icon: FaSpa, action: () => navigate(`/mindfulness/body-scan/${item._id}`) },
    meditation: { text: 'Play Audio', icon: FaPlay, action: () => playTrack(item) },
    soundscape: { text: 'Play Sound', icon: FaPlay, action: () => playTrack(item) }
  };

  const { text, icon: Icon, action } = categoryMap[item.category] || categoryMap.meditation;
  const gradients = ['from-indigo-500 to-purple-500', 'from-pink-500 to-rose-500', 'from-teal-500 to-blue-500'];
  const gradientClass = gradients[index % gradients.length];

  return (
    <motion.div
      className={`card relative overflow-hidden group bg-gradient-to-br ${gradientClass} text-white shadow-xl rounded-2xl`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <figure className="h-48 relative">
        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/30"></div>
      </figure>
      <div className="card-body p-5 z-10">
        <h2 className="card-title text-xl font-bold">{item.title}</h2>
        <p className="text-sm opacity-80">{item.duration}</p>
        <div className="card-actions justify-end mt-2">
          <button
            onClick={action}
            className={`btn btn-sm rounded-full border-none ${isDark ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-white text-pink-600 hover:bg-pink-100'} transition-all`}
          >
            <Icon /> {text}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
const MindfulnessZone = () => {
  const { isDark } = useTheme();
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['mindfulness-content'],
    queryFn: async () => (await axiosSecure.get('/api/mindfulness')).data
  });

  if (isLoading) return <LoadingSpinner />;

  const meditations = content.filter(c => c.category === 'meditation');
  const breathing = content.filter(c => c.category === 'breathing');
  const soundscapes = content.filter(c => c.category === 'soundscape');
  const advanced = content.filter(c => ['sound_bath', 'body_scan'].includes(c.category));

  const sections = [
    { title: 'Guided Meditations', items: meditations, grid: 'xl:grid-cols-4' },
    { title: 'Advanced Sessions', items: advanced, grid: 'xl:grid-cols-2' },
    { title: 'Breathing Exercises', items: breathing, grid: 'xl:grid-cols-2' },
    { title: 'Nature Soundscapes', items: soundscapes, grid: 'xl:grid-cols-4' }
  ];

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50'} ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 left-1/3 w-72 h-72 ${isDark ? 'bg-indigo-400/20' : 'bg-pink-400/15'} rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 ${isDark ? 'bg-purple-400/20' : 'bg-rose-400/15'} rounded-full blur-3xl animate-pulse delay-1000`} />
      </div>

      {/* Hero Section */}
      <div className="hero min-h-[50vh]" style={{ backgroundImage: 'url(https://i.imgur.com/gKj2R4L.jpg)' }}>
        <div className="hero-overlay bg-black/60"></div>
        <div className="hero-content text-center text-neutral-content relative z-10">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">Embrace Inner Peace</h1>
            <p className="mb-5 text-white/80">Discover a sanctuary for your mind. Explore guided meditations, soothing soundscapes, and calming breathing exercises.</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 space-y-16 relative z-10">
        {sections.map((section) =>
          section.items.length > 0 && (
            <section key={section.title}>
              <h2 className={`text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent pb-2`}>
                {section.title}
              </h2>
              <motion.div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${section.grid} gap-8`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {section.items.map((item, index) => (
                  <ContentCard key={item._id} item={item} index={index} isDark={isDark} />
                ))}
              </motion.div>
            </section>
          )
        )}
      </div>
    </div>
  );
};

export default MindfulnessZone;