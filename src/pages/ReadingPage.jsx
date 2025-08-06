import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from './../api/Axios';
import LoadingSpinner from './../components/Shared/LoadingSpinner';

const ReadingPage = () => {
    const { id } = useParams();

    const { data: book, isLoading, isError } = useQuery({
        queryKey: ['reading-content', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/content/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <LoadingSpinner />;

    // ডেটাবেসের লিংকটিতে ?embed=true আছে কিনা তা নিশ্চিত করা হচ্ছে
    const bookUrl = book?.flipbookEmbedCode?.includes('?embed=true') 
        ? book.flipbookEmbedCode 
        : `${book?.flipbookEmbedCode}?embed=true`;

    if (isError || !book || !book.flipbookEmbedCode) {
        return (
            <div className="flex items-center justify-center h-screen text-2xl">
                Sorry, the book URL could not be loaded.
            </div>
        );
    }

    return (
        // মূল কন্টেইনারটিকে এমনভাবে ডিজাইন করা হয়েছে যেন iframe টি সর্বোচ্চ জায়গা পায়
        <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
            
            <iframe
                src={bookUrl}
                title={book.title}
                // ✅ পরিবর্তন: iframe-টি এখন সব ডিভাইসেই তার প্যারেন্টের ১০০% জায়গা নেবে
                className="w-full h-full"
                style={{ border: 'none' }}
                allowFullScreen
            ></iframe>

        </div>
    );
};

export default ReadingPage;