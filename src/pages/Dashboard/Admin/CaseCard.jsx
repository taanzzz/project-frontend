// 📁 File: src/pages/Dashboard/Admin/CaseCard.jsx

import React from 'react';
import { FaFlag, FaUser, FaClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const CaseCard = ({ item, onReview }) => {
    const report = item.reports[0]; // Prothom report'ti dekhano hocche

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <h2 className="card-title">{item.contentType === 'post' ? 'Post Report' : 'Comment Report'}</h2>
                    <div className="badge badge-error">{report.reason}</div>
                </div>
                <p className="text-sm text-base-content/70 mt-2 line-clamp-3">
                    {item.content || item.comment || "Sticker"}
                </p>
                <div className="divider my-2"></div>
                <div className="text-xs space-y-1">
                    <p className="flex items-center gap-2"><FaUser /> <strong>Reported User:</strong> {item.authorInfo.name}</p>
                    <p className="flex items-center gap-2"><FaClock /> <strong>Time:</strong> {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="card-actions justify-end mt-4">
                    <button onClick={() => onReview(item)} className="btn btn-primary btn-sm">Review Case</button>
                </div>
            </div>
        </div>
    );
};

export default CaseCard;