import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MapPin, Zap, DollarSign, Image as ImageIcon, Home, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { insertStationSchema, type Station } from "@shared/schema";
import { z } from "zod";
import { useLocation, useRoute } from "wouter";

interface AddressSuggestion {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: string;
  longitude: string;
}

const formSchema = insertStationSchema.extend({
  latitude: z.string().min(1, "Latitude is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90,
    "Latitude must be a valid number between -90 and 90"
  ),
  longitude: z.string().min(1, "Longitude is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180,
    "Longitude must be a valid number between -180 and 180"
  ),
  pricePerHour: z.string().min(1, "Price is required"),
  isHomeStation: z.boolean().default(false),
});

// RequiredField component - simple red asterisk
function RequiredField() {
  return <span className="text-red-600 font-bold">*</span>;
}

export default function BecomeHost() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Check if editing (from URL params)
  const [isEditRoute] = useRoute("/host/edit/:id");
  const editStationId = isEditRoute ? location.pathname.split("/").pop() : null;

  // Fetch station if editing
  const { data: existingStation, isLoading: isLoadingStation } = useQuery<Station>({
    queryKey: [`/api/stations/${editStationId}`],
    enabled: !!editStationId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostId: user?.id || "",
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      imageUrl: "",
      chargerType: "",
      powerOutput: 0,
      pricePerHour: "",
      availableSlots: 1,
      isHomeStation: false,
    },
  });

  // Populate form with existing station data when editing
  useEffect(() => {
    if (existingStation) {
      form.reset({
        hostId: existingStation.hostId,
        name: existingStation.name,
        description: existingStation.description,
        address: existingStation.address,
        city: existingStation.city,
        state: existingStation.state,
        zipCode: existingStation.zipCode,
        latitude: existingStation.latitude,
        longitude: existingStation.longitude,
        imageUrl: existingStation.imageUrl || "",
        chargerType: existingStation.chargerType,
        powerOutput: existingStation.powerOutput,
        pricePerHour: existingStation.pricePerHour,
        availableSlots: existingStation.availableSlots,
        isHomeStation: existingStation.isHomeStation,
      });
      setAmenities(existingStation.amenities || []);
    }
  }, [existingStation, form]);

  const addressValue = form.watch("address");
  const zipCodeValue = form.watch("zipCode");

  // Fetch address suggestions from Nominatim
  useEffect(() => {
    if (addressValue.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setIsLoadingAddress(true);
    const fetchAddressSuggestions = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressValue)}&countrycodes=in&format=json&limit=8&addressdetails=1`
        );
        const data = await response.json();

        const suggestions: AddressSuggestion[] = data.map((item: any) => {
          const address = item.address || {};
          return {
            address: item.display_name.split(',').slice(0, 2).join(', '),
            city: address.city || address.town || address.county || address.municipality || "",
            state: address.state || "",
            zipCode: address.postcode || "",
            latitude: item.lat,
            longitude: item.lon,
          };
        });

        setAddressSuggestions(suggestions);
        setShowAddressSuggestions(true);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setAddressSuggestions([]);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    const timer = setTimeout(fetchAddressSuggestions, 300);
    return () => clearTimeout(timer);
  }, [addressValue]);

  // Improved: Fetch location details from pincode using reverse geocoding
  useEffect(() => {
    if (zipCodeValue.length < 5) {
      return;
    }

    const fetchLocationFromPincode = async () => {
      try {
        setIsLoadingCoordinates(true);
        
        // Search for the pincode directly
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zipCodeValue)}%20India&countrycodes=in&format=json&limit=1&addressdetails=1`
        );
        const data = await response.json();

        if (data.length > 0) {
          const item = data[0];
          const address = item.address || {};
          
          const city = address.city || address.town || address.county || address.municipality || form.getValues("city");
          const state = address.state || form.getValues("state");
          
          if (city) form.setValue("city", city);
          if (state) form.setValue("state", state);
          form.setValue("latitude", item.lat);
          form.setValue("longitude", item.lon);
        }
      } catch (error) {
        console.error("Error fetching location from pincode:", error);
      } finally {
        setIsLoadingCoordinates(false);
      }
    };

    const timer = setTimeout(fetchLocationFromPincode, 500);
    return () => clearTimeout(timer);
  }, [zipCodeValue, form]);

  const selectAddressSuggestion = (suggestion: AddressSuggestion) => {
    form.setValue("address", suggestion.address);
    form.setValue("city", suggestion.city);
    form.setValue("state", suggestion.state);
    form.setValue("zipCode", suggestion.zipCode);
    form.setValue("latitude", suggestion.latitude);
    form.setValue("longitude", suggestion.longitude);
    setShowAddressSuggestions(false);
  };

  const createOrUpdateStation = useMutation({
    mutationFn: async (data: any) => {
      const url = editStationId ? `/api/stations/${editStationId}` : "/api/stations";
      const method = editStationId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, amenities }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save station");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/host", user?.id, "stations"] });
      if (editStationId) {
        queryClient.invalidateQueries({ queryKey: [`/api/stations/${editStationId}`] });
      }
      toast({
        title: editStationId ? "Station updated!" : "Station created!",
        description: editStationId 
          ? "Your charging station has been updated." 
          : "Your charging station has been listed and is now visible to users.",
      });
      setLocation("/host/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save station",
        description: error.message || "Please check all fields and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (amenities.length === 0) {
      toast({
        title: "Add amenities",
        description: "Please add at least one amenity.",
        variant: "destructive",
      });
      return;
    }
    createOrUpdateStation.mutate(data);
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  if (isLoadingStation) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Navigation />
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navigation />
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold" data-testid="heading-become-host">
              {editStationId ? "Edit Station" : "Become a Host"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {editStationId 
                ? "Update your charging station details." 
                : "List your charging station and start earning. Fields marked with "}<RequiredField />{editStationId ? "" : " are required."}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Station Name
                          <RequiredField />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Downtown Fast Charge Hub"
                            {...field}
                            data-testid="input-station-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Description
                          <RequiredField />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your charging station, location details, and facilities..."
                            {...field}
                            data-testid="textarea-description"
                            className="min-h-24"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              value={field.value || ""}
                              className="pl-10"
                              data-testid="input-image-url"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Address with suggestions */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Address
                          <RequiredField />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                              {isLoadingAddress && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" size={18} />}
                              <Input
                                placeholder="Enter address (e.g., 123 Main Street, Bangalore)"
                                {...field}
                                className="pl-10"
                                autoComplete="off"
                                data-testid="input-address"
                              />
                            </div>
                            {showAddressSuggestions && addressSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg">
                                {addressSuggestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => selectAddressSuggestion(suggestion)}
                                    className="w-full text-left px-4 py-2 hover:bg-accent first:rounded-t-lg last:rounded-b-lg"
                                  >
                                    <div className="font-medium text-sm">{suggestion.address}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Type to search. Select suggestion to auto-fill address, city, state, zipcode & coordinates.
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            City
                            <RequiredField />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Bangalore" {...field} data-testid="input-city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            State
                            <RequiredField />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Karnataka" {...field} data-testid="input-state" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ZIP/Postal Code
                          <RequiredField />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            {isLoadingCoordinates && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" size={18} />}
                            <Input 
                              placeholder="560001" 
                              {...field} 
                              data-testid="input-zip-code"
                              maxLength={10}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Enter pincode to auto-fill city, state & coordinates.
                        </p>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Latitude
                            <RequiredField />
                            {field.value && !isLoadingCoordinates && (
                              <Check size={14} className="inline ml-2 text-green-600" />
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12.9716" 
                              {...field} 
                              data-testid="input-latitude"
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Longitude
                            <RequiredField />
                            {field.value && !isLoadingCoordinates && (
                              <Check size={14} className="inline ml-2 text-green-600" />
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="77.5946" 
                              {...field} 
                              data-testid="input-longitude"
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    📍 Auto-fetched from address or pincode.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Charging Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="chargerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Charger Type
                          <RequiredField />
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-charger-type">
                              <SelectValue placeholder="Select charger type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CCS2">CCS2</SelectItem>
                            <SelectItem value="Type 2">Type 2</SelectItem>
                            <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="powerOutput"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Power Output (kW)
                            <RequiredField />
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                              <Input
                                type="number"
                                placeholder="150"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                className="pl-10"
                                min="1"
                                data-testid="input-power-output"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availableSlots"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Available Slots
                            <RequiredField />
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="4"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              min="1"
                              data-testid="input-available-slots"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pricePerHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price per Hour (₹)
                          <RequiredField />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              type="number"
                              placeholder="299"
                              {...field}
                              className="pl-10"
                              min="1"
                              step="1"
                              data-testid="input-price-per-hour"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <Label>
                      Amenities
                      <RequiredField />
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="WiFi, Cafe, Restroom, etc."
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                        data-testid="input-amenity"
                      />
                      <Button type="button" onClick={addAmenity} variant="outline" data-testid="button-add-amenity">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="cursor-pointer" onClick={() => removeAmenity(amenity)}>
                          {amenity} ×
                        </Badge>
                      ))}
                    </div>
                    {amenities.length === 0 && (
                      <p className="text-xs text-red-600">Add at least one amenity</p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="isHomeStation"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0 pt-4 p-4 border rounded-lg bg-lime-50 dark:bg-lime-950/20">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-home-station"
                          />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="cursor-pointer font-semibold">Mark as Home Station</FormLabel>
                          <p className="text-xs text-muted-foreground mt-1">
                            Home stations feature normal chargers with low rates for community users. This will make your station appear in the Home Stations filter.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
                disabled={createOrUpdateStation.isPending || isLoadingCoordinates}
                data-testid="button-submit"
              >
                {createOrUpdateStation.isPending 
                  ? (editStationId ? "Updating..." : "Creating...") 
                  : (editStationId ? "Update Station" : "List Station & Go Live")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
