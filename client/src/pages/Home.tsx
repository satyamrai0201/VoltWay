import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Zap, Star, MapPin } from "lucide-react";
import type { Station } from "@shared/schema";
import neonimagePath from "@assets/generated_images/neon_ev_charging_station_night.png";
import modernImagePath from "@assets/generated_images/modern_ev_charging_hub_daylight.png";
import futuristicImagePath from "@assets/generated_images/futuristic_lime_green_charging.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Fetch all stations from backend
  const { data: allStations = [] } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  // Get 3 Gurgaon stations with images
  const popularStations = useMemo(() => {
    const gurgaonStations = allStations.filter(
      (station) => station.city.toLowerCase() === "gurgaon"
    );
    
    // Use first 3 Gurgaon stations, or less if not enough
    const selectedStations = gurgaonStations.slice(0, 3);
    const images = [neonimagePath, modernImagePath, futuristicImagePath];
    
    return selectedStations.map((station, idx) => ({
      ...station,
      imageUrl: images[idx] || station.imageUrl,
    }));
  }, [allStations]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <HeroSection
        onHowItWorksClick={() => setShowVideoModal(true)}
        onGetStartedClick={() => setLocation("/find-stations")}
      />

      <FeaturesSection />

      {/* Popular Stations Section */}
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
              Discover highly-rated charging stations in Gurgaon
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStations.map((station) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full rounded-3xl overflow-hidden border border-card-border shadow-md hover-elevate">
                  {/* Station Image */}
                  <div className="aspect-video relative bg-muted overflow-hidden">
                    {station.imageUrl ? (
                      <img
                        src={station.imageUrl}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    {/* Availability Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Available
                      </Badge>
                    </div>
                  </div>

                  {/* Station Details */}
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2" data-testid="text-station-name">
                        {station.name}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{station.address}</span>
                      </div>
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-semibold text-lg">
                        <span className="text-primary">₹{station.pricePerHour}</span>
                        <span className="text-sm font-normal text-muted-foreground">/hr</span>
                      </div>
                      {station.rating && (
                        <Badge variant="secondary" className="gap-1">
                          <Star size={12} className="fill-primary text-primary" />
                          {station.rating}
                        </Badge>
                      )}
                    </div>

                    {/* Charger Type Badge */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {station.chargerType}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {station.powerOutput} kW
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/stations/${station.id}`}>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-full"
                          data-testid="button-view-details"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/stations/${station.id}`}>
                        <Button
                          className="flex-1 rounded-full"
                          data-testid="button-book-now"
                        >
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer onHowItWorksClick={() => setShowVideoModal(true)} />

      {/* How It Works Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="w-full max-w-4xl aspect-video p-0 border-0 rounded-3xl overflow-hidden bg-black">
          <div className="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/EpznbHcGe3I?si=pPqzQtGXVm2YS44z&autoplay=1"
              title="VoltWay - How it Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
              data-testid="video-how-it-works"
            />
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
              data-testid="button-close-video"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
