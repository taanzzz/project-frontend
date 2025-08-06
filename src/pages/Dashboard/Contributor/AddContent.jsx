// 📁 File: src/pages/Dashboard/Contributor/AddContent.jsx
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { FaPlus } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from './../../../contexts/AuthProvider';
import axiosSecure from './../../../api/Axios';

const AddContent = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const mutation = useMutation({
        mutationFn: (newContent) => axiosSecure.post('/api/content', newContent),
        onSuccess: () => {
            toast.success('✅ Content submitted for review!');
            reset();
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Submission failed.'),
    });

    const onSubmit = (data) => {
        const contentData = {
            ...data,
            price: parseFloat(data.price),
            contributor: {
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
            },
        };
        mutation.mutate(contentData);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-base-200">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-base-content">Add New Content</h1>
                    <p className="mt-2 text-lg text-base-content/70">Share your knowledge by submitting a new e-book or audiobook for the library.</p>
                </header>
                <div className="bg-base-100 p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <input {...register("title", { required: true })} placeholder="Content Title" className="input input-bordered w-full" />
                        <input {...register("coverImage", { required: true })} type="url" placeholder="Cover Image URL" className="input input-bordered w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select {...register("type")} className="select select-bordered w-full">
                                <option>ebook</option>
                                <option>audiobook</option>
                            </select>
                            <select {...register("category")} className="select select-bordered w-full">
                                <option>Philosophy</option>
                                <option>Psychology</option>
                                <option>Self-Development</option>
                            </select>
                        </div>
                        <textarea {...register("description", { required: true })} className="textarea textarea-bordered w-full h-32" placeholder="Brief description..."></textarea>
                        <button type="submit" className="btn btn-primary w-full text-white" disabled={mutation.isPending}>
                            {mutation.isPending ? <span className="loading loading-spinner"></span> : <><FaPlus className="mr-2" /> Submit for Review</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddContent;