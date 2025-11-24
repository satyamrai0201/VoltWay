import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StationCard from "@/components/StationCard";
import LoginModal from "@/components/LoginModal";
import StationDetailModal from "@/components/StationDetailModal";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any>(null);

  const mockStations = [
    {
      name: "DLF Cyber Hub Station",
      address: "DLF Cyber City, Sector 24, Gurugram, Haryana",
      distance: "2.3 km",
      connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
      pricePerKwh: 12,
      availability: "available" as const,
      rating: 4.8,
      reviews: 156,
      hostName: "Rajesh Kumar",
      hours: "Open 24/7",
      amenities: ["WiFi", "Restroom", "Cafe", "Parking"],
    },
    {
      name: "MG Road Charging Hub",
      address: "MG Road, Sector 28, Gurugram, Haryana",
      distance: "4.1 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 15,
      availability: "busy" as const,
      rating: 4.5,
      reviews: 89,
      hostName: "Priya Singh",
      hours: "6 AM - 10 PM",
      amenities: ["WiFi", "Parking"],
    },
    {
      name: "Golf Course Station",
      address: "Golf Course Road, Sector 54, Gurugram",
      distance: "5.8 km",
      connectorTypes: ["CCS", "CHAdeMO"],
      pricePerKwh: 10,
      availability: "available" as const,
      rating: 4.9,
      reviews: 203,
      hostName: "Amit Sharma",
      hours: "Open 24/7",
      amenities: ["WiFi", "Restroom", "Shopping", "Parking"],
    },
  ];

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password });
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      <HeroSection
        onHowItWorksClick={() => console.log("How it works clicked")}
        onGetStartedClick={() => setIsLoginOpen(true)}
      />

      <FeaturesSection />

      <section className="py-24 px-6" data-testid="section-popular-stations">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Popular Stations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover highly-rated charging stations in your area
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockStations.map((station, index) => (
              <StationCard
                key={index}
                {...station}
                onBookClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginOpen(true);
                  } else {
                    console.log("Book station:", station.name);
                  }
                }}
                onViewDetails={() => setSelectedStation(station)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSignUpClick={() => console.log("Sign up clicked")}
      />

      {selectedStation && (
        <StationDetailModal
          isOpen={!!selectedStation}
          onClose={() => setSelectedStation(null)}
          station={selectedStation}
          onBookNow={() => {
            if (!isLoggedIn) {
              setSelectedStation(null);
              setIsLoginOpen(true);
            } else {
              console.log("Book now:", selectedStation.name);
            }
          }}
          onSchedule={() => {
            if (!isLoggedIn) {
              setSelectedStation(null);
              setIsLoginOpen(true);
            } else {
              console.log("Schedule:", selectedStation.name);
            }
          }}
        />
      )}
    </div>
  );
}
