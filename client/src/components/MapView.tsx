import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  availability: "available" | "busy" | "offline";
}

interface MapViewProps {
  stations: Station[];
  onStationClick?: (stationId: string) => void;
  selectedStationId?: string;
}

export default function MapView({ stations, onStationClick, selectedStationId }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-muted rounded-3xl overflow-hidden" data-testid="map-view">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10">
            <MapPin size={40} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Map integration will show charging stations across India
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {stations.slice(0, 3).map((station) => (
              <button
                key={station.id}
                onClick={() => onStationClick?.(station.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover-elevate ${
                  selectedStationId === station.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                }`}
                data-testid={`marker-${station.id}`}
              >
                {station.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {stations.filter((s) => s.availability === "available").length} Available
        </Badge>
      </div>
    </div>
  );
}
