import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStationSchema, insertBookingSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const MemStore = MemoryStore(session) as any;

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for auth
  app.use(
    session({
      store: new MemStore(),
      secret: process.env.SESSION_SECRET || "dev-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true },
    })
  );

  // Auth endpoints
  app.get("/api/auth/user", async (req: Request & { user?: any; session?: any }, res) => {
    try {
      // Check session first, then user object
      const userId = (req.session as any)?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Mock login endpoint for demo purposes
  app.get("/api/login", async (req: Request & { user?: any; session?: any }, res) => {
    try {
      // For demo, log in as the first sample user
      req.user = { id: "sample-user-1" };
      if (req.session) {
        req.session.userId = "sample-user-1";
      }
      // Redirect to home after login
      res.redirect("/");
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout endpoint
  app.get("/api/logout", (req: any, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });

  // Update user profile endpoint
  app.patch("/api/auth/user", async (req: Request & { user?: any; session?: any }, res) => {
    try {
      const userId = (req.session as any)?.userId || req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { firstName, lastName, phoneNumber } = req.body;
      const updatedUser = await storage.updateUser(userId, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phoneNumber: phoneNumber || undefined,
      });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/stations", async (req, res) => {
    try {
      const { city, chargerType, minPower } = req.query;
      
      if (city || chargerType || minPower) {
        const stations = await storage.searchStations({
          city: city as string,
          chargerType: chargerType as string,
          minPower: minPower ? parseInt(minPower as string) : undefined,
        });
        return res.json(stations);
      }
      
      const stations = await storage.getAllStations();
      res.json(stations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stations" });
    }
  });

  app.get("/api/stations/:id", async (req, res) => {
    try {
      const station = await storage.getStation(req.params.id);
      if (!station) {
        return res.status(404).json({ error: "Station not found" });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch station" });
    }
  });

  app.post("/api/stations", async (req, res) => {
    try {
      const validatedData = insertStationSchema.parse(req.body);
      const station = await storage.createStation(validatedData);
      res.status(201).json(station);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create station" });
    }
  });

  app.put("/api/stations/:id", async (req, res) => {
    try {
      const station = await storage.updateStation(req.params.id, req.body);
      if (!station) {
        return res.status(404).json({ error: "Station not found" });
      }
      res.json(station);
    } catch (error) {
      res.status(500).json({ error: "Failed to update station" });
    }
  });

  app.delete("/api/stations/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Station not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete station" });
    }
  });

  app.get("/api/stations/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByStation(req.params.id);
      // Fetch user info for each review
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous"
          };
        })
      );
      res.json(reviewsWithUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      // Return all bookings for real-time dashboard updates
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByUser(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/station/:stationId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByStation(req.params.stationId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/host/:hostId/stations", async (req, res) => {
    try {
      const stations = await storage.getStationsByHost(req.params.hostId);
      res.json(stations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch host stations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
