import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";
import StoriesPage from "./pages/StoriesPage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./pages/SpotifyCallback";
import AuthPage from "./pages/AuthPage";

// Add framer-motion
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <AnimatePresence mode="wait">
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/stories/:songId" element={<StoriesPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/callback" element={<SpotifyCallback />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
