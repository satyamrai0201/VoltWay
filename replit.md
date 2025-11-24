# VoltWay - EV Charging Station Platform

## Overview
VoltWay is a full-stack electric vehicle (EV) charging station finder and booking platform built with React, Express, and PostgreSQL. Users can find charging stations on an interactive map, book charging sessions, track bookings in real-time, and hosts can list their charging stations.

## Project Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (development using in-memory storage)
- **Maps**: Leaflet + OpenStreetMap
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui (Radix UI primitives)

### Design System
- **Primary Color**: Neon Lime (#CCFF00)
- **Typography**: Inter font family
- **Hero Text**: 72-96px
- **Border Radius**: 28px for large elements, 14px for smaller components
- **Style**: Modern, clean with neon lime accents

## Project Structure

### Frontend (`client/src/`)
#### Pages
- `Home.tsx` - Landing page with hero, features, and station preview
- `FindStations.tsx` - Interactive map with search and filters
- `StationDetail.tsx` - Individual station details with booking modal
- `MyBookings.tsx` - User's active and past bookings
- `HostDashboard.tsx` - Host station management dashboard
- `BecomeHost.tsx` - Station listing form for new hosts
- `Profile.tsx` - User profile management

#### Components
- `Navigation.tsx` - Floating navigation bar
- `ProfileDropdown.tsx` - User profile menu
- `HeroSection.tsx` - Landing page hero with animated visuals
- `FeaturesSection.tsx` - Platform features showcase
- `StationCard.tsx` - Reusable station card component
- `Footer.tsx` - Site footer with links
- `LoginModal.tsx` - User login/signup modal
- `BookingStatusTracker.tsx` - Real-time booking status
- `StationDetailModal.tsx` - Station detail popup
- `MapView.tsx` - Map component wrapper

### Backend (`server/`)
- `routes.ts` - RESTful API routes
- `storage.ts` - In-memory data storage (IStorage interface)
- `index.ts` - Express server setup

### Shared (`shared/`)
- `schema.ts` - Database schema, types, and Zod validation schemas

## Database Schema

### Users
- Authentication details (email, name, avatar)
- Host status flag
- Stripe customer ID for payments

### Stations
- Station details (name, description, location)
- Charging specs (type, power output, price)
- Amenities array
- Host relationship
- Rating and review count

### Bookings
- User and station relationships
- Time slots (start/end)
- Status tracking (pending, confirmed, in-progress, completed, cancelled)
- Payment status and intent ID
- Vehicle details

### Reviews
- Booking, user, and station relationships
- Rating (1-5)
- Comment

## API Endpoints

### Stations
- `GET /api/stations` - List all stations (with optional filters)
- `GET /api/stations/:id` - Get station details
- `POST /api/stations` - Create new station
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station
- `GET /api/stations/:id/reviews` - Get station reviews
- `GET /api/host/:hostId/stations` - Get host's stations

### Bookings
- `GET /api/bookings/user/:userId` - Get user's bookings
- `GET /api/bookings/station/:stationId` - Get station bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking

### Reviews
- `POST /api/reviews` - Create review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Features Implemented

### User Features
- Browse and search charging stations
- Interactive map with station markers
- Filter by location, charger type, and power output
- Book charging sessions
- View booking history and status
- Leave reviews for stations
- Manage profile

### Host Features
- List charging stations
- View dashboard with stats
- Manage station details
- Track bookings
- Update availability and pricing

### Design Features
- Fully responsive layout
- Dark mode support
- Smooth animations with Framer Motion
- Accessible UI components
- Loading states and error handling
- Form validation with Zod

## Planned Integrations

### Authentication
- Replit Auth for user authentication
- OAuth support

### Payments
- Stripe integration for payment processing
- Payment intent creation
- Booking payment flow

## Development

### Running the App
```bash
npm run dev
```
Server runs on port 5000 with both frontend (Vite) and backend (Express) on the same port.

### Key Dependencies
- `react` - UI library
- `express` - Backend server
- `@tanstack/react-query` - Data fetching
- `wouter` - Routing
- `react-hook-form` + `zod` - Form validation
- `drizzle-orm` + `drizzle-zod` - Database ORM and validation
- `leaflet` + `react-leaflet` - Interactive maps
- `framer-motion` - Animations
- `lucide-react` - Icons
- `date-fns` - Date formatting

## Recent Changes

### November 24, 2025
- Created comprehensive database schema for users, stations, bookings, and reviews
- Implemented storage layer with full CRUD operations
- Built RESTful API routes with Zod validation
- Created 6 new pages: FindStations, StationDetail, MyBookings, HostDashboard, BecomeHost, Profile
- Added routing configuration for all pages
- Installed and configured Leaflet for interactive maps
- Added seed data for users, stations, bookings, and reviews
- Fixed type mismatches between schema and storage
- Updated navigation with links to all pages

## User Preferences
- Modern, clean design with neon lime accents
- Giant typography for hero sections
- Smooth, subtle animations
- Comprehensive feature set matching reference designs
- Focus on usability and accessibility
