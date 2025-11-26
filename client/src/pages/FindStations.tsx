import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Search, Zap, Star, MapPin, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

// Custom lime green marker icon
const createLimeMarker = () => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 border-2 border-lime-600 shadow-lg">
      <div class="w-2 h-2 bg-lime-900 rounded-full"></div>
    </div>`,
    iconSize: [32, 32],
    className: '',
  });
};

// Home station marker icon
const createHomeMarker = () => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 border-2 border-lime-700 shadow-lg ring-2 ring-lime-200">
      <svg class="w-4 h-4 text-lime-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    className: '',
  });
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map controller component to handle bounds fitting
function MapController({ stations }: { stations: Station[] }) {
  const map = useMap();
  const prevStationsRef = useRef<string>("");

  useEffect(() => {
    const validStations = stations.filter(hasValidCoordinates);
    
    if (validStations.length === 0) return;

    // Create a key to detect changes
    const stationKey = validStations.map(s => `${s.id}`).join(',');
    
    // Only update if stations changed
    if (prevStationsRef.current === stationKey) return;
    prevStationsRef.current = stationKey;

    // Build bounds from all station locations
    const bounds = L.latLngBounds(
      validStations.map(station => [
        parseCoordinate(station.latitude),
        parseCoordinate(station.longitude),
      ])
    );

    // Fit bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 0.5,
    });
  }, [stations, map]);

  return null;
}

interface CityTip {
  name: string;
  lat: string;
  lon: string;
}

// Helper function to safely parse coordinates
const parseCoordinate = (value: string | number): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

// Helper function to validate coordinates
const hasValidCoordinates = (station: Station): boolean => {
  const lat = parseCoordinate(station.latitude);
  const lon = parseCoordinate(station.longitude);
  return lat !== 0 && lon !== 0 && !isNaN(lat) && !isNaN(lon);
};

export default function FindStations() {
  const [searchCity, setSearchCity] = useState("");
  const [chargerType, setChargerType] = useState<string>("all");
  const [minPower, setMinPower] = useState<string>("all");
  const [showHomeStationsOnly, setShowHomeStationsOnly] = useState(false);
  const [suggestions, setSuggestions] = useState<CityTip[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: stations, isLoading } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  // Fetch city suggestions from Nominatim API
  useEffect(() => {
    if (searchCity.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // Search for Indian cities using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchCity)}&countrycodes=in&featuretype=city&format=json&limit=10`
        );
        const data = await response.json();
        
        // Extract unique city names
        const uniqueCities = new Map<string, CityTip>();
        data.forEach((item: any) => {
          // Try to get city name from address or use the main name
          const parts = item.address?.city || item.name;
          const cityName = parts ? parts.split(',')[0].trim() : null;
          
          if (cityName && !uniqueCities.has(cityName.toLowerCase())) {
            uniqueCities.set(cityName.toLowerCase(), {
              name: cityName,
              lat: item.lat,
              lon: item.lon,
            });
          }
        });
        
        // If no results, try broader search
        if (uniqueCities.size === 0) {
          const broadResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchCity)}&countrycodes=in&format=json&limit=10`
          );
          const broadData = await broadResponse.json();
          
          broadData.forEach((item: any) => {
            const cityName = item.address?.city || item.address?.town || item.name;
            if (cityName && !uniqueCities.has(cityName.toLowerCase())) {
              uniqueCities.set(cityName.toLowerCase(), {
                name: cityName,
                lat: item.lat,
                lon: item.lon,
              });
            }
          });
        }
        
        setSuggestions(Array.from(uniqueCities.values()).slice(0, 8));
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
    // Skip stations with invalid coordinates
    if (!hasValidCoordinates(station)) {
      return false;
    }
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
    // Filter by home stations only
    if (showHomeStationsOnly && !station.isHomeStation) {
      return false;
    }
    return true;
  });

  // Show popular stations (first 15) when no filters are applied
  const hasActiveFilters = searchCity || chargerType !== "all" || minPower !== "all" || showHomeStationsOnly;
  const displayedStations = hasActiveFilters ? filteredStations : (stations || []).slice(0, 15).filter(hasValidCoordinates);

  // Default map center (Gurgaon)
  const defaultCenter: [number, number] = [28.4595, 77.0266];

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
            {/* Home Stations Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-lime-50 dark:bg-lime-950/20 border border-lime-200 dark:border-lime-800">
              <Checkbox 
                id="home-stations" 
                checked={showHomeStationsOnly}
                onCheckedChange={(checked) => setShowHomeStationsOnly(checked as boolean)}
                data-testid="checkbox-home-stations"
              />
              <label htmlFor="home-stations" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-lime-600 dark:text-lime-400" />
                  <span className="text-sm font-semibold text-foreground">Home Stations Only</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Normal charger • Low rates • Community-hosted</p>
              </label>
            </div>

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
                {hasActiveFilters ? `${filteredStations.length} Results` : "Popular Stations"}
              </h2>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchCity("");
                    setChargerType("all");
                    setMinPower("all");
                    setShowHomeStationsOnly(false);
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
                {displayedStations.map((station) => (
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
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <h3 className="font-semibold line-clamp-1">{station.name}</h3>
                            <div className="flex gap-2 items-start">
                              {station.isHomeStation && (
                                <Badge className="shrink-0 bg-lime-100 dark:bg-lime-900 text-lime-900 dark:text-lime-100 border border-lime-300 dark:border-lime-700">
                                  <Home size={12} className="mr-1" />
                                  Home Station
                                </Badge>
                              )}
                              {station.rating && (
                                <Badge variant="secondary" className="shrink-0">
                                  <Star size={12} className="mr-1 fill-primary text-primary" />
                                  {station.rating}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {station.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{station.city}, {station.state}</span>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <Badge variant="outline">
                              <Zap size={12} className="mr-1" />
                              {station.chargerType}
                            </Badge>
                            <Badge variant="outline">
                              {station.powerOutput} kW
                            </Badge>
                            {station.isHomeStation && (
                              <Badge variant="outline" className="text-lime-600 dark:text-lime-400">
                                Low rates
                              </Badge>
                            )}
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
          {displayedStations.length > 0 ? (
            <MapContainer center={defaultCenter} zoom={11} className="h-full w-full">
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapController stations={displayedStations} />
              {displayedStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[parseCoordinate(station.latitude), parseCoordinate(station.longitude)]}
                  icon={station.isHomeStation ? createHomeMarker() : createLimeMarker()}
                >
                  <Popup>
                    <div className="space-y-2 p-1 max-w-xs">
                      <h3 className="font-semibold text-sm">{station.name}</h3>
                      <p className="text-xs text-muted-foreground">{station.address}</p>
                      {station.isHomeStation && (
                        <p className="text-xs font-semibold text-lime-600">Home Station - Low Rates</p>
                      )}
                      <p className="text-xs font-bold text-primary">₹{station.pricePerHour}/hr</p>
                      <p className="text-xs text-muted-foreground">{station.chargerType} • {station.powerOutput} kW</p>
                      <Link href={`/stations/${station.id}`}>
                        <Button size="sm" className="w-full text-xs mt-2">
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
