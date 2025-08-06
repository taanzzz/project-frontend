// 📁 File: src/pages/Store/ProductDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import { FaStar, FaReply, FaShoppingCart } from "react-icons/fa";
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useCart } from '../../Providers/CartProvider';
import { FiMessageSquare } from "react-icons/fi";
import { motion } from 'framer-motion';

// --- Enhanced ReplyInput Component ---
const ReplyInput = ({ reviewId, onReplySuccess, productId }) => {
    const [replyText, setReplyText] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (replyData) => axiosSecure.post(`/api/reviews/${reviewId}/reply`, replyData),
        onSuccess: () => {
            toast.success("Reply posted successfully!");
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
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
                className="textarea w-full bg-base-200/60 border-2 border-transparent rounded-xl focus:bg-base-200 focus:border-primary focus:outline-none focus:ring-0 transition-all"
                placeholder="Write a professional and helpful reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
            />
            <div className="flex justify-end items-center gap-2 mt-2">
                <button type="button" onClick={onReplySuccess} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" className="btn btn-sm border-none text-white bg-gradient-to-r from-primary to-secondary" disabled={mutation.isLoading}>
                    {mutation.isLoading ? <span className="loading loading-spinner-xs"></span> : "Submit Reply"}
                </button>
            </div>
        </form>
    );
};

// --- Enhanced ReviewCard Component ---
const ReviewCard = ({ review, productId }) => {
    const { userRole } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
        <div className="p-5">
            <div className="flex items-start gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-primary/50 ring-offset-base-100">
                        <img src={review.authorInfo.avatar} alt={review.authorInfo.name} />
                    </div>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <p className="font-bold text-lg text-base-content">{review.authorInfo.name}</p>
                        <p className="text-xs text-base-content/60 mt-1 sm:mt-0">{format(new Date(review.createdAt), 'dd MMM yyyy')}</p>
                    </div>
                    <div className="flex items-center text-amber-500 my-2">
                        {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? 'text-amber-500' : 'text-base-content/20'} />)}
                    </div>
                    <p className="text-base text-base-content/90 leading-relaxed">{review.comment}</p>
                    {userRole === 'Admin' && !review.adminReply && (
                        <div className="text-right mt-2">
                            <button onClick={() => setShowReplyForm(!showReplyForm)} className="btn btn-ghost btn-xs rounded-full">
                                <FaReply className="mr-1" /> {showReplyForm ? 'Cancel' : 'Reply'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {review.adminReply && (
                <div className="ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed border-base-300/70">
                    <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl">
                        <div className="avatar">
                            <div className="w-10 h-10 rounded-full"><img src={review.adminReply.authorInfo.avatar} alt="Admin" /></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold">{review.adminReply.authorInfo.name}</p>
                                <div className="badge text-xs border-none text-white bg-gradient-to-r from-primary to-secondary">{review.adminReply.authorInfo.role}</div>
                            </div>
                            <p className="text-sm mt-1">{review.adminReply.replyText}</p>
                        </div>
                    </div>
                </div>
            )}
            {showReplyForm && (
                <div className="ml-8 sm:ml-10 mt-4 pl-6 border-l-2 border-dashed border-base-300/70">
                    <ReplyInput reviewId={review._id} onReplySuccess={() => setShowReplyForm(false)} productId={productId} />
                </div>
            )}
        </div>
    );
};

// --- Main ProductDetailsPage Component ---
const ProductDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const queryClient = useQueryClient();

    const { data: product, isLoading: productLoading } = useQuery({ queryKey: ['product', id], queryFn: async () => (await axiosSecure.get(`/api/products/${id}`)).data });
    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({ queryKey: ['reviews', id], queryFn: async () => (await axiosSecure.get(`/api/reviews/${id}`)).data });

    const reviewMutation = useMutation({
        mutationFn: (reviewData) => axiosSecure.post('/api/reviews', reviewData),
        onSuccess: () => {
            toast.success("Thank you for your review!");
            queryClient.invalidateQueries({ queryKey: ['reviews', id] });
        },
        onError: (error) => toast.error(error.response?.data?.message || "Failed to submit review.")
    });

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const rating = form.rating.value;
        const comment = form.comment.value;
        if (!rating) return toast.error("Please provide a star rating.");
        reviewMutation.mutate({ productId: id, rating, comment });
        form.reset();
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    if (productLoading || reviewsLoading) return <LoadingSpinner />;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="bg-base-200">
            {/* --- Cinematic Hero Section --- */}
            <div className="relative min-h-[80vh] md:min-h-screen text-base-content overflow-hidden flex items-center justify-center">
                <img src={product.imageUrl} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-2xl brightness-75 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-base-200/50 to-transparent"></div>
                <div className="relative max-w-5xl mx-auto px-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain rounded-2xl shadow-2xl max-h-[70vh]" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{product.name}</h1>
                            <p className="text-3xl font-bold text-base-content mt-4">${product.price.toFixed(2)}</p>
                            <p className="mt-6 text-base-content/80 leading-relaxed">{product.description}</p>
                            <div className="divider my-6"></div>
                            <div className="flex items-end gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Quantity</span></label>
                                    <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input input-bordered w-24" />
                                </div>
                                <button onClick={handleAddToCart} className="btn btn-lg flex-1 border-none text-white bg-gradient-to-r from-primary to-secondary transform hover:scale-105">
                                    <FaShoppingCart className="mr-2" /> Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- Customer Reviews Section --- */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3"><FiMessageSquare/> Customer Reviews</h2>
                {user && (
                    <div className="bg-base-100/50 backdrop-blur-md border border-base-300/20 p-6 rounded-2xl shadow-lg mb-10">
                        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <div className="rating rating-lg mb-4">
                                {[1, 2, 3, 4, 5].map(star => <input key={star} type="radio" name="rating" value={star} className="mask mask-star-2 bg-gradient-to-br from-amber-400 to-orange-500" />)}
                            </div>
                            <textarea name="comment" className="textarea textarea-bordered w-full bg-base-200" placeholder="Share your thoughts..." required></textarea>
                            <button type="submit" className="btn border-none text-white bg-gradient-to-r from-primary to-secondary mt-4" disabled={reviewMutation.isLoading}>
                                {reviewMutation.isLoading ? <span className="loading loading-spinner-xs"></span> : "Submit Review"}
                            </button>
                        </form>
                    </div>
                )}
                <div className="bg-base-100 rounded-2xl shadow-lg divide-y divide-base-200/60">
                    {reviews.length > 0 ? (
                        reviews.map(review => <ReviewCard key={review._id} review={review} productId={id} />)
                    ) : (
                        <p className="p-8 text-center text-base-content/60">No reviews yet. Be the first to leave one!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;