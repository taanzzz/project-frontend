// 📁 File: src/pages/Dashboard/Admin/ReviewApplicationModal.jsx

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../api/Axios';
import Swal from 'sweetalert2';

const ReviewApplicationModal = ({ application, isOpen, onClose }) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ userId, action }) => axiosSecure.patch(`/api/applications/${userId}`, { action }),
        onSuccess: (data) => {
            Swal.fire('Success!', data.data.message, 'success');
            queryClient.invalidateQueries({ queryKey: ['pending-applications'] });
            onClose();
        },
        onError: (error) => Swal.fire('Error!', error.response?.data?.message, 'error'),
    });

    const handleAction = (action) => {
        mutation.mutate({ userId: application._id, action });
    };

    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-open backdrop-blur-md">
            <div className="modal-box w-11/12 max-w-2xl">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-2xl">Review Contributor Application</h3>
                
                <div className="py-4 space-y-4">
                    <p><strong>Applicant:</strong> {application.name} ({application.email})</p>
                    <p><strong>Reason to Join:</strong></p>
                    <blockquote className="p-4 bg-base-200 rounded-lg italic">
                        {application.contributorApplication.reason}
                    </blockquote>
                    <p><strong>Sample Work:</strong></p>
                    <a href={application.contributorApplication.sampleWorkUrl} target="_blank" rel="noopener noreferrer" className="link link-primary">
                        View Sample Work
                    </a>
                </div>

                <div className="modal-action">
                    <button onClick={() => handleAction('reject')} className="btn btn-error text-white">Reject</button>
                    <button onClick={() => handleAction('approve')} className="btn btn-success">Approve as Contributor</button>
                </div>
            </div>
        </dialog>
    );
};

export default ReviewApplicationModal;