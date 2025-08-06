// 📁 File: src/components/Shared/LibraryLoader.jsx

import React from 'react';

// স্কেলিটন কার্ড সাব-কম্পোনেন্ট
const SkeletonCard = () => (
    <div className="bg-base-100 p-4 rounded-2xl shadow-lg">
        <div className="bg-base-300 h-56 rounded-lg animate-pulse"></div>
        <div className="mt-4 space-y-3">
            <div className="bg-base-300 h-4 w-3/4 rounded animate-pulse"></div>
            <div className="bg-base-300 h-3 w-1/2 rounded animate-pulse"></div>
        </div>
    </div>
);

const LibraryLoader = () => {
    return (
        <div className="bg-base-200 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Featured Section Skeleton */}
                <div className="bg-base-100 p-8 rounded-3xl shadow-2xl mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-48 h-72 bg-base-300 rounded-lg animate-pulse flex-shrink-0"></div>
                        <div className="w-full space-y-4">
                            <div className="h-4 w-1/3 bg-base-300 rounded animate-pulse"></div>
                            <div className="h-10 w-full bg-base-300 rounded animate-pulse"></div>
                            <div className="h-6 w-1/2 bg-base-300 rounded animate-pulse"></div>
                            <div className="h-14 w-48 bg-base-300 rounded-lg animate-pulse mt-4"></div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Skeleton */}
                <div className="bg-base-100/50 p-6 rounded-2xl shadow-xl mb-12">
                    <div className="h-16 w-full max-w-lg mx-auto mb-6 bg-base-300 rounded-full animate-pulse"></div>
                    <div className="flex justify-center flex-wrap gap-2">
                        <div className="h-8 w-20 bg-base-300 rounded-full animate-pulse"></div>
                        <div className="h-8 w-24 bg-base-300 rounded-full animate-pulse"></div>
                        <div className="h-8 w-20 bg-base-300 rounded-full animate-pulse"></div>
                        <div className="h-8 w-28 bg-base-300 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        </div>
    );
};

export default LibraryLoader;