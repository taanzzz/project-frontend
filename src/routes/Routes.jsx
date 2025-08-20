// 📁 File: src/routes/Routes.jsx

import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from "react-router";
import Root from './../layouts/Root';
import LoadingSpinner from '../components/Shared/LoadingSpinner'; // Fallback UI

// --- ✅ Shob Page Component Ekhon Lazy Loaded ---
const Home = lazy(() => import('./../pages/Home/Home'));
const Login = lazy(() => import('./../pages/Login'));
const Register = lazy(() => import('./../pages/Register'));
const Library = lazy(() => import('./../pages/Library'));
const BookDetails = lazy(() => import('./../pages/BookDetails'));
const ReadingPage = lazy(() => import('./../pages/ReadingPage'));
const CommunityHub = lazy(() => import('./../pages/CommunityHub'));
const PublicProfile = lazy(() => import('./../pages/PublicProfile'));
const InboxPage = lazy(() => import('./../pages/InboxPage'));
const ChatWindow = lazy(() => import('./../components/Messaging/ChatWindow'));
const NotificationsPage = lazy(() => import('./../pages/NotificationsPage'));
const SinglePostPage = lazy(() => import('./../pages/SinglePostPage'));
const GamingZone = lazy(() => import('./../pages/GamingZone'));
const GamePlayer = lazy(() => import('./../pages/GamePlayer'));
const MindfulnessZone = lazy(() => import('./../pages/MindfulnessZone'));
const BreathingExercise = lazy(() => import('./../pages/BreathingExercise'));
const SoundBathPlayer = lazy(() => import('./../pages/Mindfulness/SoundBathPlayer'));
const BodyScanPlayer = lazy(() => import('./../pages/Mindfulness/BodyScanPlayer'));
const DonatePage = lazy(() => import('./../pages/DonatePage'));

// Store
const StoreLayout = lazy(() => import('./../layouts/StoreLayout'));
const BooksPage = lazy(() => import('./../components/Store/BooksPage'));
const ProductDetailsPage = lazy(() => import('./../components/Store/ProductDetailsPage'));
const CartPage = lazy(() => import('./../components/Store/CartPage'));
const CheckoutPage = lazy(() => import('./../components/Store/CheckoutPage'));
const StoreHome = lazy(() => import('./../components/Store/StoreHome'));

