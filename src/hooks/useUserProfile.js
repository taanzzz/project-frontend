// 📁 File: src/hooks/useUserProfile.js

import { useQuery } from "@tanstack/react-query";
import useAuth from './useAuth';
import axiosSecure from './../api/Axios';


const useUserProfile = () => {
    const { user, loading } = useAuth();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['user-profile', user?.email],
        enabled: !loading && !!user?.email, // ব্যবহারকারী লোড হওয়ার পর এবং ইমেইল থাকলেই শুধু API কল হবে
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/api/users/profile/${user.email}`);
            return data;
        }
    });

    return { data, isLoading, refetch };
};

export default useUserProfile;