import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import StationCard from "@/components/StationCard";
import StationDetailModal from "@/components/StationDetailModal";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import neonimagePath from "@assets/generated_images/neon_ev_charging_station_night.png";
import modernImagePath from "@assets/generated_images/modern_ev_charging_hub_daylight.png";
import futuristicImagePath from "@assets/generated_images/futuristic_lime_green_charging.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedStation, setSelectedStation] = useState<any>(null);

  // Full 15 demo stations dataset
  const allDemoStations = [
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
    {
      name: "Hitech City Station",
      address: "Hitech City, Hyderabad, Telangana",
      distance: "3.2 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 11,
      availability: "available" as const,
      rating: 4.7,
      reviews: 142,
      hostName: "Amit Patel",
      hours: "Open 24/7",
      amenities: ["WiFi", "Restroom", "Cafe"],
    },
    {
      name: "Phoenix Station",
      address: "Phoenix Market City, Chennai, Tamil Nadu",
      distance: "6.5 km",
      connectorTypes: ["Type 2", "CHAdeMO"],
      pricePerKwh: 13,
      availability: "busy" as const,
      rating: 4.4,
      reviews: 78,
      hostName: "Sneha Gupta",
      hours: "8 AM - 11 PM",
      amenities: ["WiFi", "Shopping", "Parking"],
    },
    {
      name: "Whitefield Hub",
      address: "Whitefield, Bangalore, Karnataka",
      distance: "1.8 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 9,
      availability: "available" as const,
      rating: 4.9,
      reviews: 267,
      hostName: "Arjun Singh",
      hours: "Open 24/7",
      amenities: ["WiFi", "Restroom", "Cafe", "Parking"],
    },
    {
      name: "T-Hub Charging Point",
      address: "T-Hub, Hyderabad, Telangana",
      distance: "4.7 km",
      connectorTypes: ["CCS"],
      pricePerKwh: 14,
      availability: "available" as const,
      rating: 4.6,
      reviews: 124,
      hostName: "Ananya Desai",
      hours: "9 AM - 9 PM",
      amenities: ["WiFi", "Parking"],
    },
    {
      name: "Marina Station",
      address: "Marina Beach Road, Chennai, Tamil Nadu",
      distance: "7.2 km",
      connectorTypes: ["Type 2"],
      pricePerKwh: 12,
      availability: "busy" as const,
      rating: 4.3,
      reviews: 95,
      hostName: "Vikram Reddy",
      hours: "7 AM - 10 PM",
      amenities: ["WiFi", "Parking"],
    },
    {
      name: "Indiranagar Hub",
      address: "Indiranagar, Bangalore, Karnataka",
      distance: "3.5 km",
      connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
      pricePerKwh: 10,
      availability: "available" as const,
      rating: 4.8,
      reviews: 198,
      hostName: "Meera Nair",
      hours: "Open 24/7",
      amenities: ["WiFi", "Restroom", "Cafe", "Parking"],
    },
    {
      name: "Banjara Hills Station",
      address: "Banjara Hills, Hyderabad, Telangana",
      distance: "5.1 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 13,
      availability: "available" as const,
      rating: 4.5,
      reviews: 87,
      hostName: "Rohan Chatterjee",
      hours: "6 AM - 11 PM",
      amenities: ["WiFi", "Parking"],
    },
    {
      name: "Jubilee Hills Charger",
      address: "Jubilee Hills, Hyderabad, Telangana",
      distance: "6.8 km",
      connectorTypes: ["Type 2", "CHAdeMO"],
      pricePerKwh: 15,
      availability: "offline" as const,
      rating: 4.2,
      reviews: 56,
      hostName: "Rajesh Kumar",
      hours: "Closed",
      amenities: ["Parking"],
    },
    {
      name: "Koramangala Point",
      address: "Koramangala, Bangalore, Karnataka",
      distance: "4.2 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 11,
      availability: "available" as const,
      rating: 4.7,
      reviews: 167,
      hostName: "Priya Sharma",
      hours: "7 AM - 10 PM",
      amenities: ["WiFi", "Restroom", "Cafe"],
    },
    {
      name: "Sector 52 Hub",
      address: "Sector 52, Gurugram, Haryana",
      distance: "3.9 km",
      connectorTypes: ["CCS"],
      pricePerKwh: 12,
      availability: "available" as const,
      rating: 4.6,
      reviews: 134,
      hostName: "Amit Patel",
      hours: "Open 24/7",
      amenities: ["WiFi", "Parking"],
    },
    {
      name: "Aerocity Station",
      address: "Aerocity, New Delhi, Delhi",
      distance: "8.5 km",
      connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
      pricePerKwh: 16,
      availability: "busy" as const,
      rating: 4.4,
      reviews: 103,
      hostName: "Sneha Gupta",
      hours: "6 AM - Midnight",
      amenities: ["WiFi", "Restroom", "Cafe", "Parking"],
    },
    {
      name: "Connaught Place Hub",
      address: "Connaught Place, New Delhi, Delhi",
      distance: "7.5 km",
      connectorTypes: ["CCS", "Type 2"],
      pricePerKwh: 14,
      availability: "available" as const,
      rating: 4.5,
      reviews: 112,
      hostName: "Arjun Singh",
      hours: "8 AM - 10 PM",
      amenities: ["WiFi", "Parking"],
    },
  ];

  // Get 3 popular stations from Gurgaon with images
  const popularStations = useMemo(() => {
    const stationImages = [neonimagePath, modernImagePath, futuristicImagePath];
    // Select stations at indices 0, 2, 12 (all Gurgaon stations) from the 15 dataset
    const selectedIndices = [0, 2, 12];
    return selectedIndices.map((idx, imageIdx) => ({
      ...allDemoStations[idx],
      imageUrl: stationImages[imageIdx],
    }));
  }, []);

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
            {popularStations.map((station, index) => (
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