// Dashboard
const DashboardLayout = lazy(() => import('./../layouts/DashboardLayout'));
const Profile = lazy(() => import('./../pages/Dashboard/Common/Profile'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const ContributorRoute = lazy(() => import('./ContributorRoute'));
const AdminRoute = lazy(() => import('./AdminRoute'));

// Member Dashboard
const MyShelf = lazy(() => import('./../pages/Dashboard/Member/MyShelf'));
const MyActivity = lazy(() => import('./../pages/Dashboard/Member/MyActivity'));
const Settings = lazy(() => import('./../pages/Dashboard/Member/Settings'));
const OrderHistory = lazy(() => import('./../pages/Dashboard/Member/OrderHistory'));

// Contributor Dashboard
const ContributorDashboard = lazy(() => import("../pages/Dashboard/Contributor/ContributorDashboard"));
const AddContent = lazy(() => import('./../pages/Dashboard/Contributor/AddContent'));
const MyContent = lazy(() => import('./../pages/Dashboard/Contributor/MyContent'));
const ContentAnalytics = lazy(() => import("../pages/Dashboard/Contributor/ContentAnalytics"));

// Admin Dashboard
const AdminDashboard = lazy(() => import('./../pages/Dashboard/Admin/AdminDashboard'));
const ManageContent = lazy(() => import('./../pages/Dashboard/Admin/ManageContent'));
const ManageUsers = lazy(() => import('./../pages/Dashboard/Admin/ManageUsers'));
const CommunityModeration = lazy(() => import('./../pages/Dashboard/Admin/CommunityModeration'));
const ManageApplications = lazy(() => import("../pages/Dashboard/Admin/ManageApplications"));
import AffiliatePicksPage from './../components/Store/AffiliatePicksPage';
import StationeryPage from './../components/Store/StationeryPage';
import ShoppingBagPage from './../components/Store/ShoppingBagPage';



// ✅ Lazy Loading'er jonno ekta wrapper component
const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<LoadingSpinner />}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
            { path: "login", element: <SuspenseWrapper><Login /></SuspenseWrapper> },
            { path: "register", element: <SuspenseWrapper><Register /></SuspenseWrapper> },
            { path: "library", element: <SuspenseWrapper><Library /></SuspenseWrapper> },
            { path: "library/item/:id", element: <SuspenseWrapper><PrivateRoute><BookDetails /></PrivateRoute></SuspenseWrapper> },
            { path: "read/:id", element: <SuspenseWrapper><PrivateRoute><ReadingPage /></PrivateRoute></SuspenseWrapper> },
            { path: "donate", element: <SuspenseWrapper><PrivateRoute><DonatePage /></PrivateRoute></SuspenseWrapper> },
            { path: "community-hub", element: <SuspenseWrapper><PrivateRoute><CommunityHub /></PrivateRoute></SuspenseWrapper> },
            { path: "profiles/:id", element: <SuspenseWrapper><PrivateRoute><PublicProfile /></PrivateRoute></SuspenseWrapper> },
            { path: "gaming-zone", element: <SuspenseWrapper><PrivateRoute><GamingZone /></PrivateRoute></SuspenseWrapper> },
            { path: "gaming-zone/:id", element: <SuspenseWrapper><PrivateRoute><GamePlayer /></PrivateRoute></SuspenseWrapper> },
            { path: "messages", element: <SuspenseWrapper><PrivateRoute><InboxPage /></PrivateRoute></SuspenseWrapper> },
            { path: "messages/:conversationId", element: <SuspenseWrapper><PrivateRoute><ChatWindow /></PrivateRoute></SuspenseWrapper> },
            { path: "notifications", element: <SuspenseWrapper><PrivateRoute><NotificationsPage /></PrivateRoute></SuspenseWrapper> },
            { path: "post/:id", element: <SuspenseWrapper><PrivateRoute><SinglePostPage /></PrivateRoute></SuspenseWrapper> },
            { path: "mindfulness-zone", element: <SuspenseWrapper><PrivateRoute><MindfulnessZone /></PrivateRoute></SuspenseWrapper> },
            { path: "mindfulness/breathing/:id", element: <SuspenseWrapper><PrivateRoute><BreathingExercise /></PrivateRoute></SuspenseWrapper> },
            { path: "mindfulness/sound-bath/:id", element: <SuspenseWrapper><PrivateRoute><SoundBathPlayer /></PrivateRoute></SuspenseWrapper> },
            { path: "mindfulness/body-scan/:id", element: <SuspenseWrapper><PrivateRoute><BodyScanPlayer /></PrivateRoute></SuspenseWrapper> },
        ],
    },
    {
        path: "dashboard",
        element: <SuspenseWrapper><PrivateRoute><DashboardLayout /></PrivateRoute></SuspenseWrapper>,
        children: [
            { index: true, element: <Navigate to="/dashboard/profile" replace /> },
            { path: "profile", element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
            { path: "contributor-dashboard", element: <SuspenseWrapper><ContributorRoute><ContributorDashboard /></ContributorRoute></SuspenseWrapper> },
            { path: "manage-applications", element: <SuspenseWrapper><AdminRoute><ManageApplications /></AdminRoute></SuspenseWrapper> },
            { path: "content-analytics", element: <SuspenseWrapper><ContributorRoute><ContentAnalytics /></ContributorRoute></SuspenseWrapper> },
            { path: "admin-dashboard", element: <SuspenseWrapper><AdminRoute><AdminDashboard /></AdminRoute></SuspenseWrapper> },
            { path: "manage-users", element: <SuspenseWrapper><AdminRoute><ManageUsers /></AdminRoute></SuspenseWrapper> },
            { path: "manage-content", element: <SuspenseWrapper><AdminRoute><ManageContent /></AdminRoute></SuspenseWrapper> },
            { path: "community-moderation", element: <SuspenseWrapper><AdminRoute><CommunityModeration /></AdminRoute></SuspenseWrapper> },
            { path: "my-shelf", element: <SuspenseWrapper><MyShelf /></SuspenseWrapper> },
            { path: "my-activity", element: <SuspenseWrapper><MyActivity /></SuspenseWrapper> },
            { path: "order-history", element: <SuspenseWrapper><OrderHistory /></SuspenseWrapper> },
            { path: "settings", element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
            { path: "add-content", element: <SuspenseWrapper><ContributorRoute><AddContent /></ContributorRoute></SuspenseWrapper> },
            { path: "my-content", element: <SuspenseWrapper><ContributorRoute><MyContent /></ContributorRoute></SuspenseWrapper> },
        ]
    },
    {
        path: "store",
        element: <SuspenseWrapper><StoreLayout /></SuspenseWrapper>,
        children: [
            { index: true, element: <SuspenseWrapper><StoreHome /></SuspenseWrapper> },
            { path: "books", element: <SuspenseWrapper><BooksPage /></SuspenseWrapper> },
            { path: "products/:id", element: <SuspenseWrapper><PrivateRoute><ProductDetailsPage /></PrivateRoute></SuspenseWrapper> },
            { path: "cart", element: <SuspenseWrapper><PrivateRoute><CartPage /></PrivateRoute></SuspenseWrapper> },
            { path: "checkout", element: <SuspenseWrapper><PrivateRoute><CheckoutPage /></PrivateRoute></SuspenseWrapper> },
            { path: "affiliates", element: <SuspenseWrapper><PrivateRoute><AffiliatePicksPage /></PrivateRoute></SuspenseWrapper> },
            { path: "stationery", element: <SuspenseWrapper><PrivateRoute><StationeryPage /></PrivateRoute></SuspenseWrapper>},
            { path: "bag", element: <SuspenseWrapper><PrivateRoute><ShoppingBagPage /></PrivateRoute></SuspenseWrapper>}
        ]
    }
]);