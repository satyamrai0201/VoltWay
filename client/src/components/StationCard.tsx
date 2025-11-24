import { motion } from "framer-motion";
import { MapPin, Zap, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StationCardProps {
  name: string;
  address: string;
  distance: string;
  connectorTypes: string[];
  pricePerKwh: number;
  availability: "available" | "busy" | "offline";
  imageUrl?: string;
  onBookClick?: () => void;
  onViewDetails?: () => void;
}

export default function StationCard({
  name,
  address,
  distance,
  connectorTypes,
  pricePerKwh,
  availability,
  imageUrl,
  onBookClick,
  onViewDetails,
}: StationCardProps) {
  const availabilityConfig = {
    available: { color: "bg-green-500", text: "Available" },
    busy: { color: "bg-yellow-500", text: "Busy" },
    offline: { color: "bg-gray-500", text: "Offline" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-3xl overflow-hidden border border-card-border shadow-md hover-elevate"
      data-testid={`card-station-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="aspect-video relative bg-muted overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap size={48} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className="gap-1.5">
            <div className={`h-2 w-2 rounded-full ${availabilityConfig[availability].color}`} />
            {availabilityConfig[availability].text}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2" data-testid="text-station-name">{name}</h3>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={16} />
            <span>{distance} away</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-lg">
            <IndianRupee size={18} />
            <span data-testid="text-price">{pricePerKwh}</span>
            <span className="text-sm font-normal text-muted-foreground">/kWh</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {connectorTypes.map((type, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onViewDetails}
            data-testid="button-view-details"
          >
            View Details
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={onBookClick}
            disabled={availability === "offline"}
            data-testid="button-book-now"
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
