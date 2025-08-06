import { Outlet, useLocation } from "react-router"; // 🔔 useLocation ইম্পোর্ট করুন
import Navbar from './../components/Shared/Navbar';
import ScrollToTop from './../components/Shared/ScrollToTop';
import Footer from './../components/Shared/Footer';

const Root = () => {
    const location = useLocation();

    // চেক করা হচ্ছে, বর্তমান URL-এর পাথ '/read/' দিয়ে শুরু হচ্ছে কিনা
    const isReadingPage = location.pathname.startsWith('/read/');

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            
            {/* যদি রিডিং পেইজ না হয়, তবেই Navbar দেখানো হবে */}
            {!isReadingPage && <Navbar />}

            <ScrollToTop />

            {/* mt-17 ক্লাসটি শুধু Navbar থাকলে প্রযোজ্য হতে পারে, তাই এটিকে শর্তসাপেক্ষে দেওয়া ভালো */}
            <div className={`flex-grow ${!isReadingPage ? 'mt-17' : ''}`}>
                <Outlet />
            </div>

            {/* যদি রিডিং পেইজ না হয়, তবেই Footer দেখানো হবে */}
            {!isReadingPage && <Footer />}
            
        </div>
    );
};

export default Root;