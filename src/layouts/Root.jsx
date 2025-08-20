// 📁 File: src/layouts/Root.jsx

import React, { Suspense } from 'react';
import { Outlet, useLocation } from "react-router"; // ✅ ইম্পোর্ট ঠিক করা হয়েছে
import Navbar from './../components/Shared/Navbar';
import ScrollToTop from './../components/Shared/ScrollToTop';
import Footer from './../components/Shared/Footer';
import Chatbot from "../components/Shared/Chatbot";
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const Root = () => {
 const location = useLocation();

 const isHomePage = location.pathname === '/';
 const isReadingPage = location.pathname.startsWith('/read/');

    // ✅ নতুন: যেসকল পেজে ফুটার দেখানো হবে না তাদের তালিকা
    const noFooterPaths = ['/login', '/register', '/community-hub'];
    const hideFooterOnSpecificPages = noFooterPaths.includes(location.pathname);

 return (
  <div className="min-h-screen flex flex-col overflow-x-hidden">
   
   {!isReadingPage && <Navbar />}
   
   {/* শুধুমাত্র হোমপেজে থাকলেই Chatbot দেখানো হবে */}
   {isHomePage && <Chatbot />}

   <ScrollToTop />

   <div className={`flex-grow ${!isReadingPage ? 'mt-17' : ''}`}>
    <Suspense fallback={<LoadingSpinner />}>
     <Outlet />
    </Suspense>
   </div>

   {/* ✅ নতুন শর্ত যোগ করা হয়েছে: রিডিং পেজ অথবা নির্দিষ্ট পেজগুলোতে ফুটার দেখানো হবে না */}
   {!isReadingPage && !hideFooterOnSpecificPages && <Footer />}
   
  </div>
 );
};

export default Root;