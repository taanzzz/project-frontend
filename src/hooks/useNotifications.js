// 📁 File: src/hooks/useNotifications.js
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axiosSecure from "../api/Axios";

const useNotifications = () => {
    const { user, loading } = useAuth();
    const { data: notifications = [], isLoading, refetch } = useQuery({
        queryKey: ['notifications', user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const { data } = await axiosSecure.get('/api/notifications');
            return data;
        }
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return { notifications, unreadCount, isLoading, refetch };
};
export default useNotifications;