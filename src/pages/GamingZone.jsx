// 📁 File: src/pages/GamingZone.jsx

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { Link } from 'react-router';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { motion } from 'framer-motion';
import { FaPlay } from "react-icons/fa";

const GamingZone = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const { data: games = [], isLoading } = useQuery({
        queryKey: ['games'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/games');
            return data;
        }
    });

    const categories = useMemo(() => ['All', ...new Set(games.map(g => g.category))], [games]);
    const filteredGames = useMemo(() => 
        selectedCategory === 'All' ? games : games.filter(g => g.category === selectedCategory),
        [games, selectedCategory]
    );

    const featuredGame = useMemo(() => games.length > 0 ? games[0] : null, [games]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-base-100 text-base-content min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 py-12">
                
                {/* --- Enhanced Featured Game Section --- */}
                {featuredGame && (
                    <div className="hero min-h-[60vh] rounded-3xl shadow-2xl mb-16" style={{ backgroundImage: `url(${featuredGame.thumbnailUrl})`}}>
                        <div className="hero-overlay bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-3xl"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-lg">
                                <h1 className="mb-5 text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">
                                    {featuredGame.title}
                                </h1>
                                <p className="mb-5 text-base-content/80 text-white/80">{featuredGame.description}</p>
                                <Link 
                                    to={`/gaming-zone/${featuredGame._id}`} 
                                    className="btn btn-lg border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-secondary/50"
                                >
                                    <FaPlay className='mr-2' /> Play Now
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* --- Enhanced Category Filters --- */}
                <div className="mb-12 flex justify-center items-center flex-wrap gap-2 bg-base-100/10 backdrop-blur-md rounded-full p-2 max-w-lg mx-auto">
                    {categories.map(category => (
                        <button 
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`btn btn-sm rounded-full transition-all duration-300 ${selectedCategory === category ? 'border-none text-white bg-gradient-to-r from-primary to-secondary' : 'btn-ghost'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* --- Enhanced Games Grid --- */}
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    {filteredGames.map(game => (
                        <motion.div
                            key={game._id}
                            variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        >
                            <Link to={`/gaming-zone/${game._id}`} className="card bg-base-200 shadow-xl transition-all duration-300 group overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-primary/20">
                                <figure className="h-48 relative">
                                    <img src={game.thumbnailUrl} alt={game.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FaPlay className="text-white text-4xl" />
                                    </div>
                                </figure>
                                <div className="card-body p-5">
                                    <h2 className="card-title text-base-content">{game.title}</h2>
                                    <div className="badge badge-outline badge-secondary">{game.category}</div>
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