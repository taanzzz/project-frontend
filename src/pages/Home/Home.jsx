// 📁 File: src/pages/Home/Home.jsx

import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';

// --- ✅ Homepage-er prottek'ti section ekhon Lazy Loaded ---
const HeroSection = lazy(() => import('./HeroSection'));
const FeaturedContentCarousel = lazy(() => import('../../components/FeaturedContentCarousel'));
const PlatformPillars = lazy(() => import('./PlatformPillars'));
const SocialProof = lazy(() => import('./SocialProof'));
const PlatformStats = lazy(() => import('./PlatformStats'));
const OurPhilosophy = lazy(() => import('./OurPhilosophy'));
const ContactSection = lazy(() => import('./ContactSection'));
const LatestAndTopRated = lazy(() => import('./LatestAndTopRated'));
const OurJourney = lazy(() => import('../../components/OurJourney'));
const BecomeContributor = lazy(() => import('../BecomeContributor')); // ✅ Notun import

const Home = () => {
  return (
    <div>
        {/* ✅ Suspense diye shobgulo component'ke mure deya hoyeche */}
        <Suspense fallback={<LoadingSpinner />}>
            <HeroSection />
            <FeaturedContentCarousel />
            <PlatformPillars />
            <LatestAndTopRated />
            <SocialProof />
            <PlatformStats />
            <OurPhilosophy />
            <BecomeContributor /> {/* ✅ Component jog kora hoyeche */}
            <OurJourney />
            <ContactSection />
        </Suspense>
    </div>
  )
}

export default Home;