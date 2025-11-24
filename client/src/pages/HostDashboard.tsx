import { useQuery } from "@tanstack/react-query";
import { Plus, MapPin, Zap, DollarSign, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Station, Booking } from "@shared/schema";
import { Link } from "wouter";

export default function HostDashboard() {
  const { user } = useAuth();

  const { data: stations, isLoading: stationsLoading } = useQuery<Station[]>({
    queryKey: ["/api/host", user?.id, "stations"],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const myStations = stations || [];
  const totalStations = myStations.length;
  const totalSlots = myStations.reduce((sum, s) => sum + s.availableSlots, 0);
  const averageRating = myStations.length > 0
    ? (myStations.reduce((sum, s) => sum + (parseFloat(s.rating || "0")), 0) / myStations.length).toFixed(1)
    : "0";
  
  // Calculate revenue from bookings for this host's stations
  const myStationIds = new Set(myStations.map(s => s.id));
  const hostBookings = bookings.filter(b => myStationIds.has(b.stationId) && b.paymentStatus === "paid");
  const totalRevenue = hostBookings.length > 0
    ? `₹${hostBookings.reduce((sum, b) => sum + (parseFloat(b.totalPrice) || 0), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
    : "₹0";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold" data-testid="heading-host-dashboard">
                Host Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage your charging stations
              </p>
            </div>
            <Link href="/host/new">
              <Button size="lg" className="gap-2" data-testid="button-add-station">
                <Plus size={20} />
                Add Station
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stations</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-total-stations">
                  {stationsLoading ? <Skeleton className="h-8 w-8" /> : totalStations}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all locations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-total-slots">
                  {stationsLoading ? <Skeleton className="h-8 w-8" /> : totalSlots}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Charging points available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-avg-rating">
                  {stationsLoading ? <Skeleton className="h-8 w-8" /> : averageRating}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of 5.0
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid="stat-revenue">
                  {bookingsLoading ? <Skeleton className="h-8 w-12" /> : totalRevenue}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From paid bookings
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Stations</h2>
            {stationsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-48 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myStations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <MapPin size={48} className="mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">No stations yet</h3>
                      <p className="text-muted-foreground">
                        Add your first charging station to start earning
                      </p>
                    </div>
                    <Link href="/host/new">
                      <Button data-testid="button-get-started">
                        <Plus size={18} className="mr-2" />
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myStations.map((station) => (
                  <Card key={station.id} className="hover-elevate" data-testid={`card-station-${station.id}`}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {station.imageUrl && (
                          <img
                            src={station.imageUrl}
                            alt={station.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xl font-semibold line-clamp-1">{station.name}</h3>
                            <Badge variant={station.isActive ? "default" : "secondary"}>
                              {station.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{station.address}, {station.city}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Charger Type</p>
                              <p className="font-medium">{station.chargerType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Power Output</p>
                              <p className="font-medium">{station.powerOutput} kW</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Price/Hour</p>
                              <p className="font-medium text-primary">₹{station.pricePerHour}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Available Slots</p>
                              <p className="font-medium">{station.availableSlots}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4 border-t">
                            <Link href={`/host/edit/${station.id}`} className="flex-1">
                              <Button variant="outline" className="w-full gap-2" data-testid={`button-edit-${station.id}`}>
                                <Edit size={16} />
                                Edit
                              </Button>
                            </Link>
                            <Button variant="outline" className="gap-2" data-testid={`button-delete-${station.id}`}>
                              <Trash2 size={16} />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
