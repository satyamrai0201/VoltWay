import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StationCard from "@/components/StationCard";
import StationDetailModal from "@/components/StationDetailModal";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <HeroSection
        onHowItWorksClick={() => console.log("How it works clicked")}
        onGetStartedClick={() => setLocation("/find-stations")}
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
                  console.log("Book station:", station.name);
                  setLocation("/find-stations");
                }}
                onViewDetails={() => setSelectedStation(station)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {selectedStation && (
        <StationDetailModal
          isOpen={!!selectedStation}
          onClose={() => setSelectedStation(null)}
          station={selectedStation}
          onBookNow={() => {
            setSelectedStation(null);
            setLocation("/find-stations");
          }}
          onSchedule={() => {
            setSelectedStation(null);
            setLocation("/find-stations");
          }}
        />
      )}
    </div>
  );
}
