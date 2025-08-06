// 📁 File: src/pages/NotificationsPage.jsx

import { useEffect } from 'react'
import useNotifications from '../hooks/useNotifications'
import axiosSecure from '../api/Axios'
import { Link } from 'react-router'; // Correct import for modern react-router
import { formatDistanceToNow } from 'date-fns'
import LoadingSpinner from '../components/Shared/LoadingSpinner'

// --- Icons ---
import { FaUserPlus, FaHeart, FaComment } from 'react-icons/fa'
import { FiBell, FiBellOff } from "react-icons/fi";


// ✅ NotificationIcon component with theme-aware colors
const NotificationIcon = ({ type }) => {
    if (type === 'follow') return <FaUserPlus className="text-info" />;
    if (type === 'reaction') return <FaHeart className="text-secondary" />;
    if (type === 'comment') return <FaComment className="text-success" />;
    return <FiBell className="text-base-content/50" />;
};

const NotificationsPage = () => {
    const { notifications, unreadCount, isLoading, refetch } = useNotifications();

    useEffect(() => {
        if (unreadCount > 0) {
            axiosSecure.patch('/api/notifications/read').then(() => {
                refetch();
            });
        }
    }, [unreadCount, refetch]);

    // ✅ Notification link generation logic remains unchanged
    const getNotificationLink = (notif) => {
        if (notif.type === 'follow') {
            return `/profiles/${notif.senderInfo._id}`;
        }
        if (notif.type === 'comment' && notif.commentId) {
            return `/post/${notif.entityId}?highlight=${notif.commentId}`;
        }
        return `/post/${notif.entityId}`;
    };
    
    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="bg-base-200 min-h-[calc(100vh-80px)] py-8 sm:py-12 px-4">
            <div className="max-w-3xl mx-auto bg-base-100 rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-6 flex items-center gap-3">
                    <FiBell />
                    Notifications
                </h1>
                
                <div className="space-y-1">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <Link to={getNotificationLink(notif)} key={notif._id} className="block">
                                <div className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:bg-base-200/50 hover:shadow-inner ${!notif.read ? 'bg-primary/5' : 'bg-transparent'}`}>
                                    
                                    {/* Avatar and Icon Overlay */}
                                    <div className="relative flex-shrink-0">
                                        <div className="avatar">
                                            <div className="w-14 h-14 rounded-full">
                                                <img src={notif.senderInfo.avatar} alt="sender avatar" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-base-100 p-1.5 rounded-full shadow-md border border-base-300/10">
                                            <NotificationIcon type={notif.type} />
                                        </div>
                                    </div>

                                    {/* Message and Timestamp */}
                                    <div className='flex-grow'>
                                        <p className="text-base-content" dangerouslySetInnerHTML={{ __html: notif.message }}></p>
                                        <p className="text-xs text-base-content/60 mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                                    </div>
                                    
                                    {/* Unread Indicator Dot */}
                                    {!notif.read && (
                                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 ml-auto animate-pulse" title="Unread"></div>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Enhanced Empty State
                        <div className="text-center py-16 text-base-content/60">
                             <FiBellOff className="mx-auto text-6xl opacity-50 mb-4" />
                            <h2 className="text-2xl font-bold">You're all caught up!</h2>
                            <p>New notifications will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;