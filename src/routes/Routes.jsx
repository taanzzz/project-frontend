// 📁 File: src/routes/Routes.jsx
import { createBrowserRouter, Navigate } from "react-router"; // <-- Navigate ইম্পোর্ট করুন
import Root from './../layouts/Root';
import Home from './../pages/Home/Home';
import Login from './../pages/Login';
import Register from './../pages/Register';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from './../layouts/DashboardLayout';
import Profile from './../pages/Dashboard/Common/Profile';
import Library from './../pages/Library';
import BookDetails from './../pages/BookDetails';
import ContributorRoute from './ContributorRoute';
import AddContent from './../pages/Dashboard/Contributor/AddContent';
import MyContent from './../pages/Dashboard/Contributor/MyContent';
import ManageContent from './../pages/Dashboard/Admin/ManageContent';
import AdminRoute from './AdminRoute';
import ReadingPage from './../pages/ReadingPage';
import CommunityHub from './../pages/CommunityHub';
import PublicProfile from './../pages/PublicProfile';
import InboxPage from './../pages/InboxPage';
import ChatWindow from './../components/Messaging/ChatWindow';
import NotificationsPage from './../pages/NotificationsPage';
import SinglePostPage from './../pages/SinglePostPage';
import GamingZone from './../pages/GamingZone';
import GamePlayer from './../pages/GamePlayer';
import MindfulnessZone from './../pages/MindfulnessZone';
import BreathingExercise from './../pages/BreathingExercise';
import SoundBathPlayer from './../pages/Mindfulness/SoundBathPlayer';
import BodyScanPlayer from './../pages/Mindfulness/BodyScanPlayer';
import StoreLayout from './../layouts/StoreLayout';
import StoreHome from './../components/Store/StoreHome';
import BooksPage from './../components/Store/BooksPage';
import ProductDetailsPage from './../components/Store/ProductDetailsPage';
import CartPage from './../components/Store/CartPage';
import CheckoutPage from "../components/Store/CheckoutPage";
import AffiliatePicksPage from './../components/Store/AffiliatePicksPage';
import StationeryPage from './../components/Store/StationeryPage';
import ShoppingBagPage from './../components/Store/ShoppingBagPage';
import SponsorshipPage from './../pages/SponsorshipPage';
import SellWithUsPage from './../pages/SellWithUsPage';
import MyShelf from './../pages/Dashboard/Member/MyShelf';





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "library", element: <Library /> },
            { path: "library/item/:id", element: <PrivateRoute><BookDetails /></PrivateRoute> },
            { path: "/read/:id", element: <PrivateRoute><ReadingPage /></PrivateRoute> },
           
         
         { 
                path: "community-hub", 
                element: <PrivateRoute><CommunityHub /></PrivateRoute> 
            },
            { 
                path: "profiles/:id", // ✅ এই রুটটি অন্য ব্যবহারকারীদের প্রোফাইল দেখাবে
                element: <PrivateRoute><PublicProfile /></PrivateRoute> 
            },

            {
    path: "gaming-zone",
    element: <PrivateRoute><GamingZone /></PrivateRoute>,
},
{
    path: "gaming-zone/:id",
    element: <PrivateRoute><GamePlayer /></PrivateRoute>,
},



            { 
    path: "messages", 
    element: <PrivateRoute><InboxPage /></PrivateRoute> 
},
{
    path: "messages/:conversationId",
    element: <PrivateRoute><ChatWindow /></PrivateRoute>
},
{
                path: "notifications",
                element: <PrivateRoute><NotificationsPage /></PrivateRoute>
            },
            {
    path: "post/:id",
    element: <PrivateRoute><SinglePostPage /></PrivateRoute>
},
{
    path: "mindfulness-zone",
    element: <PrivateRoute><MindfulnessZone /></PrivateRoute>,
},
{
    path: "mindfulness/breathing/:id",
    element: <PrivateRoute><BreathingExercise /></PrivateRoute>,
},
{
    path: "mindfulness/sound-bath/:id",
    element: <PrivateRoute><SoundBathPlayer /></PrivateRoute>,
},
{
    path: "mindfulness/body-scan/:id",
    element: <PrivateRoute><BodyScanPlayer /></PrivateRoute>,
},

        ],
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // --- সমাধান: ড্যাশবোর্ডের ডিফল্ট রুট হিসেবে প্রোফাইল পেজ ---
            { 
                index: true, 
                element: <Navigate to="/dashboard/profile" replace /> 
            },
            { 
                path: "profile", 
                element: <Profile /> 
            },
            {
    path: "my-shelf",
    element: <MyShelf /> // MemberRoute দিয়েও মুড়ে দিতে পারেন
},

            {
    path: "add-content",
    element: <ContributorRoute><AddContent /></ContributorRoute>
},
{
    path: "my-content",
    element: <ContributorRoute><MyContent /></ContributorRoute>
},
{ path: "manage-content", element: <AdminRoute><ManageContent /></AdminRoute> },
        ]
    },
{
        path: "store",
        element: <StoreLayout />,
        children: [
            {
                index: true,
                element: <StoreHome />
            },
            { path: "books", element: <BooksPage /> },
        { path: "products/:id", element: <PrivateRoute><ProductDetailsPage /></PrivateRoute> },
        { path: "cart", element: <PrivateRoute><CartPage /></PrivateRoute> },
        { path: "checkout", element: <PrivateRoute><CheckoutPage /></PrivateRoute> },
        { path: "affiliates", element: <AffiliatePicksPage /> },
        { path: "stationery", element: <StationeryPage /> },
        { path: "bag", element: <ShoppingBagPage /> },
         { path: "sponsorship", element: <SponsorshipPage /> }, // ✅ নতুন রাউট যোগ করুন
            { path: "sell-with-us", element: <SellWithUsPage /> },
        ]
    }
]);
    