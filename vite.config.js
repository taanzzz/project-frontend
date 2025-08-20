import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // ওয়ার্নিং লিমিট 1MB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // node_modules এর লাইব্রেরি আলাদা চাঙ্কে
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('axios')) {
              return 'axios';
            }
            if (id.includes('react-icons')) {
              return 'react-icons';
            }
            if (id.includes('react-router-dom')) {
              return 'react-router';
            }
            if (id.includes('lottie-web')) {
              return 'lottie';
            }
            if (id.includes('sweetalert2')) {
              return 'sweetalert';
            }
            return 'vendor'; // অন্যান্য node_modules
          }

          // বড় কম্পোনেন্ট আলাদা চাঙ্কে
          if (id.includes('PostCard')) {
            return 'postcard';
          }
          if (id.includes('FeaturedContentCarousel')) {
            return 'carousel';
          }
          if (id.includes('SocialProof')) {
            return 'social-proof';
          }

          return undefined; // বাকি সব একই চাঙ্কে
        }
      }
    }
  }
})
