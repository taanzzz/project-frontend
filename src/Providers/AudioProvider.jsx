// 📁 File: src/Providers/AudioProvider.jsx

import React, { createContext, useState, useContext } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

const AudioContext = createContext();

export const useAudioPlayer = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const playTrack = (book) => {
        if (book?.audioUrl) {
            setCurrentlyPlaying({
                src: book.audioUrl,
                title: book.title,
                author: book.author,
                cover: book.coverImage
            });
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
                        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary"></div>

                        <div className="bg-base-100/80 backdrop-blur-xl shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.2)] p-4">
                            <div className="max-w-screen-xl mx-auto flex items-center gap-4">
                                <img src={currentlyPlaying.cover} alt="cover" className="w-16 h-16 rounded-lg shadow-md flex-shrink-0"/>
                                <div className="hidden sm:block flex-shrink-0 mr-4">
                                    <p className="font-extrabold text-base-content truncate">{currentlyPlaying.title}</p>
                                    <p className="text-sm text-base-content/70 truncate">{currentlyPlaying.author}</p>
                                </div>
                                <div className="flex-grow">
                                    <AudioPlayer
                                        src={currentlyPlaying.src}
                                        showJumpControls={false}
                                        autoPlayAfterSrcChange={true}
                                        customAdditionalControls={[]} // Removes extra controls
                                    />
                                </div>
                                 <button onClick={() => setCurrentlyPlaying(null)} className="btn btn-ghost btn-circle">
                                    <IoClose className='text-2xl text-base-content/70'/>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AudioContext.Provider>
    );
};