// 📁 File: src/main.jsx

import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthProvider';
import { AudioProvider } from './Providers/AudioProvider';
import { router } from './routes/Routes';
import './index.css';
import { CartProvider } from './Providers/CartProvider';



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <CartProvider>
<RouterProvider router={router} />
</CartProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);