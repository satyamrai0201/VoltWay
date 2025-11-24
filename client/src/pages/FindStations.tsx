import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Search, Zap, Star, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import type { Station } from "@shared/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "wouter";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface CityTip {
  name: string;
  lat: string;
  lon: string;
}

export default function FindStations() {
  const [searchCity, setSearchCity] = useState("");
  const [chargerType, setChargerType] = useState<string>("all");
  const [minPower, setMinPower] = useState<string>("all");
  const [suggestions, setSuggestions] = useState<CityTip[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: stations, isLoading } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  // Fetch city suggestions from Nominatim API
  useEffect(() => {
    if (searchCity.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(searchCity)}&country=india&format=json&limit=5`
        );
        const data = await response.json();
        
        // Extract unique city names
        const uniqueCities = new Map<string, CityTip>();
        data.forEach((item: any) => {
          const cityName = item.address?.city || item.name;
          if (cityName && !uniqueCities.has(cityName.toLowerCase())) {
            uniqueCities.set(cityName.toLowerCase(), {
              name: cityName,
              lat: item.lat,
              lon: item.lon,
            });
          }
        });
        
        setSuggestions(Array.from(uniqueCities.values()).slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchCity]);

  // City to coordinates mapping
  const cityCoordinates: Record<string, [number, number]> = {
    gurgaon: [28.4595, 77.0266],
    bangalore: [12.9716, 77.5946],
    mumbai: [19.0760, 72.8777],
    delhi: [28.7041, 77.1025],
  };

  // Filter stations based on search and filters
  const filteredStations = (stations || []).filter((station) => {
    // Filter by city
    if (searchCity && !station.city.toLowerCase().includes(searchCity.toLowerCase())) {
      return false;
    }
    // Filter by charger type
    if (chargerType !== "all" && station.chargerType !== chargerType) {
      return false;
    }
    // Filter by minimum power
    if (minPower !== "all" && station.powerOutput < parseInt(minPower)) {
      return false;
    }
    return true;
  });

  // Determine map center based on search
  const mapCenter: [number, number] = searchCity 
    ? cityCoordinates[searchCity.toLowerCase()] || [28.4595, 77.0266]
    : filteredStations.length > 0 
      ? [parseFloat(filteredStations[0].latitude), parseFloat(filteredStations[0].longitude)]
      : [28.4595, 77.0266]; // Default to Gurgaon

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="flex h-screen overflow-hidden">
        <div className="w-96 border-r overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold" data-testid="heading-find-stations">
              Find Stations
            </h1>
            <p className="text-muted-foreground">
              Discover charging stations near you
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search city (e.g., Gurgaon)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onFocus={() => searchCity.length >= 2 && setShowSuggestions(true)}
                className="pl-10"
                data-testid="input-search-city"
              />
              {searchCity && (
                <button
                  onClick={() => {
                    setSearchCity("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-clear-search"
                >
                  <X size={18} />
                </button>
              )}
              
              {/* City Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-50" data-testid="city-suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.name}-${suggestion.lat}`}
                      onClick={() => {
                        setSearchCity(suggestion.name);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm border-b last:border-b-0"
                      data-testid={`suggestion-${suggestion.name.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span>{suggestion.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Select value={chargerType} onValueChange={setChargerType}>
              <SelectTrigger data-testid="select-charger-type">
                <SelectValue placeholder="Charger Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CCS2">CCS2</SelectItem>
                <SelectItem value="Type 2">Type 2</SelectItem>
                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
              </SelectContent>
            </Select>

            <Select value={minPower} onValueChange={setMinPower}>
              <SelectTrigger data-testid="select-min-power">
                <SelectValue placeholder="Min Power Output" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Power</SelectItem>
                <SelectItem value="22">22 kW+</SelectItem>
                <SelectItem value="50">50 kW+</SelectItem>
                <SelectItem value="100">100 kW+</SelectItem>
                <SelectItem value="200">200 kW+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {filteredStations.length} Stations
              </h2>
              {(searchCity || chargerType !== "all" || minPower !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchCity("");
                    setChargerType("all");
                    setMinPower("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear
                </Button>
              )}
            </div>

            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                {filteredStations.map((station) => (
                  <Link key={station.id} href={`/stations/${station.id}`}>
                    <Card className="hover-elevate cursor-pointer" data-testid={`card-station-${station.id}`}>
                      <CardContent className="p-4 space-y-3">
                        {station.imageUrl && (
                          <img
                            src={station.imageUrl}
                            alt={station.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        )}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-1">{station.name}</h3>
                            {station.rating && (
                              <Badge variant="secondary" className="shrink-0">
                                <Star size={12} className="mr-1 fill-primary text-primary" />
                                {station.rating}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {station.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{station.city}, {station.state}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">
                              <Zap size={12} className="mr-1" />
                              {station.chargerType}
                            </Badge>
                            <Badge variant="outline">
                              {station.powerOutput} kW
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-2xl font-bold text-primary">₹{station.pricePerHour}/hr</span>
                            <Badge variant={station.availableSlots > 0 ? "default" : "destructive"}>
                              {station.availableSlots} slots
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          {filteredStations.length > 0 ? (
            <MapContainer center={mapCenter} zoom={searchCity ? 12 : 11} className="h-full w-full">
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[parseFloat(station.latitude), parseFloat(station.longitude)]}
                >
                  <Popup>
                    <div className="space-y-2 p-1">
                      <h3 className="font-semibold text-sm">{station.name}</h3>
                      <p className="text-xs">{station.address}</p>
                      <p className="text-xs font-bold text-primary">₹{station.pricePerHour}/hr</p>
                      <Link href={`/stations/${station.id}`}>
                        <Button size="sm" className="w-full text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground font-medium">No stations found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
