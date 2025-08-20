// 📁 File: src/pages/Dashboard/Admin/ApplicationCard.jsx

import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ApplicationCard = ({ application, onReview }) => {
    return (
        <motion.div 
            className="card bg-base-100 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="card-body">
                <div className="flex items-center gap-4">
                    <div className="avatar">
                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={application.image} alt={application.name} />
                        </div>
                    </div>
                    <div>
                        <h2 className="card-title">{application.name}</h2>
                        <p className="text-sm text-base-content/70">{application.email}</p>
                    </div>
                </div>
                <p className="text-xs text-base-content/60 mt-2">
                    Applied on: {format(new Date(application.contributorApplication.submittedAt), 'dd MMM, yyyy')}
                </p>
                <div className="card-actions justify-end">
                    <button onClick={() => onReview(application)} className="btn btn-primary btn-sm">Review Application</button>
                </div>
            </div>
        </motion.div>
    );
};

export default ApplicationCard;