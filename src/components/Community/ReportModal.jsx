// 📁 File: src/components/Community/ReportModal.jsx

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useMutation } from '@tanstack/react-query';
import axiosSecure from '../../api/Axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFlag, FiAlertTriangle } from 'react-icons/fi';

const reportReasons = [
  "Hate Speech",
  "Spam or Misleading",
  "Harassment",
  "Nudity or Sexual Content",
  "I just don't like it"
];

const ReportModal = ({ isOpen, onClose, contentId, contentType }) => {
  const [reason, setReason] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  // Sync theme with localStorage and data-theme attribute
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem('theme') || 'light');
    };

    window.addEventListener('storage', handleStorageChange);
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (reportData) => {
      if (contentType === 'post') {
        return axiosSecure.post(`/api/posts/${contentId}/report`, reportData);
      }
      return axiosSecure.post(`/api/comments/${contentId}/report`, reportData);
    },
    onSuccess: (data) => {
      toast.success(data.data.message || "Report submitted successfully.");
      setReason('');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit report.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return toast.error("Please select a reason.");
    mutation.mutate({ reason });
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="modal modal-open backdrop-blur-sm fixed inset-0 z-[9999] flex justify-center items-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        />

        {/* Modal Content */}
        <motion.div
          className={`modal-box border shadow-2xl rounded-3xl max-w-md relative z-[10000] m-auto p-6 ${
            isDark
              ? 'bg-gray-800/95 border-white/20 backdrop-blur-md'
              : 'bg-white/95 border-pink-200/50 backdrop-blur-md shadow-pink-200/30'
          }`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`p-3 rounded-full ${
                isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'
              }`}
            >
              <FiFlag className="text-xl" />
            </div>
            <div>
              <h3 className={`font-bold text-xl ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>
                Report Content
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Help us keep the community safe
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <motion.div
            className={`p-4 rounded-xl mb-6 border-l-4 ${
              isDark
                ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                : 'bg-amber-50 border-amber-400 text-amber-700'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Why are you reporting this?</p>
                <p className="text-xs mt-1 opacity-90">
                  Your feedback helps us maintain community standards and improve everyone's experience.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-8">
              {reportReasons.map((r, index) => (
                <motion.div
                  key={r}
                  className={`form-control transition-all duration-300 hover:scale-[1.01] ${
                    reason === r ? (isDark ? 'bg-white/10' : 'bg-pink-50/80') : ''
                  } rounded-xl p-2`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <label className="label cursor-pointer px-3 py-2 flex justify-between items-center">
                    <span
                      className={`label-text font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      {r}
                    </span>
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className={`radio border-2 ${
                        isDark
                          ? 'border-indigo-400 checked:bg-indigo-500 checked:border-indigo-500'
                          : 'border-pink-400 checked:bg-pink-500 checked:border-pink-500'
                      }`}
                    />
                  </label>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3">
              <motion.button
                type="button"
                className={`btn btn-ghost rounded-xl ${
                  isDark ? 'text-gray-300 hover:bg-white/20' : 'text-gray-600 hover:bg-white/90'
                }`}
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className="btn border-none text-white font-bold rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30 transition-all duration-300"
                disabled={mutation.isLoading || !reason}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mutation.isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiFlag className="mr-2" />
                    Submit Report
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ReportModal;
