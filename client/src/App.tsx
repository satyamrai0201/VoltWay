import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import FindStations from "@/pages/FindStations";
import StationDetail from "@/pages/StationDetail";
import MyBookings from "@/pages/MyBookings";
import BookingDetail from "@/pages/BookingDetail";
import HostDashboard from "@/pages/HostDashboard";
import BecomeHost from "@/pages/BecomeHost";
import Profile from "@/pages/Profile";
import Help from "@/pages/Help";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import LoginPrompt from "@/components/LoginPrompt";
import { motion, AnimatePresence } from "framer-motion";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-stations" component={FindStations} />
      <Route path="/stations/:id" component={StationDetail} />
      <Route path="/bookings" component={MyBookings} />
      <Route path="/bookings/:id" component={BookingDetail} />
      <Route path="/host/dashboard" component={HostDashboard} />
      <Route path="/host/new" component={BecomeHost} />
      <Route path="/host/edit/:id" component={BecomeHost} />
      <Route path="/profile" component={Profile} />
      <Route path="/help" component={Help} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);

  useEffect(() => {
    // Show welcome overlay on every page load
    setShowWelcomeOverlay(true);
    
    // Auto-hide after welcome animation completes
    const timer = setTimeout(() => {
      setShowWelcomeOverlay(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AnimatePresence>
          {showWelcomeOverlay && (
            <motion.div
              className="fixed inset-0 z-50 bg-black"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ pointerEvents: "auto" }}
            >
              <LoginPrompt hideButton={true} />
            </motion.div>
          )}
        </AnimatePresence>
        {!showWelcomeOverlay && <Router />}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
