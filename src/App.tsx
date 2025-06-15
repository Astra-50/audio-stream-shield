import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip"

import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Billing from '@/pages/Billing';
import Testimonials from '@/pages/Testimonials';
import NotFound from '@/pages/NotFound';
import Navigation from '@/components/layout/Navigation';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import AudioSetup from '@/pages/AudioSetup';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/audio-setup" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <AudioSetup />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <Settings />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/billing" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <Billing />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/testimonials" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                      <Testimonials />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
