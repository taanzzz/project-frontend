import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router'; // <-- এইখানে ভুলটি ঠিক করা হয়েছে
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { FaStar, FaHeadphones, FaBookOpen, FaReply } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAudioPlayer } from '../Providers/AudioProvider';
import { FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import { useMediaQuery } from '@react-hook/media-query';

// socket.io-client এর নতুন ভার্সনে io() ব্যবহার করাই যথেষ্ট
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

// --- Reply Input Form ---
const ReplyInput = ({ feedbackId, onReplySuccess, bookId, isDark }) => {
    const [replyText, setReplyText] = useState('');
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const mutation = useMutation({
        mutationFn: (replyData) => axiosSecure.post(`/api/feedbacks/${feedbackId}/reply`, replyData),
        onSuccess: () => {
            toast.success("Reply posted successfully!");
            queryClient.invalidateQueries({ queryKey: ['feedbacks', bookId] });
            setReplyText('');
            onReplySuccess();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to post reply.")
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return toast.error("Reply cannot be empty.");
        mutation.mutate({ replyText });
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className={`mt-4 pt-4 border-t ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}
            initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.5, ease: 'easeOut' }}
        >
            <textarea
                className={`textarea w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md rounded-xl p-4 text-lg placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                placeholder="Write a professional and helpful reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
            />
            <div className="flex justify-end items-center gap-2 mt-2">
                <button
                    type="button"
                    onClick={onReplySuccess}
                    className={`btn btn-sm ${isDark ? 'btn-ghost text-gray-300 hover:bg-white/20' : 'btn-ghost text-gray-600 hover:bg-white/90'} rounded-xl`}
                >
                    Cancel
                </button>
                <motion.button
                    type="submit"
                    className={`btn btn-sm border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                    disabled={mutation.isPending}
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={isMobile ? {} : { scale: 0.95 }}
                >
                    {mutation.isPending ? <span className="loading loading-spinner-xs"></span> : "Submit Reply"}
                </motion.button>
            </div>
        </motion.form>
    );
};

// --- Review Card Component ---
const ReviewCard = ({ feedback, bookId, isDark }) => {
    const { userRole } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <motion.div
            className={`p-5 ${isDark ? 'border-white/20' : 'border-pink-200/50'} border-b last:border-b-0`}
            initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20 }}
            whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.5, ease: 'easeOut' }}
        >
            <div className="flex items-start gap-4">
                <div className="avatar">
                    <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 ${isDark ? 'ring-indigo-400/50 ring-offset-gray-900' : 'ring-pink-400/50 ring-offset-white'}`}>
                        <img src={feedback.authorInfo?.avatar || '/default-avatar.png'} alt={feedback.authorInfo?.name || 'User'} />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <p className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                {feedback.authorInfo?.name || 'Anonymous'}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {feedback.authorInfo?.email || 'No email provided'}
                            </p>
                        </div>
                        <div className="flex items-center text-amber-500 flex-shrink-0 mt-2 sm:mt-0">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={i < feedback.rating ? 'text-amber-500' : isDark ? 'text-gray-700' : 'text-gray-300'}
                                />
                            ))}
                        </div>
                    </div>
                    <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-3 leading-relaxed`}>
                        {feedback.comment}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                        </p>
                        {(userRole === 'Admin' || userRole === 'Contributor') && (
                            <motion.button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className={`btn btn-ghost btn-xs rounded-full ${isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'}`}
                                whileHover={isMobile ? {} : { scale: 1.05 }}
                                whileTap={isMobile ? {} : { scale: 0.95 }}
                            >
                                <FaReply className="mr-1" /> {showReplyForm ? 'Cancel' : 'Reply'}
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            {feedback.replies?.length > 0 && (
                <div className={`ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed ${isDark ? 'border-white/20' : 'border-pink-200/50'} space-y-4`}>
                    {feedback.replies.map(reply => (
                        <motion.div
                            key={reply.replyId}
                            className={`flex items-start gap-3 p-4 ${isDark ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-md rounded-xl`}
                            initial={isMobile ? { opacity: 0, x: -10 } : { opacity: 0, x: -20 }}
                            animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                            transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.5, ease: 'easeOut' }}
                        >
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full">
                                    <img src={reply.authorInfo?.avatar || '/default-avatar.png'} alt={reply.authorInfo?.name || 'User'} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                        {reply.authorInfo?.name || 'Anonymous'}
                                    </p>
                                    <div className={`badge text-xs border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                                        {reply.authorInfo?.role || 'User'}
                                    </div>
                                </div>
                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{reply.replyText}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {showReplyForm && (
                <div className={`ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed ${isDark ? 'border-white/20' : 'border-pink-200/50'}`}>
                    <ReplyInput feedbackId={feedback._id} onReplySuccess={() => setShowReplyForm(false)} bookId={bookId} isDark={isDark} />
                </div>
            )}
        </motion.div>
    );
};

// --- Main BookDetails Component ---
const BookDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { playTrack } = useAudioPlayer();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    const { data: book, isLoading: isBookLoading } = useQuery({
        queryKey: ['book-details', id],
        queryFn: async () => (await axiosSecure.get(`/api/content/${id}`)).data
    });
    const { data: feedbacks = [], isLoading: areFeedbacksLoading } = useQuery({
        queryKey: ['feedbacks', id],
        queryFn: async () => (await axiosSecure.get(`/api/feedbacks/${id}`)).data
    });

    useEffect(() => {
        const handleNewReply = (updatedFeedback) => {
            queryClient.setQueryData(['feedbacks', id], (oldData = []) => {
                return oldData.map(feedback =>
                    feedback._id === updatedFeedback._id ? updatedFeedback : feedback
                );
            });
        };
        socket.on('new_feedback_reply', handleNewReply);
        return () => socket.off('new_feedback_reply', handleNewReply);
    }, [id, queryClient]);

    const feedbackMutation = useMutation({
        mutationFn: (feedbackData) => axiosSecure.post('/api/feedbacks', feedbackData),
        onSuccess: () => {
            toast.success("Thank you for your feedback!");
            queryClient.invalidateQueries({ queryKey: ['feedbacks', id] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to submit feedback.")
    });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const comment = form.comment.value;
        if (!rating) return toast.error("Please provide a rating.");
        if (!comment.trim()) return toast.error("Comment cannot be empty.");
        feedbackMutation.mutate({ contentId: id, rating: Number(rating), comment });
        form.reset();
    };

    if (isBookLoading || areFeedbacksLoading) return <LoadingSpinner />;
    if (!book) return <div className={`text-center py-20 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Book not found.</div>;

    return (
        <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-gray-900 to-indigo-950' : 'bg-gradient-to-b from-pink-50 to-rose-50 bg-white/70 backdrop-blur-md'} min-h-screen`}>
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0">
                {!isMobile && (
                    <>
                        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-indigo-500/30' : 'bg-pink-400/20'} rounded-full blur-3xl animate-pulse`} />
                        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/30' : 'bg-rose-400/20'} rounded-full blur-3xl animate-pulse delay-1000`} />
                    </>
                )}
            </div>

            <motion.div
                className="relative h-[60vh] text-white overflow-hidden"
                initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1 }}
                transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
            >
                <img
                    src={book.coverImage}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl brightness-50 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
                <div className="relative max-w-5xl mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left z-10">
                    <motion.img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-64 h-96 object-cover rounded-lg shadow-2xl flex-shrink-0 -mb-24 md:mb-0"
                        initial={isMobile ? { opacity: 0, scale: 0.95 } : { opacity: 0, scale: 0.9 }}
                        animate={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                        transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.1 } : { duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    />
                    <div>
                        <motion.h1
                            className={`text-5xl font-extrabold tracking-tight bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                            initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.2 } : { duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                        >
                            {book.title}
                        </motion.h1>
                        <motion.p
                            className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2 text-shadow-sm`}
                            initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.3 } : { duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                        >
                            by {book.author}
                        </motion.p>
                        <motion.div
                            className="flex items-center justify-center md:justify-start gap-4 mt-4"
                            initial={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            transition={isMobile ? { duration: 0.3, ease: 'easeOut', delay: 0.4 } : { duration: 0.8, ease: 'easeOut', delay: 0.5 }}
                        >
                            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                <FaStar /> {book.averageRating ? book.averageRating.toFixed(1) : 'New'}
                            </div>
                            <div className={`badge border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                                {book.category}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 mb-12 md:ml-[296px]"
                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 50 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div whileHover={isMobile ? {} : { scale: 1.05 }} whileTap={isMobile ? {} : { scale: 0.95 }}>
                        <Link
                            to={`/read/${book._id}`}
                            className={`btn btn-lg flex-1 border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl transition-all duration-300`}
                        >
                            <FaBookOpen className="mr-2" /> Read Book
                        </Link>
                    </motion.div>
                    <motion.div whileHover={isMobile ? {} : { scale: 1.05 }} whileTap={isMobile ? {} : { scale: 0.95 }}>
                        <button
                            onClick={() => playTrack(book)}
                            className={`btn btn-lg flex-1 border-none text-white ${isDark ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-pink-500/30 hover:from-rose-600 hover:to-pink-600'} rounded-xl transition-all duration-300`}
                            disabled={!book.audioUrl}
                        >
                            <FaHeadphones className="mr-2" /> Listen Audiobook
                        </button>
                    </motion.div>
                </motion.div>

                <motion.p
                    className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed mb-16`}
                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 50 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    {book.description}
                </motion.p>

                <motion.div
                    className="mt-12"
                    initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 50 }}
                    whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                >
                    <h2
                        className={`text-3xl font-bold mb-8 flex items-center gap-3 bg-clip-text text-transparent text-shadow-sm ${isDark ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    >
                        <FiMessageSquare /> Ratings & Reviews
                    </h2>
                    {user && (
                        <motion.div
                            className={`p-6 rounded-3xl shadow-lg mb-10 ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} transition-all duration-300 ${isMobile ? '' : 'hover:scale-[1.01]'}`}
                            initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 50 }}
                            whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                        >
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                                Leave a Review
                            </h3>
                            <form onSubmit={handleFeedbackSubmit}>
                                <div className="rating rating-lg mb-4">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <input
                                            key={star}
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            className={`mask mask-star-2 ${isDark ? 'bg-gradient-to-br from-indigo-400 to-purple-400' : 'bg-gradient-to-br from-pink-400 to-rose-400'}`}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    name="comment"
                                    className={`textarea w-full ${isDark ? 'bg-gray-800/50 text-gray-300 border-white/20' : 'bg-white/80 text-gray-600 border-pink-200/50'} backdrop-blur-md rounded-xl p-4 text-lg placeholder:${isDark ? 'text-gray-400' : 'text-gray-500'} focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-indigo-500' : 'focus:ring-pink-500'} transition-all duration-300`}
                                    placeholder="Share your thoughts..."
                                    required
                                />
                                <motion.button
                                    type="submit"
                                    className={`btn border-none text-white ${isDark ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30 hover:from-pink-600 hover:to-rose-600'} rounded-xl mt-4 transition-all duration-300`}
                                    disabled={feedbackMutation.isPending}
                                    whileHover={isMobile ? {} : { scale: 1.05 }}
                                    whileTap={isMobile ? {} : { scale: 0.95 }}
                                >
                                    {feedbackMutation.isPending ? (
                                        <span className="loading loading-spinner-xs"></span>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                    <motion.div
                        className={`${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30 backdrop-blur-md'} rounded-3xl shadow-lg`}
                        initial={isMobile ? { opacity: 0 } : { opacity: 0 }}
                        whileInView={isMobile ? { opacity: 1 } : { opacity: 1 }}
                        viewport={{ once: true }}
                        transition={isMobile ? { duration: 0.3, ease: 'easeOut' } : { duration: 0.8, ease: 'easeOut' }}
                    >
                        {feedbacks.length > 0 ? (
                            feedbacks.map(fb => (
                                <ReviewCard key={fb._id} feedback={fb} bookId={id} isDark={isDark} />
                            ))
                        ) : (
                            <p className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                No reviews yet. Be the first to leave one!
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookDetails;