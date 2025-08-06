// 📁 File: src/pages/BreathingExercise.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

const BreathingExercise = () => {
    const { id } = useParams();
    const [status, setStatus] = useState('Get Ready...');
    const [counter, setCounter] = useState(3); // Start countdown from 3

    const { data: exercise, isLoading } = useQuery({
        queryKey: ['breathing-exercise', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/mindfulness/${id}`);
            return data;
        }
    });

    useEffect(() => {
        if (!exercise) return;

        const { inhale, hold, exhale } = exercise.breathingPattern;
        const totalCycleTime = inhale + hold + exhale;
        let timer;
        
        const startCountdown = () => {
            let count = 3;
            setStatus('Get Ready...');
            setCounter(count);
            timer = setInterval(() => {
                count--;
                setCounter(count);
                if (count <= 0) {
                    clearInterval(timer);
                    startBreathingCycle();
                }
            }, 1000);
        };
        
        const startBreathingCycle = () => {
            const cycle = () => {
                setStatus('Inhale');
                setTimeout(() => setStatus('Hold'), inhale * 1000);
                setTimeout(() => setStatus('Exhale'), (inhale + hold) * 1000);
            };
            cycle(); // Start the first cycle immediately
            timer = setInterval(cycle, totalCycleTime * 1000);
        };
        
        startCountdown();

        return () => clearInterval(timer);
    }, [exercise]);

    if (isLoading) return <LoadingSpinner />;
    if (!exercise) return <div className="text-center">Exercise not found.</div>;
    
    const { inhale, hold, exhale } = exercise.breathingPattern;

    return (
        // ✅ The container now uses theme-aware text color `text-primary-content`
        <div className="w-full h-screen bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-primary-content p-4">
            
            <Link to="/mindfulness" className="btn btn-ghost btn-circle absolute top-4 left-4 z-20">
                <IoArrowBack className="text-2xl" />
            </Link>

            <div className="text-center flex flex-col items-center justify-center">
                {/* Animated Circle Visualizer */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-10">
                    <motion.div
                        className="absolute w-full h-full bg-primary-content/10 rounded-full"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute w-1/2 h-1/2 bg-primary-content/20 rounded-full"
                        animate={{
                            scale: status === 'Inhale' ? 1.5 : (status === 'Hold' ? 1.5 : 1),
                        }}
                        transition={{ duration: status === 'Inhale' ? inhale : exhale, ease: "backInOut" }}
                    />
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={status.startsWith('Get Ready') ? counter : status}
                            className="text-6xl font-bold z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {status.startsWith('Get Ready') ? counter : status}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <h1 className="text-3xl font-bold">{exercise.title}</h1>
                <p className="mt-2 text-primary-content/80">Follow the instructions on screen.</p>
                <div className="mt-4 p-2 px-4 border border-primary-content/20 rounded-full">
                    <p className='text-sm font-mono'>Inhale: {inhale}s | Hold: {hold}s | Exhale: {exhale}s</p>
                </div>
            </div>
        </div>
    );
};

export default BreathingExercise;