import React, { createContext, useState, useContext, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { IoClose, IoPlay, IoPause } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import axiosSecure from '../api/Axios';

const AudioContext = createContext();

export const useAudioPlayer = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';

    // Sync theme with localStorage and data-theme
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

    const playTrack = (book) => {
        if (book?.audioUrl) {
            setCurrentlyPlaying({
                src: book.audioUrl,
                title: book.title,
                author: book.author,
                cover: book.coverImage
            });

            axiosSecure.patch(`/api/content/${book._id}/listen`)
                .catch(err => console.error("Failed to update listen count:", err));
        }
    };

    const value = { playTrack };

    return (
        <AudioContext.Provider value={value}>
            {children}
            
            {/* --- Global Audio Player with Animation --- */}
            <AnimatePresence>
                {currentlyPlaying && (
                    <motion.div
                        className="sticky bottom-0 w-full z-50"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                    >
                        {/* Gradient top border */}
                        <div className={`h-1 w-full ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}></div>

                        <div className={`${isDark ? 'bg-gray-900/80 border-white/20' : 'bg-white/80 border-pink-200/50'} backdrop-blur-xl shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.2)] p-2 sm:p-4 md:p-6`}>
                            <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                                <img src={currentlyPlaying.cover} alt="cover" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg shadow-md flex-shrink-0" />
                                <div className="hidden sm:block flex-shrink-0 mr-2 sm:mr-4">
                                    <p className={`font-extrabold text-sm sm:text-base truncate ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>{currentlyPlaying.title}</p>
                                    <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentlyPlaying.author}</p>
                                </div>
                                <div className="flex-grow w-full">
                                    <AudioPlayer
                                        src={currentlyPlaying.src}
                                        showJumpControls={false}
                                        autoPlayAfterSrcChange={true}
                                        customAdditionalControls={[]}
                                        customIcons={{
                                            play: <IoPlay className={`text-2xl sm:text-3xl md:text-4xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />,
                                            pause: <IoPause className={`text-2xl sm:text-3xl md:text-4xl ${isDark ? 'text-indigo-400' : 'text-pink-500'}`} />,
                                        }}
                                        className="rhap_container"
                                    />
                                </div>
                                <motion.button 
                                    onClick={() => setCurrentlyPlaying(null)} 
                                    className={`btn btn-ghost btn-circle ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'} transition-all duration-300`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <IoClose className='text-xl sm:text-2xl md:text-3xl' />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AudioContext.Provider>
    );
};