// 📁 File: src/pages/Dashboard/Common/EditProfileModal.jsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { updateProfile } from 'firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './../../../contexts/AuthProvider';
import axiosSecure from './../../../api/Axios';

const EditProfileModal = ({ isOpen, onClose, profileData }) => {
    const { user } = React.useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (profileData) {
            reset({ name: profileData.name, image: profileData.image });
        }
    }, [profileData, reset]);

    const mutation = useMutation({
        mutationFn: async (updatedData) => {
            await updateProfile(user, { displayName: updatedData.name, photoURL: updatedData.image });
            return axiosSecure.patch(`/api/users/profile/${user.email}`, updatedData);
        },
        onSuccess: () => {
            toast.success('✅ Profile updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['profile', user?.email] });
            onClose();
        },
        onError: () => toast.error('❌ Failed to update profile.'),
    });

    const onSubmit = (data) => {
        mutation.mutate({ name: data.name, image: data.image });
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg text-primary">Edit Your Profile</h3>
                <p className="py-2 text-sm text-base-content/70">Update your name and profile picture below.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Full Name</span></label>
                        <input type="text" className="input input-bordered w-full" {...register("name", { required: "Name is required" })} />
                        {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Photo URL</span></label>
                        <input type="url" className="input input-bordered w-full" {...register("image", { required: "Photo URL is required" })} />
                        {errors.image && <span className="text-error text-xs mt-1">{errors.image.message}</span>}
                    </div>
                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary text-white" disabled={mutation.isPending}>
                            {mutation.isPending ? <span className="loading loading-spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default EditProfileModal;