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
  getAllBookings(): Promise<Booking[]>;
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
      {
        id: "sample-user-2",
        email: "rajesh.kumar@example.com",
        firstName: "Rajesh",
        lastName: "Kumar",
        avatarUrl: null,
        phoneNumber: "+91 99876 54321",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-3",
        email: "priya.sharma@example.com",
        firstName: "Priya",
        lastName: "Sharma",
        avatarUrl: null,
        phoneNumber: "+91 98765 11111",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-4",
        email: "amit.patel@example.com",
        firstName: "Amit",
        lastName: "Patel",
        avatarUrl: null,
        phoneNumber: "+91 97654 22222",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-5",
        email: "sneha.gupta@example.com",
        firstName: "Sneha",
        lastName: "Gupta",
        avatarUrl: null,
        phoneNumber: "+91 96543 33333",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-6",
        email: "arjun.singh@example.com",
        firstName: "Arjun",
        lastName: "Singh",
        avatarUrl: null,
        phoneNumber: "+91 95432 44444",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-7",
        email: "ananya.desai@example.com",
        firstName: "Ananya",
        lastName: "Desai",
        avatarUrl: null,
        phoneNumber: "+91 94321 55555",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-8",
        email: "vikram.reddy@example.com",
        firstName: "Vikram",
        lastName: "Reddy",
        avatarUrl: null,
        phoneNumber: "+91 93210 66666",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-9",
        email: "meera.nair@example.com",
        firstName: "Meera",
        lastName: "Nair",
        avatarUrl: null,
        phoneNumber: "+91 92109 77777",
        isHost: false,
        stripeCustomerId: null,
        createdAt: new Date(),
      },
      {
        id: "sample-user-10",
        email: "rohan.chatterjee@example.com",
        firstName: "Rohan",
        lastName: "Chatterjee",
        avatarUrl: null,
        phoneNumber: "+91 91098 88888",
        isHost: false,
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
        name: "DLF Cyber Hub Charging",
        description: "Premium fast charging in the heart of DLF Cyber Hub. Perfect for quick top-ups.",
        address: "DLF Cyber Hub, Sector 30, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.4951011",
        longitude: "77.0885127",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "CCS2",
        powerOutput: 150,
        pricePerHour: "299.00",
        availableSlots: 5,
        amenities: ["WiFi", "Cafe", "Restroom", "Covered Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.80",
        totalReviews: 156,
        createdAt: new Date(),
      },
      {
        id: "station-2",
        hostId: "sample-host-2",
        name: "Sector 21 Express Charge",
        description: "Ultra-fast 350kW charging station. Get fully charged in 15 minutes.",
        address: "Plot 123, Sector 21, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122016",
        latitude: "28.5143629",
        longitude: "77.0730087",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "CCS2",
        powerOutput: 350,
        pricePerHour: "499.00",
        availableSlots: 8,
        amenities: ["WiFi", "Lounge", "Cafe", "Security"],
        isActive: true,
        isHomeStation: false,
        rating: "4.90",
        totalReviews: 284,
        createdAt: new Date(),
      },
      {
        id: "station-3",
        hostId: "sample-host-1",
        name: "Ambience Mall Charging",
        description: "Shop & charge. Convenient charging while you enjoy shopping.",
        address: "Ambience Mall, Sector 24, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.5042583",
        longitude: "77.0972049",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "Type 2",
        powerOutput: 22,
        pricePerHour: "149.00",
        availableSlots: 3,
        amenities: ["Shopping", "WiFi", "Restroom", "Parking"],
        isActive: true,
        isHomeStation: true,
        rating: "4.60",
        totalReviews: 89,
        createdAt: new Date(),
      },
      {
        id: "station-4",
        hostId: "sample-host-2",
        name: "Golf Course Road Station",
        description: "Premium charging hub on Golf Course Road. High power & comfort.",
        address: "Golf Course Road, Sector 54, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122003",
        latitude: "28.4440338",
        longitude: "77.1012500",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "CHAdeMO",
        powerOutput: 100,
        pricePerHour: "249.00",
        availableSlots: 6,
        amenities: ["WiFi", "Lounge", "Parking", "Restroom"],
        isActive: true,
        isHomeStation: false,
        rating: "4.75",
        totalReviews: 142,
        createdAt: new Date(),
      },
      {
        id: "station-5",
        hostId: "sample-host-1",
        name: "MG Road Fast Charging",
        description: "Central location charging station. Easy access from all areas.",
        address: "MG Road, Sector 28, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122002",
        latitude: "28.4782131",
        longitude: "77.0717578",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "CCS2",
        powerOutput: 200,
        pricePerHour: "349.00",
        availableSlots: 4,
        amenities: ["WiFi", "Cafe", "Covered Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.70",
        totalReviews: 198,
        createdAt: new Date(),
      },
      {
        id: "station-6",
        hostId: "sample-host-2",
        name: "Sector 18 Eco Charging",
        description: "Solar-powered green charging station. Sustainable energy.",
        address: "Sector 18, Udyog Vihar, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122015",
        latitude: "28.4971745",
        longitude: "77.0813511",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "Type 2",
        powerOutput: 50,
        pricePerHour: "199.00",
        availableSlots: 7,
        amenities: ["Solar Panels", "Garden", "WiFi", "Parking"],
        isActive: true,
        isHomeStation: true,
        rating: "4.65",
        totalReviews: 112,
        createdAt: new Date(),
      },
      {
        id: "station-7",
        hostId: "sample-host-1",
        name: "Rapid Metro Charging Hub",
        description: "Connected to metro stations. Charge while traveling.",
        address: "Rapid Metro Sohna Road, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122018",
        latitude: "28.4241689",
        longitude: "77.1051312",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "CCS2",
        powerOutput: 175,
        pricePerHour: "299.00",
        availableSlots: 5,
        amenities: ["Metro Access", "WiFi", "Food Court", "Restroom"],
        isActive: true,
        isHomeStation: false,
        rating: "4.85",
        totalReviews: 267,
        createdAt: new Date(),
      },
      {
        id: "station-8",
        hostId: "sample-host-2",
        name: "Corporate Park Charging",
        description: "Located in business district. Professional charging facilities.",
        address: "Unitech Cyber Park, Sector 39, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.4428641",
        longitude: "77.0558748",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "Type 2",
        powerOutput: 75,
        pricePerHour: "179.00",
        availableSlots: 6,
        amenities: ["WiFi", "Parking", "Restroom", "Business Lounge"],
        isActive: true,
        isHomeStation: true,
        rating: "4.72",
        totalReviews: 156,
        createdAt: new Date(),
      },
      {
        id: "station-9",
        hostId: "sample-host-1",
        name: "Highway Express Charging",
        description: "Quick charging for highway travelers. Fast & convenient.",
        address: "NH44 Expressway, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122019",
        latitude: "28.4973224",
        longitude: "77.0041710",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "CCS2",
        powerOutput: 300,
        pricePerHour: "449.00",
        availableSlots: 10,
        amenities: ["Cafe", "Restroom", "Food Court", "Shop"],
        isActive: true,
        isHomeStation: false,
        rating: "4.80",
        totalReviews: 223,
        createdAt: new Date(),
      },
      {
        id: "station-10",
        hostId: "sample-host-2",
        name: "Premium Residences Hub",
        description: "Luxury charging for premium residential areas.",
        address: "Sushant Lok, Sector 57, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122003",
        latitude: "28.4207910",
        longitude: "77.0795592",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "Type 2",
        powerOutput: 43,
        pricePerHour: "189.00",
        availableSlots: 4,
        amenities: ["WiFi", "Valet Parking", "Lounge", "Restroom"],
        isActive: true,
        isHomeStation: true,
        rating: "4.88",
        totalReviews: 178,
        createdAt: new Date(),
      },
      {
        id: "station-11",
        hostId: "sample-host-1",
        name: "Commercial Complex Charge",
        description: "Multi-charger station in busy commercial area.",
        address: "World Mark, Sector 12, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.3924110",
        longitude: "76.8985144",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "CCS2",
        powerOutput: 120,
        pricePerHour: "269.00",
        availableSlots: 8,
        amenities: ["WiFi", "Cafe", "Parking", "Restroom"],
        isActive: true,
        isHomeStation: false,
        rating: "4.78",
        totalReviews: 134,
        createdAt: new Date(),
      },
      {
        id: "station-12",
        hostId: "sample-host-2",
        name: "Mall of India Charging",
        description: "Shop & charge convenience. Enjoy shopping while car charges.",
        address: "Mehrauli Gurgaon Road, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122002",
        latitude: "28.4822701",
        longitude: "77.1051062",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "Type 2",
        powerOutput: 60,
        pricePerHour: "159.00",
        availableSlots: 5,
        amenities: ["Shopping Mall", "WiFi", "Food Court", "Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.68",
        totalReviews: 167,
        createdAt: new Date(),
      },
      {
        id: "station-13",
        hostId: "sample-host-1",
        name: "Tech Park Charging Point",
        description: "Dedicated charging for tech workers and startups.",
        address: "Cyber City, Sector 42, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.4973098",
        longitude: "77.0917980",
        imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800",
        chargerType: "CCS2",
        powerOutput: 180,
        pricePerHour: "329.00",
        availableSlots: 6,
        amenities: ["WiFi", "Co-working Space", "Cafe", "Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.82",
        totalReviews: 201,
        createdAt: new Date(),
      },
      {
        id: "station-14",
        hostId: "sample-host-2",
        name: "Luxury Hotel Charging",
        description: "Premium charging at 5-star hotel. Hotel amenities included.",
        address: "The Leela Ambience, Sector 29, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122001",
        latitude: "28.4669197",
        longitude: "77.0671306",
        imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
        chargerType: "Type 2",
        powerOutput: 55,
        pricePerHour: "399.00",
        availableSlots: 3,
        amenities: ["Hotel Facilities", "Restaurant", "WiFi", "Valet Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.92",
        totalReviews: 89,
        createdAt: new Date(),
      },
      {
        id: "station-15",
        hostId: "sample-host-1",
        name: "Weekend Getaway Hub",
        description: "Perfect charging point for weekend travelers from Delhi.",
        address: "Greenery Golf Estate, Sector 48, Gurgaon",
        city: "Gurgaon",
        state: "Haryana",
        zipCode: "122004",
        latitude: "28.4104903",
        longitude: "77.0394627",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        chargerType: "CCS2",
        powerOutput: 250,
        pricePerHour: "399.00",
        availableSlots: 7,
        amenities: ["Resort Facilities", "Garden", "WiFi", "Parking"],
        isActive: true,
        isHomeStation: false,
        rating: "4.86",
        totalReviews: 145,
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
        userId: "sample-user-2",
        stationId: "station-2",
        rating: 5,
        comment: "Excellent charging station! Fast and convenient location near the airport.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-2",
        bookingId: "booking-1",
        userId: "sample-user-3",
        stationId: "station-1",
        rating: 4,
        comment: "Great location in the city center. Would have been 5 stars if WiFi was faster.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-3",
        bookingId: "booking-1",
        userId: "sample-user-4",
        stationId: "station-1",
        rating: 5,
        comment: "Premium Residences Hub is amazing! Super clean and fast charging. Highly recommended!",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-4",
        bookingId: "booking-1",
        userId: "sample-user-5",
        stationId: "station-3",
        rating: 4,
        comment: "Good home station with affordable rates. The location is perfect for my daily commute.",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-5",
        bookingId: "booking-1",
        userId: "sample-user-6",
        stationId: "station-4",
        rating: 5,
        comment: "Golf Course Road Station is phenomenal! Premium facilities and excellent charging speed.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-6",
        bookingId: "booking-1",
        userId: "sample-user-7",
        stationId: "station-5",
        rating: 4,
        comment: "DLF Cyber Hub charging point works great. Just a minor wait during peak hours.",
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-7",
        bookingId: "booking-1",
        userId: "sample-user-8",
        stationId: "station-7",
        rating: 5,
        comment: "Connected metro convenience! Perfect for travelers. Will definitely use again.",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-8",
        bookingId: "booking-1",
        userId: "sample-user-9",
        stationId: "station-8",
        rating: 5,
        comment: "South Delhi Hub offers outstanding service. Very professional staff and clean facilities.",
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-9",
        bookingId: "booking-1",
        userId: "sample-user-10",
        stationId: "station-9",
        rating: 5,
        comment: "Highway Express is super convenient for long drives. Fast charging and great rest area.",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-10",
        bookingId: "booking-1",
        userId: "sample-user-2",
        stationId: "station-10",
        rating: 4,
        comment: "Bangalore Tech Hub is impressive! Great atmosphere for working while charging.",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-11",
        bookingId: "booking-1",
        userId: "sample-user-3",
        stationId: "station-11",
        rating: 4,
        comment: "Commercial Complex Charge is perfectly located. Very busy during office hours.",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-12",
        bookingId: "booking-1",
        userId: "sample-user-4",
        stationId: "station-12",
        rating: 5,
        comment: "Urban Living Station has everything! Comfortable lounge and fast service.",
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
      },
      {
        id: "review-13",
        bookingId: "booking-1",
        userId: "sample-user-5",
        stationId: "station-6",
        rating: 4,
        comment: "Nisha Patwal's home station is reliable and affordable. Great for regular use.",
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
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
      isHomeStation: insertStation.isHomeStation ?? false,
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

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values())
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
