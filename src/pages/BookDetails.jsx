// 📁 File: src/pages/BookDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { FaStar, FaHeadphones, FaBookOpen, FaReply } from "react-icons/fa";
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAudioPlayer } from '../Providers/AudioProvider';
import { FiMessageSquare } from 'react-icons/fi';
import io from 'socket.io-client';

const socket = io.connect(import.meta.env.VITE_API_URL || "http://localhost:5000");

// --- রিপ্লাই ইনপুট ফর্ম ---
const ReplyInput = ({ feedbackId, onReplySuccess, bookId }) => {
    const [replyText, setReplyText] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (replyData) => axiosSecure.post(`/api/feedbacks/${feedbackId}/reply`, replyData),
        onSuccess: () => {
            toast.success("Reply posted successfully!");
            queryClient.invalidateQueries({ queryKey: ['feedbacks', bookId] });
            onReplySuccess();
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to post reply.")
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        mutation.mutate({ replyText });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-base-300/60">
            <textarea
                className="textarea w-full bg-base-200/60 border-2 border-transparent text-base-content placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out rounded-xl"
                placeholder="Write a professional and helpful reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
            ></textarea>
            <div className="flex justify-end items-center gap-2 mt-2">
                <button type="button" onClick={onReplySuccess} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" className="btn btn-sm border-none text-white bg-gradient-to-r from-primary to-secondary" disabled={mutation.isLoading}>
                    {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : "Submit Reply"}
                </button>
            </div>
        </form>
    );
};


// --- রিভিউ কার্ড কম্পোনেন্ট ---
const ReviewCard = ({ feedback, bookId }) => {
    const { userRole } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="p-5 border-b border-base-300 last:border-b-0">
            <div className="flex items-start gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-primary/50 ring-offset-base-100">
                        <img src={feedback.authorInfo.avatar} alt={feedback.authorInfo.name} />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <p className="font-bold text-lg text-base-content">{feedback.authorInfo.name}</p>
                            <p className="text-xs text-base-content/50">{feedback.authorInfo.email}</p>
                        </div>
                        <div className="flex items-center text-amber-500 flex-shrink-0 mt-2 sm:mt-0">
                            {[...Array(5)].map((_, i) => <FaStar key={i} className={i < feedback.rating ? 'text-amber-500' : 'text-base-content/20'} />)}
                        </div>
                    </div>
                    <p className="text-base text-base-content/90 mt-3 leading-relaxed">{feedback.comment}</p>
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-base-content/60">{formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}</p>
                        {(userRole === 'Admin' || userRole === 'Contributor') && (
                             <button onClick={() => setShowReplyForm(!showReplyForm)} className="btn btn-ghost btn-xs rounded-full">
                                 <FaReply className="mr-1" /> {showReplyForm ? 'Cancel' : 'Reply'}
                             </button>
                        )}
                    </div>
                </div>
            </div>

            {feedback.replies && feedback.replies.length > 0 && (
                <div className="ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed border-base-300/70 space-y-4">
                    {feedback.replies.map(reply => (
                         <div key={reply.replyId} className="flex items-start gap-3 p-4 bg-base-200/50 rounded-xl">
                            <div className="avatar">
                                <div className="w-10 h-10 rounded-full"><img src={reply.authorInfo.avatar} alt={reply.authorInfo.name} /></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{reply.authorInfo.name}</p>
                                    <div className="badge text-xs border-none text-white bg-gradient-to-r from-primary to-secondary">{reply.authorInfo.role}</div>
                                </div>
                                <p className="text-sm mt-1">{reply.replyText}</p>
                                <p className="text-xs text-base-content/60 mt-2">{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showReplyForm && (
                <div className="ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed border-base-300/70">
                    <ReplyInput feedbackId={feedback._id} onReplySuccess={() => setShowReplyForm(false)} bookId={bookId} />
                </div>
            )}
        </div>
    );
};


// --- মূল BookDetails কম্পোনেন্ট ---
const BookDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { playTrack } = useAudioPlayer();

    const { data: book, isLoading: isBookLoading } = useQuery({ queryKey: ['book-details', id], queryFn: async () => (await axiosSecure.get(`/api/content/${id}`)).data });
    const { data: feedbacks = [], isLoading: areFeedbacksLoading } = useQuery({ queryKey: ['feedbacks', id], queryFn: async () => (await axiosSecure.get(`/api/feedbacks/${id}`)).data });

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
        feedbackMutation.mutate({ contentId: id, rating, comment });
        form.reset();
    };

    if (isBookLoading || areFeedbacksLoading) return <LoadingSpinner />;
    if (!book) return <div className="text-center py-20">Book not found.</div>;

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="relative h-[60vh] text-white overflow-hidden">
                <img src={book.coverImage} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-xl brightness-50 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/50 to-transparent"></div>
                <div className="relative max-w-5xl mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
                    <img src={book.coverImage} alt={book.title} className="w-64 h-96 object-cover rounded-lg shadow-2xl flex-shrink-0 -mb-24 md:mb-0" />
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white shadow-black/50 text-shadow">{book.title}</h1>
                        <p className="text-2xl text-white/80 mt-2 text-shadow-sm shadow-black/50">by {book.author}</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                            <div className="flex items-center gap-1.5 text-amber-400 font-bold"><FaStar /> {book.averageRating ? book.averageRating.toFixed(1) : 'New'}</div>
                            <div className="badge badge-outline border-white/50 text-white">{book.category}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex flex-col sm:flex-row gap-4 mb-12 md:ml-[296px]">
                    <Link to={`/read/${book._id}`} className="btn btn-lg flex-1 border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105"><FaBookOpen className="mr-2"/> Read Book</Link>
                    <button onClick={() => playTrack(book)} className="btn btn-lg flex-1 btn-outline btn-secondary transform hover:scale-105" disabled={!book.audioUrl}>
                        <FaHeadphones className="mr-2"/> Listen Audiobook
                    </button>
                </div>
                
                <p className="text-base-content/80 text-lg leading-relaxed mb-16">{book.description}</p>
                
                <div className="mt-12">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><FiMessageSquare/> Ratings & Reviews</h2>
                    {user && (
                        <div className="bg-base-100/50 backdrop-blur-md border border-base-300/20 p-6 rounded-2xl shadow-lg mb-10">
                            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                            <form onSubmit={handleFeedbackSubmit}>
                                <div className="rating rating-lg mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <input key={star} type="radio" name="rating" value={star} className="mask mask-star-2 bg-gradient-to-br from-amber-400 to-orange-500" />)}
                                </div>
                                <textarea name="comment" className="textarea textarea-bordered w-full bg-base-200" placeholder="Share your thoughts..." required></textarea>
                                <button type="submit" className="btn border-none text-white bg-gradient-to-r from-primary to-secondary mt-4" disabled={feedbackMutation.isLoading}>
                                    {feedbackMutation.isLoading ? <span className="loading loading-spinner-xs"></span> : "Submit Review"}
                                </button>
                            </form>
                        </div>
                    )}
                    <div className="bg-base-100 rounded-lg shadow-md">
                        {feedbacks.length > 0 ? (
                            feedbacks.map(fb => <ReviewCard key={fb._id} feedback={fb} bookId={id} />)
                        ) : (
                            <p className="p-6 text-center text-gray-500">No reviews yet. Be the first to leave one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;