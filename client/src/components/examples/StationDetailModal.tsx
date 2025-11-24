import { useState } from "react";
import StationDetailModal from "../StationDetailModal";
import { Button } from "@/components/ui/button";

export default function StationDetailModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  const mockStation = {
    name: "DLF Cyber Hub Station",
    address: "DLF Cyber City, Sector 24, Gurugram, Haryana 122002",
    distance: "2.3 km",
    connectorTypes: ["CCS", "CHAdeMO", "Type 2"],
    pricePerKwh: 12,
    availability: "available" as const,
    rating: 4.8,
    reviews: 156,
    hostName: "Rajesh Kumar",
    hours: "Open 24/7",
    amenities: ["WiFi", "Restroom", "Cafe", "Parking"],
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-modal">
        Open Station Detail
      </Button>
      <StationDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        station={mockStation}
        onBookNow={() => console.log("Book now clicked")}
        onSchedule={() => console.log("Schedule clicked")}
      />
    </div>
  );
}
