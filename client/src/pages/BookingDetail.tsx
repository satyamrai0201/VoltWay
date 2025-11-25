import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { MapPin, Zap, Clock, Calendar, ArrowLeft, CreditCard, Phone, Car, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import type { Booking, Station } from "@shared/schema";
import { Link } from "wouter";

export default function BookingDetail() {
  const [, params] = useRoute("/bookings/:id");
  const bookingId = params?.id || "";

  const { data: booking, isLoading: bookingLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  const { data: stations } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  const station = booking && stations?.find((s) => s.id === booking.stationId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default">
            <CheckCircle size={14} className="mr-1" /> Confirmed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="bg-blue-600">
            <Zap size={14} className="mr-1" /> Charging
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary">
            <CheckCircle size={14} className="mr-1" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle size={14} className="mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle size={14} className="mr-1" /> Pending
          </Badge>
        );
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

  if (bookingLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <Navigation />
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Booking not found</h2>
          <Link href="/bookings">
            <Button>View All Bookings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-8">
          <Link href="/bookings">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowLeft size={18} />
              Back to Bookings
            </Button>
          </Link>

          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold" data-testid="heading-booking-station">
                {station?.name || "Charging Station"}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={20} />
                <span className="text-lg">
                  {station?.address}, {station?.city}, {station?.state}
                </span>
              </div>
            </div>

            {station?.imageUrl && (
              <img
                src={station.imageUrl}
                alt={station.name}
                className="w-full h-96 object-cover rounded-3xl"
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Booking Status</p>
                    <div>{getStatusBadge(booking.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <div>{getPaymentBadge(booking.paymentStatus)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={16} />
                      <span>Start Date & Time</span>
                    </div>
                    <p className="text-lg font-semibold" data-testid="text-start-time">
                      {format(new Date(booking.startTime), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>End Date & Time</span>
                    </div>
                    <p className="text-lg font-semibold" data-testid="text-end-time">
                      {format(new Date(booking.endTime), "MMM dd, yyyy 'at' hh:mm a")}
                    </p>
                  </div>
                </div>

                {booking.vehicleModel && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Car size={16} />
                        <span>Vehicle Model</span>
                      </div>
                      <p className="text-lg font-semibold" data-testid="text-vehicle-model">
                        {booking.vehicleModel}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Station Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Charger Type</p>
                    <p className="font-semibold">{station?.chargerType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Power Output</p>
                    <p className="font-semibold">{station?.powerOutput} kW</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price Per Hour</p>
                    <p className="font-semibold text-primary">₹{station?.pricePerHour}/hr</p>
                  </div>
                  {station?.amenities && station.amenities.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">Amenities</p>
                      <p className="font-semibold">{station.amenities.join(", ")}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-3xl font-bold text-primary" data-testid="text-total-price">
                    ₹{booking.totalPrice}
                  </span>
                </div>
              </CardContent>
            </Card>

            {booking.paymentIntentId && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      Payment ID: <span className="font-mono text-xs">{booking.paymentIntentId}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
