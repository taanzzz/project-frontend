// 📁 File: src/pages/Home/Newsletter.jsx

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';

const Newsletter = () => {
    const form = useRef();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const sendEmail = (data) => {
        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICE_ID, 
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
            form.current, 
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then((result) => {
            toast.success("Thank you for subscribing!");
            reset();
        }, (error) => {
            toast.error("Failed to subscribe. Please try again.");
            console.log(error.text);
        });
    };

    return (
        <div className="bg-base-100 py-20">
            <div className="max-w-screen-md mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <h2 className="text-4xl font-extrabold mb-4">Join the Inner Circle</h2>
                    <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
                        Get weekly insights, book recommendations, and exclusive community highlights delivered directly to your inbox. No spam, ever.
                    </p>
                </motion.div>

                <motion.form
                    ref={form}
                    onSubmit={handleSubmit(sendEmail)}
                    className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.2 }}
                >
                    <input
                        type="email"
                        placeholder="your-email@address.com"
                        className={`input input-bordered w-full input-lg ${errors.user_email ? 'input-error' : ''}`}
                        {...register("user_email", { required: "Email is required" })}
                    />
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner"></span> : <FaPaperPlane />}
                         Subscribe
                    </button>
                </motion.form>
                {errors.user_email && <p className="text-error text-sm mt-2">{errors.user_email.message}</p>}
            </div>
        </div>
    );
};

export default Newsletter;