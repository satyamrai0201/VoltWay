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
    if (!user?.firstName && !user?.lastName) return "U";
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase();
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      data-testid="navigation-main"
    >
      <div className="bg-background/80 backdrop-blur-md rounded-full border px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between w-full gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight hover-elevate rounded-full px-3 py-1 shrink-0" data-testid="link-home">
            VoltWay
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium hover-elevate rounded-full transition-colors" data-testid={`link-${link.label.toLowerCase()}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Login/Profile Button - Always visible */}
          <div className="flex items-center gap-2 shrink-0">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="hover-elevate rounded-full p-1 transition-transform"
                  data-testid="button-profile"
                  title={user ? `${user.firstName} ${user.lastName}` : "Profile"}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatarUrl || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-lime-400 to-lime-500 text-black text-xs font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <ProfileDropdown onClose={() => setProfileOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = "/api/login";
                }}
                className="rounded-full bg-lime-400 text-black hover:bg-lime-500"
                size="sm"
                data-testid="button-login"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden hover-elevate rounded-full p-2"
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 pt-4 border-t overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                {mobileNavLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium hover-elevate rounded-full block" data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
