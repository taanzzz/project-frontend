// 📁 File: src/pages/DonatePage.jsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../api/Axios';
import { toast } from 'react-toastify';
import { FaCoffee, FaHeart } from 'react-icons/fa';

const DonatePage = () => {
    const [amount, setAmount] = useState(100); // Default BDT 100

    const mutation = useMutation({
        mutationFn: (donationData) => axiosSecure.post('/api/payment/donate', donationData),
        onSuccess: (data) => {
            window.location.replace(data.data.url);
        },
        onError: () => toast.error("Could not initiate donation. Please try again.")
    });

    const handleDonate = () => {
        mutation.mutate({ amount });
    };

    return (
        <div className="max-w-2xl mx-auto text-center py-20 px-4">
            <FaHeart className="text-5xl text-secondary mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Support Our Journey</h1>
            <p className="mt-4 text-lg text-base-content/80">Your small contribution helps us keep the platform running and ad-free. Thank you for being a part of our mission.</p>
            
            <div className="my-8 space-y-4">
                <p className="font-semibold">Choose a donation amount (BDT):</p>
                <div className="join">
                    <button onClick={() => setAmount(100)} className={`btn join-item ${amount === 100 ? 'btn-primary' : ''}`}>100 ৳</button>
                    <button onClick={() => setAmount(300)} className={`btn join-item ${amount === 300 ? 'btn-primary' : ''}`}>300 ৳</button>
                    <button onClick={() => setAmount(500)} className={`btn join-item ${amount === 500 ? 'btn-primary' : ''}`}>500 ৳</button>
                </div>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input input-bordered w-full max-w-xs" 
                />
            </div>

            <button onClick={handleDonate} className="btn btn-primary btn-lg" disabled={mutation.isLoading}>
                <FaCoffee /> {mutation.isLoading ? "Processing..." : `Donate ${amount} BDT`}
            </button>
        </div>
    );
};
export default DonatePage;