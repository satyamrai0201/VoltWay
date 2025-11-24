import { useState } from "react";
import MapView from "../MapView";

const mockStations = [
  { id: "1", name: "DLF Cyber Hub", lat: 28.4949, lng: 77.0908, availability: "available" as const },
  { id: "2", name: "MG Road Station", lat: 28.4700, lng: 77.0700, availability: "busy" as const },
  { id: "3", name: "Golf Course Hub", lat: 28.4600, lng: 77.0850, availability: "available" as const },
];

export default function MapViewExample() {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <div className="h-screen bg-background p-8">
      <MapView
        stations={mockStations}
        onStationClick={(id) => {
          setSelectedId(id);
          console.log("Station clicked:", id);
        }}
        selectedStationId={selectedId}
      />
    </div>
  );
}
