// 📁 File: src/pages/Dashboard/Admin/ReviewModal.jsx

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import Swal from 'sweetalert2';

const ReviewModal = ({ item, isOpen, onClose }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ action, contentId, contentType }) => {
            if (action === 'delete') {
                return axiosSecure.post('/api/moderation/delete', { contentId, contentType });
            }
            return axiosSecure.post('/api/moderation/dismiss', { contentId, contentType });
        },
        onSuccess: (data) => {
            Swal.fire('Success!', data.data.message, 'success');
            queryClient.invalidateQueries({ queryKey: ['reported-content'] });
            onClose();
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const handleAction = (action) => {
        mutation.mutate({ action, contentId: item._id, contentType: item.contentType });
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Review Reported Content</h3>
                <div className="py-4 bg-base-200 p-4 rounded-lg my-4">
                    <p className="font-semibold">Content:</p>
                    <p className="italic">"{item.content || item.comment}"</p>
                </div>
                <div className="modal-action">
                    <button onClick={() => handleAction('dismiss')} className="btn">Dismiss Report</button>
                    <button onClick={() => handleAction('delete')} className="btn btn-error">Delete Content</button>
                    <button onClick={onClose} className="btn btn-ghost">Close</button>
                </div>
            </div>
        </dialog>
    );
};

export default ReviewModal;