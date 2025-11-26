import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { format, addDays } from "date-fns";
import { MapPin, Zap, Clock, Star, Calendar, ArrowLeft, Check, CreditCard, Lock, Home } from "lucide-react";
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
import Navigation from "@/components/Navigation";
import type { Station, Review, Booking } from "@shared/schema";
import { Link } from "wouter";

export default function StationDetail() {
  const [, params] = useRoute("/stations/:id");
  const [, navigate] = useLocation();
  const stationId = params?.id || "";
  const { toast } = useToast();
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<3 | 6 | 9 | 12 | "custom" | null>(null);
  const [endTime, setEndTime] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const [totalPrice, setTotalPrice] = useState("0");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState<5 | 4 | 3 | 2 | 1>(5);
  const [reviewComment, setReviewComment] = useState("");

  const packages = [
    { hours: 3, label: "3 Hours" },
    { hours: 6, label: "6 Hours" },
    { hours: 9, label: "9 Hours" },
    { hours: 12, label: "12 Hours" },
  ];

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: "💳" },
    { id: "upi", label: "UPI", icon: "📱" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
    { id: "wallet", label: "Digital Wallet", icon: "👛" },
  ] as const;

  const { data: station, isLoading: stationLoading } = useQuery<Station>({
    queryKey: ["/api/stations", stationId],
  });

  const { data: reviews } = useQuery<(Review & { userName?: string })[]>({
    queryKey: ["/api/stations", stationId, "reviews"],
  });

  const submitReview = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stations", stationId, "reviews"] });
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
      setIsReviewOpen(false);
      setReviewRating(5);
      setReviewComment("");
    },
    onError: () => {
      toast({
        title: "Failed to submit review",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
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
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user", user?.id] });
      setIsProcessing(false);
      
      // Close dialog immediately
      setIsPaymentOpen(false);
      setIsBookingOpen(false);
      
      // Show animation after dialog fully closes (dialog has 300ms close animation)
      setTimeout(() => {
        setIsPaymentSuccess(true);
        
        // Auto-redirect to bookings after 3 seconds
        setTimeout(() => {
          resetForm();
          setIsPaymentSuccess(false);
          navigate("/bookings");
        }, 3000);
      }, 350);
    },
    onError: () => {
      setIsProcessing(false);
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
    setSelectedPackage(null);
    setEndTime("");
    setVehicleModel("");
    setSpecialRequests("");
    setPaymentMethod("card");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setUpiId("");
    setBankName("");
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

  const calculateEndTime = (start: Date, hours: number) => {
    const end = new Date(start);
    end.setHours(end.getHours() + hours);
    return end;
  };

  const validateBooking = () => {
    if (!startDate || !startTime || selectedPackage === null) {
      toast({
        title: "Missing information",
        description: "Please select date, time, and package.",
        variant: "destructive",
      });
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(`${startDate}T${startTime}`);
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

    // Get hours from package
    let hours = 0;
    if (selectedPackage === "custom") {
      if (!endTime) {
        toast({
          title: "Missing end time",
          description: "Please specify end time for custom booking.",
          variant: "destructive",
        });
        return null;
      }
      const end = new Date(`${startDate}T${endTime}`);
      if (end <= start) {
        toast({
          title: "Invalid time range",
          description: "End time must be after start time.",
          variant: "destructive",
        });
        return null;
      }
      hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    } else {
      hours = selectedPackage;
    }

    const end = calculateEndTime(start, hours);

    // Check if end date is beyond 3 days
    if (end > maxDate) {
      toast({
        title: "Booking too long",
        description: "Booking cannot extend beyond 3 days from now.",
        variant: "destructive",
      });
      return null;
    }

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
    if (paymentMethod === "card") {
      if (!cardNumber || !cardExpiry || !cardCvc) {
        toast({
          title: "Missing payment info",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast({
          title: "Invalid card number",
          description: "Card number must be 16 digits.",
          variant: "destructive",
        });
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        toast({
          title: "Invalid expiry",
          description: "Please use MM/YY format.",
          variant: "destructive",
        });
        return;
      }
      if (cardCvc.length !== 3) {
        toast({
          title: "Invalid CVC",
          description: "CVC must be 3 digits.",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        toast({
          title: "UPI ID required",
          description: "Please enter your UPI ID.",
          variant: "destructive",
        });
        return;
      }
      if (!upiId.includes("@")) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., user@upi).",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "netbanking") {
      if (!bankName.trim()) {
        toast({
          title: "Bank not selected",
          description: "Please select your bank.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
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
              <div className="flex items-center gap-2 flex-wrap">
                {station.isHomeStation && (
                  <Badge className="bg-lime-100 dark:bg-lime-900 text-lime-900 dark:text-lime-100 border border-lime-300 dark:border-lime-700">
                    <Home size={14} className="mr-1" />
                    Home Station
                  </Badge>
                )}
                {station.rating && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <Star size={16} className="mr-1 fill-primary text-primary" />
                    {station.rating}
                  </Badge>
                )}
                {station.rating && (
                  <span className="text-muted-foreground">
                    ({station.totalReviews} reviews)
                  </span>
                )}
              </div>
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
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Book Charging Session</DialogTitle>
                  <DialogDescription>
                    Select a package and time for {station.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      📅 Book up to <strong>3 days</strong> in advance
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

                  <div className="space-y-2">
                    <Label>Select Package</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {packages.map((pkg) => (
                        <Button
                          key={pkg.hours}
                          variant={selectedPackage === pkg.hours ? "default" : "outline"}
                          onClick={() => setSelectedPackage(pkg.hours as any)}
                          className="text-center"
                          data-testid={`button-package-${pkg.hours}`}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{pkg.label}</span>
                            <span className="text-xs">
                              ₹{((pkg.hours * parseFloat(station?.pricePerHour || "0"))).toFixed(0)}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant={selectedPackage === "custom" ? "default" : "outline"}
                    onClick={() => setSelectedPackage("custom")}
                    className="w-full"
                    data-testid="button-custom-package"
                  >
                    Custom Duration
                  </Button>

                  {selectedPackage === "custom" && (
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="custom-end-time">End Time</Label>
                      <Input
                        id="custom-end-time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        data-testid="input-custom-end-time"
                      />
                    </div>
                  )}

                  {selectedPackage && selectedPackage !== "custom" && (
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        Duration: <strong>{selectedPackage} hours</strong>
                      </p>
                    </div>
                  )}

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
                    disabled={!selectedPackage}
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
                  Select Payment Method
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

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        onClick={() => setPaymentMethod(method.id)}
                        className="flex flex-col items-center gap-1 py-3 h-auto"
                        data-testid={`button-payment-${method.id}`}
                      >
                        <span className="text-lg">{method.icon}</span>
                        <span className="text-xs text-center">{method.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-3 border-t pt-4">
                  {paymentMethod === "card" && (
                    <>
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
                    </>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        data-testid="input-upi-id"
                      />
                      <p className="text-xs text-muted-foreground">
                        Format: yourname@bankname (e.g., user@paytm, user@googlepay)
                      </p>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="space-y-2">
                      <Label htmlFor="bank-select">Select Your Bank</Label>
                      <select
                        id="bank-select"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        data-testid="select-bank"
                      >
                        <option value="">-- Choose a bank --</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="SBI">State Bank of India</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="KOTAK">Kotak Mahindra Bank</option>
                        <option value="IDBI">IDBI Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === "wallet" && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        Supported wallets: Google Pay, PhonePe, PayTM, Amazon Pay
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock size={16} />
                  <span>Secure payment</span>
                </div>

                {/* Processing State */}
                {isProcessing && (
                  <div className="space-y-4">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">Processing your payment...</p>
                  </div>
                )}

                {/* Action Buttons */}
                {!isProcessing && (
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
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Payment Success Screen */}
          {isPaymentSuccess && (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-50 animate-in fade-in duration-300">
              <style>{`
                @keyframes scaleCheckmark {
                  0% {
                    transform: scale(0);
                    opacity: 0;
                  }
                  100% {
                    transform: scale(1);
                    opacity: 1;
                  }
                }
                
                @keyframes fadeInUp {
                  0% {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
              
              <div className="max-w-md w-full mx-4 text-center space-y-6">
                {/* Checkmark Icon */}
                <div style={{ animation: "scaleCheckmark 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                    <circle cx="40" cy="40" r="38" fill="none" stroke="#CCFF00" strokeWidth="2" />
                    <path
                      d="M 25 40 L 35 50 L 55 30"
                      fill="none"
                      stroke="#CCFF00"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Title */}
                <div style={{ animation: "fadeInUp 0.5s ease-out forwards 0.2s", opacity: 0 }}>
                  <h1 className="text-3xl font-bold text-foreground">Payment Successful</h1>
                  <p className="text-muted-foreground mt-2">Thank you for your booking!</p>
                </div>

                {/* Details Card */}
                <div 
                  style={{ animation: "fadeInUp 0.5s ease-out forwards 0.4s", opacity: 0 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-semibold text-foreground">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date & Time:</span>
                    <span className="font-semibold text-foreground">{format(new Date(), "MMM dd, yyyy, hh:mm a")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference Number:</span>
                    <span className="font-semibold text-foreground font-mono">{pendingBookingData?.stationId?.slice(0, 10)}</span>
                  </div>
                </div>

                {/* Redirect Message */}
                <p className="text-xs text-muted-foreground/70">Redirecting to your bookings...</p>
              </div>
            </div>
          )}

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Reviews ({reviews?.length || 0})</CardTitle>
              <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" data-testid="button-add-review">
                    <Star size={16} />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                      {user ? `Sharing as ${user.firstName} ${user.lastName}` : "Share your experience at " + (station?.name || "this station")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex gap-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setReviewRating(rating as 5 | 4 | 3 | 2 | 1)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              reviewRating === rating
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }`}
                            data-testid={`button-rating-${rating}`}
                          >
                            <div className="flex items-center gap-1">
                              <Star size={14} className={reviewRating === rating ? "fill-current" : ""} />
                              {rating}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review-comment">Comment (Optional)</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share your experience..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="resize-none"
                        data-testid="input-review-comment"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (!user) {
                          toast({
                            title: "Please log in",
                            description: "You need to be logged in to submit a review.",
                            variant: "destructive",
                          });
                          return;
                        }
                        submitReview.mutate({
                          bookingId: "booking-1",
                          userId: user.id,
                          stationId: stationId,
                          rating: reviewRating,
                          comment: reviewComment || null,
                        });
                      }}
                      disabled={submitReview.isPending}
                      className="w-full"
                      data-testid="button-submit-review"
                    >
                      {submitReview.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="space-y-2 pb-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Star size={12} className="mr-1 fill-primary text-primary" />
                          {review.rating}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(review.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {review.userName && (
                        <span className="text-sm font-medium text-foreground">{review.userName}</span>
                      )}
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
