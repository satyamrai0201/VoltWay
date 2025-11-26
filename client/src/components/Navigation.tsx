import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

export default function Navigation({ isLoggedIn: propIsLoggedIn }: NavigationProps) {
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : isAuthenticated;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const navLinks = [
    { label: "Stations", href: "/find-stations" },
    { label: "Bookings", href: "/bookings" },
    { label: "Dashboard", href: "/host/dashboard" },
  ];

  const mobileNavLinks = [
    { label: "Find Stations", href: "/find-stations" },
    { label: "My Bookings", href: "/bookings" },
    { label: "Host Dashboard", href: "/host/dashboard" },
    { label: "Become a Host", href: "/host/new" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-sm:sticky max-sm:top-0 md:fixed md:top-4 left-1/2 -translate-x-1/2 z-[9999] max-sm:w-full md:w-[95%] md:max-w-6xl pointer-events-auto"
        data-testid="navigation-main"
      >
        <div className="bg-background/80 backdrop-blur-md max-sm:rounded-none md:rounded-full max-sm:border-b md:border px-4 md:px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight hover-elevate rounded-full px-3 py-1" data-testid="link-home">
            VoltWay
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium hover-elevate rounded-full transition-colors" data-testid={`link-${link.label.toLowerCase()}`}>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <div className="relative ml-2">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="hover-elevate rounded-full p-2"
                  data-testid="button-profile"
                >
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-lime-400">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-lime-400 text-black text-sm font-bold">{getInitials()}</AvatarFallback>
                  </Avatar>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <ProfileDropdown onClose={() => setProfileOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover-elevate rounded-full p-2.5 active-elevate-2"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {isLoggedIn ? (
              <div className="relative md:hidden">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="hover-elevate rounded-full p-1"
                  data-testid="button-profile-mobile"
                >
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-lime-400">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-lime-400 text-black text-sm font-bold">{getInitials()}</AvatarFallback>
                  </Avatar>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <ProfileDropdown onClose={() => setProfileOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = "/api/login"}
                  className="hidden md:inline-flex rounded-full"
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button
                  onClick={() => window.location.href = "/api/login"}
                  className="rounded-full bg-lime-400 text-black hover:bg-lime-500"
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-0 pt-3 pb-3 border-t overflow-hidden bg-background/95 backdrop-blur-sm"
            >
              <div className="flex flex-col gap-1 px-2">
                {mobileNavLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium hover-elevate rounded-lg block active-elevate-2" 
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
