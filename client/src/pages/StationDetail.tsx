import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { format, addDays } from "date-fns";
import { MapPin, Zap, Clock, Star, Calendar, ArrowLeft, Check, CreditCard, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Station, Review, Booking } from "@shared/schema";
import { Link } from "wouter";

export default function StationDetail() {
  const [, params] = useRoute("/stations/:id");
  const stationId = params?.id || "";
  const { toast } = useToast();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState("0");

  const { data: station, isLoading: stationLoading } = useQuery<Station>({
    queryKey: ["/api/stations", stationId],
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/stations", stationId, "reviews"],
  });

  const createBooking = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create booking");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking confirmed!",
        description: "Your charging session has been booked successfully.",
      });
      setIsBookingOpen(false);
      setIsPaymentOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setVehicleModel("");
    setSpecialRequests("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setPendingBookingData(null);
    setTotalPrice("0");
  };

  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return format(today, "yyyy-MM-dd");
  };

  const getMaxDate = () => {
    const threeDoysLater = addDays(new Date(), 3);
    threeDoysLater.setHours(23, 59, 59, 999);
    return format(threeDoysLater, "yyyy-MM-dd");
  };

  const validateBooking = () => {
    if (!startDate || !startTime || !endDate || !endTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all booking details.",
        variant: "destructive",
      });
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const maxDate = addDays(new Date(), 3);
    maxDate.setHours(23, 59, 59, 999);

    // Check if start date is in the past
    if (start < today) {
      toast({
        title: "Invalid start date",
        description: "You cannot book in the past.",
        variant: "destructive",
      });
      return null;
    }

    // Check if start date is beyond 3 days
    if (start > maxDate) {
      toast({
        title: "Date too far",
        description: "You can only book up to 3 days in advance.",
        variant: "destructive",
      });
      return null;
    }

    // Check if end date is before start date
    if (endDate < startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be on or after start date.",
        variant: "destructive",
      });
      return null;
    }

    // Check if end time is after start time
    if (endDate === startDate && endTime <= startTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time on the same day.",
        variant: "destructive",
      });
      return null;
    }

    // Check if end date is beyond 3 days
    if (end > maxDate) {
      toast({
        title: "Date too far",
        description: "Booking end date must be within 3 days.",
        variant: "destructive",
      });
      return null;
    }

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const price = (hours * parseFloat(station?.pricePerHour || "0")).toFixed(2);

    return { start, end, hours, price };
  };

  const handleProceedToPayment = () => {
    const validation = validateBooking();
    if (!validation) return;

    const { start, end, hours, price } = validation;

    setPendingBookingData({
      userId: user?.id,
      stationId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      totalPrice: price,
      vehicleModel: vehicleModel || "Not specified",
      specialRequests: specialRequests || "None",
    });
    setTotalPrice(price);
    setIsPaymentOpen(true);
  };

  const handlePayment = () => {
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast({
        title: "Missing payment info",
        description: "Please fill in all card details.",
        variant: "destructive",
      });
      return;
    }

    // Validate card number (simple check)
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        title: "Invalid card number",
        description: "Card number must be 16 digits.",
        variant: "destructive",
      });
      return;
    }

    // Validate expiry format
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      toast({
        title: "Invalid expiry",
        description: "Please use MM/YY format.",
        variant: "destructive",
      });
      return;
    }

    // Validate CVC
    if (cardCvc.length !== 3) {
      toast({
        title: "Invalid CVC",
        description: "CVC must be 3 digits.",
        variant: "destructive",
      });
      return;
    }

    // Process payment (demo)
    toast({
      title: "Processing payment...",
      description: "Please wait while we process your payment.",
    });

    // Simulate payment processing
    setTimeout(() => {
      createBooking.mutate(pendingBookingData);
    }, 1500);
  };

  if (stationLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Station not found</h2>
          <Link href="/find-stations">
            <Button>Browse Stations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="space-y-8">
          <Link href="/find-stations">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowLeft size={18} />
              Back to Stations
            </Button>
          </Link>

          {station.imageUrl && (
            <img
              src={station.imageUrl}
              alt={station.name}
              className="w-full h-96 object-cover rounded-3xl"
            />
          )}

          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-5xl font-bold" data-testid="heading-station-name">
                {station.name}
              </h1>
              {station.rating && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <Star size={16} className="mr-1 fill-primary text-primary" />
                    {station.rating}
                  </Badge>
                  <span className="text-muted-foreground">
                    ({station.totalReviews} reviews)
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={20} />
                <span className="text-lg">
                  {station.address}, {station.city}, {station.state} {station.zipCode}
                </span>
              </div>
            </div>

            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2" data-testid="button-book-now">
                  <Calendar size={20} />
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Book Charging Session</DialogTitle>
                  <DialogDescription>
                    Schedule your charging session at {station.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      📅 You can book up to <strong>3 days</strong> in advance
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={getMinDate()}
                        max={getMaxDate()}
                        data-testid="input-start-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        data-testid="input-start-time"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || getMinDate()}
                        max={getMaxDate()}
                        data-testid="input-end-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        data-testid="input-end-time"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle">Vehicle Model (Optional)</Label>
                    <Input
                      id="vehicle"
                      placeholder="Tesla Model 3, Tata Nexon EV, etc."
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      data-testid="input-vehicle-model"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <Textarea
                      id="requests"
                      placeholder="Any special requirements..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      data-testid="textarea-special-requests"
                    />
                  </div>
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full"
                    data-testid="button-proceed-payment"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Payment Dialog */}
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Demo
                </DialogTitle>
                <DialogDescription>
                  Complete your booking for {station.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Order Summary */}
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount due:</span>
                    <span className="font-semibold text-lg text-primary">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\s/g, "");
                        val = val.replace(/(.{4})/g, "$1 ").trim();
                        setCardNumber(val);
                      }}
                      maxLength={19}
                      data-testid="input-card-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                      <Input
                        id="expiry"
                        placeholder="12/25"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length >= 2) {
                            val = val.slice(0, 2) + "/" + val.slice(2, 4);
                          }
                          setCardExpiry(val);
                        }}
                        maxLength={5}
                        data-testid="input-card-expiry"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        maxLength={3}
                        data-testid="input-card-cvc"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock size={16} />
                  <span>Secure payment</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsPaymentOpen(false)}
                    className="flex-1"
                    data-testid="button-cancel-payment"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={createBooking.isPending}
                    className="flex-1"
                    data-testid="button-pay-now"
                  >
                    {createBooking.isPending ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">{station.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap size={18} />
                    <span className="text-sm">Charger Type</span>
                  </div>
                  <p className="text-xl font-semibold">{station.chargerType}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Zap size={18} />
                    <span className="text-sm">Power Output</span>
                  </div>
                  <p className="text-xl font-semibold">{station.powerOutput} kW</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={18} />
                    <span className="text-sm">Price</span>
                  </div>
                  <p className="text-xl font-semibold text-primary">
                    ₹{station.pricePerHour}/hr
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check size={18} />
                    <span className="text-sm">Slots</span>
                  </div>
                  <p className="text-xl font-semibold">{station.availableSlots} available</p>
                </div>
              </div>

              {station.amenities && station.amenities.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {station.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews ({reviews?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="space-y-2 pb-4 border-b last:border-b-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Star size={12} className="mr-1 fill-primary text-primary" />
                        {review.rating}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
