import { 
  type User, 
  type InsertUser,
  type Station,
  type InsertStation,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  getAllStations(): Promise<Station[]>;
  getStation(id: string): Promise<Station | undefined>;
  getStationsByHost(hostId: string): Promise<Station[]>;
  createStation(station: InsertStation): Promise<Station>;
  updateStation(id: string, station: Partial<Station>): Promise<Station | undefined>;
  deleteStation(id: string): Promise<boolean>;
  searchStations(params: { city?: string; chargerType?: string; minPower?: number }): Promise<Station[]>;
  
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByStation(stationId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | undefined>;
  
  getReviewsByStation(stationId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stations: Map<string, Station>;
  private bookings: Map<string, Booking>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.stations = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.seedData();
  }

  private seedData() {
    const sampleUsers: User[] = [
      {
        id: "sample-user-1",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        avatarUrl: null,
        phoneNumber: "+91 98765 43210",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-host-1",
        email: "host1@voltway.com",
        firstName: "Alice",
        lastName: "Green",
        avatarUrl: null,
        phoneNumber: "+91 98765 12345",
        isHost: true,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-host-2",
        email: "host2@voltway.com",
        firstName: "Bob",
        lastName: "Smith",
        avatarUrl: null,
        phoneNumber: "+91 98765 67890",
        isHost: true,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    const sampleStations: Station[] = [
      {
        id: "station-1",
        hostId: "sample-host-1",
        name: "Downtown Fast Charge Hub",
        description: "High-speed DC charging in the heart of the city. Perfect for quick top-ups while shopping or dining.",
        address: "123 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        latitude: "12.9716",
        longitude: "77.5946",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "CCS2",
        powerOutput: 150,
        pricePerHour: "299.00",
        availableSlots: 4,
        amenities: ["WiFi", "Cafe", "Restroom", "Covered Parking"],
        isActive: true,
        rating: "4.80",
        totalReviews: 156,
        createdAt: new Date(),
      },
      {
        id: "station-2",
        hostId: "sample-host-2",
        name: "Airport Express Charging",
        description: "Ultra-fast charging station near the airport. Get fully charged before your journey.",
        address: "Terminal 2, Airport Road",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400099",
        latitude: "19.0896",
        longitude: "72.8656",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "CCS2",
        powerOutput: 350,
        pricePerHour: "499.00",
        availableSlots: 8,
        amenities: ["WiFi", "Lounge", "Food Court", "Security"],
        isActive: true,
        rating: "4.90",
        totalReviews: 284,
        createdAt: new Date(),
      },
      {
        id: "station-3",
        hostId: "sample-host-1",
        name: "Green Valley Eco Station",
        description: "Solar-powered charging station in a peaceful environment. Relax while your EV charges.",
        address: "45 Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560034",
        latitude: "12.9352",
        longitude: "77.6245",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "Type 2",
        powerOutput: 22,
        pricePerHour: "149.00",
        availableSlots: 2,
        amenities: ["Garden", "WiFi", "Solar Panels"],
        isActive: true,
        rating: "4.60",
        totalReviews: 89,
        createdAt: new Date(),
      },
    ];

    sampleStations.forEach(station => {
      this.stations.set(station.id, station);
    });

    const sampleBookings: Booking[] = [
      {
        id: "booking-1",
        userId: "sample-user-1",
        stationId: "station-1",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        status: "confirmed",
        totalPrice: "598.00",
        paymentStatus: "paid",
        paymentIntentId: "pi_mock_123",
        vehicleModel: "Tesla Model 3",
        specialRequests: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "booking-2",
        userId: "sample-user-1",
        stationId: "station-2",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        status: "completed",
        totalPrice: "1497.00",
        paymentStatus: "paid",
        paymentIntentId: "pi_mock_456",
        vehicleModel: "Tata Nexon EV",
        specialRequests: null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleBookings.forEach(booking => {
      this.bookings.set(booking.id, booking);
    });

    const sampleReviews: Review[] = [
      {
        id: "review-1",
        bookingId: "booking-2",
        userId: "sample-user-1",
        stationId: "station-2",
        rating: 5,
        comment: "Excellent charging station! Fast and convenient location near the airport.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-2",
        bookingId: "booking-1",
        userId: "sample-user-1",
        stationId: "station-1",
        rating: 4,
        comment: "Great location in the city center. Would have been 5 stars if WiFi was faster.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleReviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      email: insertUser.email,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      avatarUrl: insertUser.avatarUrl ?? null,
      phoneNumber: insertUser.phoneNumber ?? null,
      id,
      isHost: insertUser.isHost ?? false,
      stripeCustomerId: insertUser.stripeCustomerId ?? null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllStations(): Promise<Station[]> {
    return Array.from(this.stations.values()).filter(s => s.isActive);
  }

  async getStation(id: string): Promise<Station | undefined> {
    return this.stations.get(id);
  }

  async getStationsByHost(hostId: string): Promise<Station[]> {
    return Array.from(this.stations.values()).filter(s => s.hostId === hostId);
  }

  async createStation(insertStation: InsertStation): Promise<Station> {
    const id = randomUUID();
    const station: Station = {
      hostId: insertStation.hostId,
      name: insertStation.name,
      description: insertStation.description,
      address: insertStation.address,
      city: insertStation.city,
      state: insertStation.state,
      zipCode: insertStation.zipCode,
      latitude: insertStation.latitude,
      longitude: insertStation.longitude,
      imageUrl: insertStation.imageUrl ?? null,
      chargerType: insertStation.chargerType,
      powerOutput: insertStation.powerOutput,
      pricePerHour: insertStation.pricePerHour,
      availableSlots: insertStation.availableSlots ?? 1,
      amenities: insertStation.amenities ?? null,
      id,
      isActive: insertStation.isActive ?? true,
      rating: null,
      totalReviews: 0,
      createdAt: new Date(),
    };
    this.stations.set(id, station);
    return station;
  }

  async updateStation(id: string, updates: Partial<Station>): Promise<Station | undefined> {
    const station = this.stations.get(id);
    if (!station) return undefined;
    const updated = { ...station, ...updates };
    this.stations.set(id, updated);
    return updated;
  }

  async deleteStation(id: string): Promise<boolean> {
    return this.stations.delete(id);
  }

  async searchStations(params: { city?: string; chargerType?: string; minPower?: number }): Promise<Station[]> {
    let results = Array.from(this.stations.values()).filter(s => s.isActive);
    
    if (params.city) {
      results = results.filter(s => s.city.toLowerCase().includes(params.city!.toLowerCase()));
    }
    if (params.chargerType) {
      results = results.filter(s => s.chargerType === params.chargerType);
    }
    if (params.minPower) {
      results = results.filter(s => s.powerOutput >= params.minPower!);
    }
    
    return results;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBookingsByStation(stationId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.stationId === stationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const user = await this.getUser(insertBooking.userId);
    if (!user) throw new Error("User not found");
    
    const station = await this.getStation(insertBooking.stationId);
    if (!station) throw new Error("Station not found");
    
    if (station.availableSlots <= 0) throw new Error("No available slots");
    
    const id = randomUUID();
    const booking: Booking = {
      userId: insertBooking.userId,
      stationId: insertBooking.stationId,
      startTime: insertBooking.startTime,
      endTime: insertBooking.endTime,
      totalPrice: insertBooking.totalPrice,
      paymentIntentId: insertBooking.paymentIntentId ?? null,
      vehicleModel: insertBooking.vehicleModel ?? null,
      specialRequests: insertBooking.specialRequests ?? null,
      id,
      status: insertBooking.status ?? "confirmed",
      paymentStatus: insertBooking.paymentStatus ?? "paid",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(id, booking);
    
    // Decrement available slots
    await this.updateStation(insertBooking.stationId, {
      availableSlots: station.availableSlots - 1,
    });
    
    return booking;
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  async getReviewsByStation(stationId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(r => r.stationId === stationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const booking = await this.getBooking(insertReview.bookingId);
    if (!booking) throw new Error("Booking not found");
    
    const user = await this.getUser(insertReview.userId);
    if (!user) throw new Error("User not found");
    
    const station = await this.getStation(insertReview.stationId);
    if (!station) throw new Error("Station not found");
    
    const id = randomUUID();
    const review: Review = {
      bookingId: insertReview.bookingId,
      userId: insertReview.userId,
      stationId: insertReview.stationId,
      rating: insertReview.rating,
      comment: insertReview.comment ?? null,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    
    const reviews = await this.getReviewsByStation(insertReview.stationId);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.updateStation(insertReview.stationId, {
      rating: avgRating.toFixed(2),
      totalReviews: reviews.length,
    });
    
    return review;
  }
}

export const storage = new MemStorage();
