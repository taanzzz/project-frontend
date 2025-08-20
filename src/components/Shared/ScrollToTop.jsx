import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    // 이전 pathname মনে রাখার জন্য ref ব্যবহার করা হচ্ছে
    const prevPathnameRef = useRef(null);

    useEffect(() => {
        // ✅ শুধুমাত্র যদি pathname পরিবর্তন হয়, তবেই স্ক্রল করবে
        // এর ফলে একই পেজ রিলোড করলে এই শর্তটি পূরণ হবে না
        if (pathname !== prevPathnameRef.current) {
            window.scrollTo(0, 0);
        }

        // বর্তমান pathname'টিকে পরবর্তী render-এর জন্য ref-এ সেভ করা হচ্ছে
        prevPathnameRef.current = pathname;
        
    }, [pathname]); 

    return null; 
};

export default ScrollToTop;