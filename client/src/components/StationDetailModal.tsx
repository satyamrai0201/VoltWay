import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Zap, Clock, IndianRupee, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface StationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: {
    name: string;
    address: string;
    distance: string;
    connectorTypes: string[];
    pricePerKwh: number;
    availability: "available" | "busy" | "offline";
    imageUrl?: string;
    rating?: number;
    reviews?: number;
    hostName?: string;
    hostImage?: string;
    hours?: string;
    amenities?: string[];
  };
  onBookNow?: () => void;
  onSchedule?: () => void;
}

export default function StationDetailModal({
  isOpen,
  onClose,
  station,
  onBookNow,
  onSchedule,
}: StationDetailModalProps) {
  const availabilityConfig = {
    available: { color: "bg-green-500", text: "Available Now" },
    busy: { color: "bg-yellow-500", text: "Busy" },
    offline: { color: "bg-gray-500", text: "Offline" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
            data-testid="overlay-station-detail"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-background rounded-3xl shadow-2xl w-full max-w-2xl relative my-8"
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-station-detail"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 hover-elevate rounded-full p-2 bg-background z-10"
                data-testid="button-close-modal"
              >
                <X size={24} />
              </button>

              <div className="aspect-video relative bg-muted overflow-hidden rounded-t-3xl">
                {station.imageUrl ? (
                  <img src={station.imageUrl} alt={station.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap size={64} className="text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <Badge className="gap-1.5 text-sm">
                    <div className={`h-2 w-2 rounded-full ${availabilityConfig[station.availability].color}`} />
                    {availabilityConfig[station.availability].text}
                  </Badge>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-3xl font-bold" data-testid="text-station-name">{station.name}</h2>
                    {station.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={18} className="fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{station.rating}</span>
                        <span className="text-sm text-muted-foreground">({station.reviews})</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                    <span>{station.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock size={16} />
                      <span className="text-sm">Distance</span>
                    </div>
                    <p className="text-lg font-semibold">{station.distance} away</p>
                  </div>
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <IndianRupee size={16} />
                      <span className="text-sm">Price</span>
                    </div>
                    <p className="text-lg font-semibold">₹{station.pricePerKwh}/kWh</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Available Connectors</h3>
                  <div className="flex flex-wrap gap-2">
                    {station.connectorTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {station.amenities && station.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {station.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {station.hostName && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={station.hostImage} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {station.hostName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Hosted by {station.hostName}</p>
                      {station.hours && (
                        <p className="text-sm text-muted-foreground">{station.hours}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={onSchedule}
                    data-testid="button-schedule"
                  >
                    Schedule Charging
                  </Button>
                  <Button
                    className="flex-1 rounded-full"
                    onClick={onBookNow}
                    disabled={station.availability === "offline"}
                    data-testid="button-book-now"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
