
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Dashboard from "@/pages/Dashboard";
import TodoPage from "@/pages/TodoPage";
import WatchPage from "@/pages/WatchPage";
import AICoach from "@/pages/AICoach";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";

// Dark mode
const setDarkMode = () => {
  document.documentElement.classList.add('dark');
  localStorage.theme = 'dark';
};

const setLightMode = () => {
  document.documentElement.classList.remove('dark');
  localStorage.theme = 'light';
};

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check user preference or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode();
    } else {
      setLightMode();
    }
    
    // Simulate initial loading
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <motion.h1 
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            PulseTrack
          </motion.h1>
        </motion.div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/todo" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <TodoPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/watch" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <WatchPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-coach" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AICoach />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AnimatePresence>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
