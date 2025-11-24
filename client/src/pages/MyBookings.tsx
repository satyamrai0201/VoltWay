import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Clock, MapPin, Zap, CreditCard, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Booking, Station } from "@shared/schema";
import { Link } from "wouter";

interface BookingWithStation extends Booking {
  station?: Station;
}

export default function MyBookings() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings/user", user?.id],
    enabled: !!user,
  });

  const { data: stations } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  const bookingsWithStations: BookingWithStation[] = (bookings || []).map((booking) => ({
    ...booking,
    station: stations?.find((s) => s.id === booking.stationId),
  }));

  const activeBookings = bookingsWithStations.filter(
    (b) => b.status === "confirmed" || b.status === "in-progress"
  );
  const pastBookings = bookingsWithStations.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default"><CheckCircle size={12} className="mr-1" /> Confirmed</Badge>;
      case "in-progress":
        return <Badge variant="default" className="bg-primary"><Zap size={12} className="mr-1" /> Charging</Badge>;
      case "completed":
        return <Badge variant="secondary"><CheckCircle size={12} className="mr-1" /> Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle size={12} className="mr-1" /> Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="default">Paid</Badge>;
      case "pending":
        return <Badge variant="outline">Payment Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Payment Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Please log in to view bookings</h2>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const BookingCard = ({ booking }: { booking: BookingWithStation }) => (
    <Card className="hover-elevate" data-testid={`card-booking-${booking.id}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {booking.station?.imageUrl && (
            <img
              src={booking.station.imageUrl}
              alt={booking.station.name}
              className="w-full md:w-48 h-32 object-cover rounded-lg"
            />
          )}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1" data-testid={`text-station-name-${booking.id}`}>
                  {booking.station?.name || "Station"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{booking.station?.address}, {booking.station?.city}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getStatusBadge(booking.status)}
                {getPaymentBadge(booking.paymentStatus)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>Start</span>
                </div>
                <p className="font-medium">
                  {format(new Date(booking.startTime), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={14} />
                  <span>End</span>
                </div>
                <p className="font-medium">
                  {format(new Date(booking.endTime), "MMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
            </div>

            {booking.vehicleModel && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap size={14} />
                  <span>Vehicle</span>
                </div>
                <p className="font-medium">{booking.vehicleModel}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard size={14} />
                  <span>Total Amount</span>
                </div>
                <p className="text-2xl font-bold text-primary">₹{booking.totalPrice}</p>
              </div>
              <Link href={`/bookings/${booking.id}`}>
                <Button variant="outline" data-testid={`button-view-details-${booking.id}`}>
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold" data-testid="heading-my-bookings">
              My Bookings
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your charging sessions
            </p>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active" data-testid="tab-active">
                Active ({activeBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past" data-testid="tab-past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {isLoading ? (
                <>
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-48 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : activeBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                      <Calendar size={48} className="mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">No active bookings</h3>
                        <p className="text-muted-foreground">
                          Book a charging station to get started
                        </p>
                      </div>
                      <Link href="/find-stations">
                        <Button data-testid="button-find-stations">
                          Find Stations
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                activeBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {isLoading ? (
                <>
                  {[1, 2].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-48 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : pastBookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="space-y-4">
                      <Clock size={48} className="mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">No past bookings</h3>
                        <p className="text-muted-foreground">
                          Your completed bookings will appear here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                pastBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
