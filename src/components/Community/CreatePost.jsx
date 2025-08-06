// src/components/Community/CreatePost.jsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosSecure from './../../api/Axios';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // src/components/Community/CreatePost.jsx

const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 10) {
        return toast.error("Post must be at least 10 characters long.");
    }
    setIsSubmitting(true);
    try {
        const response = await axiosSecure.post('/api/posts', { content });
        
        if (response.status === 201) {
            toast.success("Post submitted successfully for review!");
            setContent('');
        }
    } catch (error) {
        // ✅ এখানে পরিবর্তন করা হয়েছে
        console.error("Post creation error:", error.response); // ডিবাগিং এর জন্য
        // ব্যাকএন্ড থেকে পাঠানো নির্দিষ্ট মেসেজটি দেখানো হচ্ছে
        const errorMessage = error.response?.data?.message || "Failed to create post.";
        toast.error(errorMessage);
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="bg-base-100/80 backdrop-blur-sm border border-base-300/20 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto mb-12">
            <h3 className="font-extrabold text-2xl md:text-3xl mb-6 pb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Share Your Knowledge
            </h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-4 rounded-xl bg-base-200/60 border-2 border-transparent text-base-content placeholder:text-base-content/50 focus:bg-base-200 focus:border-primary focus:outline-none focus:ring-0 transition-all duration-300 ease-in-out"
                    placeholder="What's on your mind? Share something educational, inspiring, or positive with the community..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    disabled={isSubmitting}
                ></textarea>
                <div className="mt-5 flex justify-end">
                    <button 
                        type="submit" 
                        className="btn border-none text-white font-bold bg-gradient-to-r from-primary to-secondary w-full sm:w-auto transform hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl shadow-secondary/20 hover:shadow-secondary/40 disabled:bg-gradient-to-r disabled:from-base-300 disabled:to-base-300/80 disabled:shadow-none disabled:transform-none" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <span className="loading loading-spinner"></span> : 'Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;