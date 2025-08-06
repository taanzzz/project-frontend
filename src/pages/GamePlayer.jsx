// 📁 File: src/pages/GamePlayer.jsx

import React from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { IoArrowBack, IoGameController } from 'react-icons/io5';

const GamePlayer = () => {
    const { id } = useParams();
    const { data: game, isLoading } = useQuery({
        queryKey: ['game', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/games/${id}`);
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;
    if (!game) return <div className="text-center py-20 text-base-content">Game not found.</div>;

    return (
        <div className="w-full min-h-screen bg-base-100 text-base-content flex flex-col items-center p-4 sm:p-6">
            {/* --- Enhanced Header Section --- */}
            <header className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{game.title}</h1>
                    <p className="text-base-content/70 font-semibold">{game.category}</p>
                </div>
                <Link 
                    to="/gaming-zone" 
                    className="btn border-none text-white bg-gradient-to-r from-primary to-secondary transition-transform transform hover:scale-105"
                >
                    <IoArrowBack className="mr-2"/> Back to Gaming Zone
                </Link>
            </header>

            {/* --- Enhanced Game Iframe with Glowing Border --- */}
            <div className="w-full max-w-7xl flex-grow aspect-video bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-2xl p-1 animate-pulse-slow">
                <div className="w-full h-full bg-black rounded-xl overflow-hidden">
                    <iframe
                        src={game.gameUrl}
                        title={game.title}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allowFullScreen
                        scrolling="no"
                    ></iframe>
                </div>
            </div>

            {/* --- Enhanced Description Section --- */}
            <footer className="w-full max-w-7xl mt-8 bg-base-200/50 p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2"><IoGameController /> About The Game</h3>
                <p className="text-base-content/80 leading-relaxed">{game.description}</p>
            </footer>
        </div>
    );
};

export default GamePlayer;