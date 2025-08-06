// 📁 File: src/pages/MindfulnessZone.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { useNavigate } from 'react-router'; // ✅ useNavigate ইম্পোর্ট করা হয়েছে
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { useAudioPlayer } from '../Providers/AudioProvider';
import { FaPlay, FaWind, FaSpa } from 'react-icons/fa'; // ✅ FaSpa আইকন যোগ করা হয়েছে
import { motion } from 'framer-motion';

// --- কন্টেন্ট কার্ড সাব-কম্পোনেন্ট ---
const ContentCard = ({ item, index }) => {
    const { playTrack } = useAudioPlayer();
    const navigate = useNavigate();
    
    // ✅ সকল ক্যাটাগরির জন্য ডাইনামিক বাটন এবং অ্যাকশন
    const categoryMap = {
        breathing: { text: 'Begin Session', icon: FaWind, action: () => navigate(`/mindfulness/breathing/${item._id}`) },
        sound_bath: { text: 'Start Session', icon: FaSpa, action: () => navigate(`/mindfulness/sound-bath/${item._id}`) },
        body_scan: { text: 'Start Session', icon: FaSpa, action: () => navigate(`/mindfulness/body-scan/${item._id}`) },
        meditation: { text: 'Play Audio', icon: FaPlay, action: () => playTrack(item) },
        soundscape: { text: 'Play Sound', icon: FaPlay, action: () => playTrack(item) }
    };

    const { text, icon: Icon, action } = categoryMap[item.category] || categoryMap.meditation;

    // ... আপনার দেওয়া gradientClass লজিক অপরিবর্তিত ...
    const gradients = ['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-primary'];
    const gradientClass = gradients[index % gradients.length];

    return (
        <motion.div 
            className={`card shadow-xl overflow-hidden group relative text-primary-content bg-gradient-to-br ${gradientClass}`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <figure className="h-48">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30"></div>
            </figure>
            <div className="card-body p-5 z-10">
                <h2 className="card-title text-xl font-bold">{item.title}</h2>
                <p className="text-sm text-primary-content/80">{item.duration}</p>
                <div className="card-actions justify-end mt-2">
                    <button onClick={action} className="btn btn-sm btn-outline text-primary-content border-primary-content/50 hover:bg-primary-content hover:text-primary">
                        <Icon /> {text}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


// --- মূল MindfulnessZone কম্পোনেন্ট ---
const MindfulnessZone = () => {
    const { data: content = [], isLoading } = useQuery({
        queryKey: ['mindfulness-content'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/mindfulness');
            return data;
        }
    });

    if (isLoading) return <LoadingSpinner />;

    // ✅ নতুন ক্যাটাগরিগুলোসহ ডেটা ফিল্টার করা হচ্ছে
    const meditations = content.filter(c => c.category === 'meditation');
    const breathing = content.filter(c => c.category === 'breathing');
    const soundscapes = content.filter(c => c.category === 'soundscape');
    const advanced = content.filter(c => ['sound_bath', 'body_scan'].includes(c.category));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="bg-base-200">
            {/* Hero Section */}
            <div className="hero min-h-[50vh]" style={{ backgroundImage: 'url(https://i.imgur.com/gKj2R4L.jpg)' }}>
                <div className="hero-overlay bg-black/60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Embrace Inner Peace</h1>
                        <p className="mb-5">Discover a sanctuary for your mind. Explore guided meditations, soothing soundscapes, and calming breathing exercises.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-16 space-y-16">
                {/* ✅ সেকশনগুলো এখন ডাইনামিকভাবে তৈরি হচ্ছে */}
                {[
                    { title: 'Guided Meditations', items: meditations, grid: 'xl:grid-cols-4' },
                    { title: 'Advanced Sessions', items: advanced, grid: 'xl:grid-cols-2' },
                    { title: 'Breathing Exercises', items: breathing, grid: 'xl:grid-cols-2' },
                    { title: 'Nature Soundscapes', items: soundscapes, grid: 'xl:grid-cols-4' }
                ].map(section => (
                    section.items.length > 0 && (
                        <section key={section.title}>
                            <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-2">{section.title}</h2>
                            <motion.div 
                                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${section.grid} gap-8`}
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {section.items.map((item, index) => <ContentCard key={item._id} item={item} index={index} />)}
                            </motion.div>
                        </section>
                    )
                ))}
            </div>
        </div>
    );
};

export default MindfulnessZone;