# Vehicle Data Structure Analysis

## Overview
This document provides a comprehensive analysis of vehicle data consistency between the frontend, backend validators, and database schema. It identifies inconsistencies and provides solutions for proper data mapping and integration.

## Current Data Structures

### Frontend Vehicle Interface (`src/types/VehicleCard.ts`)
```typescript
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  location: string;
  pricePerDay: number;
  currency: string;
  images: VehicleImage[];
  specs: VehicleSpecs;
  available: boolean;
  featured?: boolean;
}

interface VehicleSpecs {
  transmission: 'manual' | 'automatic' | 'hybrid';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  year: number;
  seats?: number;
  doors?: number;
}

interface VehicleImage {
  url: string | StaticImageData;
  alt: string;
  isPrimary?: boolean;
}
```

### Extended Frontend Display Data (Vehicle Details Page)
```typescript
const extendedVehicleData = {
  color: string;           // "Noir Métallisé" - ✅ EXISTS in backend
  engine: string;          // "2.0L Turbo" - ✅ EXISTS in backend
  power: string;           // "248 CV" - ✅ EXISTS in backend
  consumption: string;     // "6.8L/100km" - ✅ EXISTS in backend
  acceleration: string;    // "6.3s (0-100km/h)" - ✅ EXISTS in backend
  maxSpeed: string;        // "235 km/h" - ✅ EXISTS in backend
  trunkCapacity: string;   // "550L" - ✅ EXISTS in backend
  features: string[];      // ["GPS Navigation", "Bluetooth", ...] - ✅ EXISTS in backend
}
```

### Backend Validator Schema (`backend/src/validators/vehicleValidators.ts`)

#### Create Vehicle Schema
```typescript
{
  // Basic Vehicle Information
  make: string (1-50 chars),
  model: string (1-50 chars),
  year: number (1900 - current year + 1),
  color: string (1-30 chars),
  licensePlate: string (1-20 chars),
  vin?: string (exactly 17 chars),
  mileage?: number (≥0),
  
  // Vehicle Specifications
  fuelType: FuelType enum,
  transmission: Transmission enum,
  seats: number (1-50),
  doors: number (2-6),
  category: VehicleCategory enum,
  
  // Pricing and Location
  pricePerDay: number (≥0),
  location: string (1-100 chars),
  
  // Optional Fields
  description?: string (≤1000 chars),
  features?: string[] (each ≤50 chars),
  featured?: boolean (default: false),
  
  // Engine & Performance Specifications
  engine?: string (≤100 chars),
  power?: string (≤50 chars),
  consumption?: string (≤50 chars),
  acceleration?: string (≤50 chars),
  maxSpeed?: string (≤50 chars),
  trunkCapacity?: string (≤50 chars),
  
  // Rental Services (at least one required)
  rentalServices: RentalServiceType[]
}
```

#### Backend Enums
```typescript
enum FuelType {
  GASOLINE,
  DIESEL,
  ELECTRIC,
  HYBRID,
  PLUGIN_HYBRID
}

enum Transmission {
  MANUAL,
  AUTOMATIC,
  CVT
}

enum VehicleCategory {
  ECONOMY,
  COMPACT,
  MIDSIZE,
  FULLSIZE,
  LUXURY,
  SUV,
  VAN,
  TRUCK,
  CONVERTIBLE,
  SPORTS
}

enum RentalServiceType {
  INDIVIDUAL,
  EVENTS,
  ENTERPRISE
}
```

### Database Schema (Prisma)
```prisma
model Vehicle {
  id           String            @id @default(cuid())
  make         String
  model        String
  year         Int
  color        String
  licensePlate String            @unique
  vin          String?           @unique
  mileage      Int?
  fuelType     FuelType
  transmission Transmission
  seats        Int
  doors        Int
  category     VehicleCategory
  pricePerDay  Decimal           @db.Decimal(10, 2)
  availability Boolean           @default(true)
  location     String
  description  String?
  features     String[]
  
  featured     Boolean           @default(false)
  
  // Performance Specifications
  engine       String?
  power        String?
  consumption  String?
  acceleration String?
  maxSpeed     String?
  trunkCapacity String?
  
  // Review System
  rating       Float?            @default(0.0)
  reviewCount  Int               @default(0)
  
  // Relations
  images         VehicleImage[]
  rentalServices VehicleRentalService[]
  
  isActive     Boolean           @default(true)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
}

model VehicleImage {
  id        String   @id @default(cuid())
  vehicleId String
  imageUrl  String
  alt       String?
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())
  
  vehicle Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)
}
```

## Data Inconsistencies Analysis

### ✅ Solvable with Data Conversion (Not Real Inconsistencies)

#### 1. Enum Case Differences
**Status**: Can be solved with mapping functions

**Transmission Types:**
- Frontend: `'manual' | 'automatic' | 'hybrid'`
- Backend: `'MANUAL' | 'AUTOMATIC' | 'CVT'`
- **Solution**: Map `'hybrid'` ↔ `'CVT'` and handle case conversion

**Fuel Types:**
- Frontend: `'petrol' | 'diesel' | 'electric' | 'hybrid'`
- Backend: `'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'PLUGIN_HYBRID'`
- **Solution**: Map `'petrol'` ↔ `'GASOLINE'` and case conversion

#### 2. Admin-Only Fields
**Status**: Correct logic - these should be hidden from public pages

Fields like `licensePlate`, `vin`, `mileage`, `category`, `rentalServices` are administrative data and should not be displayed on public vehicle pages. They will only appear in admin interfaces.

#### 3. Extended Display Fields
**Status**: ✅ All fields exist in backend schema

All extended display fields shown on the vehicle details page (`color`, `engine`, `power`, `consumption`, `acceleration`, `maxSpeed`, `trunkCapacity`, `features`) are already present in the Prisma schema and backend validators.

### ❌ Actual Inconsistencies Requiring Fixes

#### 1. Image Property Name Mismatch
**Frontend expects:**
```typescript
images: {
  url: string;        // ← Property name
  alt: string;
  isPrimary?: boolean;
}[]
```

**Backend provides:**
```typescript
images: {
  id: string;
  imageUrl: string;   // ← Different property name!
  alt?: string;
  isPrimary: boolean;
  createdAt: Date;
}[]
```

**Fix Required**: Property name mapping `imageUrl` ↔ `url`

#### 2. Availability Field Name Inconsistency
**Frontend uses:**
```typescript
available: boolean
```

**Backend/Database uses:**
```typescript
availability: boolean
```

**Fix Required**: Field name mapping `availability` ↔ `available`

#### 3. Price Field Type Mismatch
**Frontend:**
```typescript
pricePerDay: number
```

**Backend/Database:**
```typescript
pricePerDay: Decimal
```

**Fix Required**: Type conversion between `Decimal` and `number`

#### 4. Missing Currency Field
**Frontend requires:**
```typescript
currency: string  // Used for display (e.g., "DA")
```

**Backend/Database:**
No currency field defined

**Fix Required**: Add currency field to backend or default to "DA" in mapping

#### 5. Admin Vehicles Page Structure Mismatch
**Current admin mock data structure:**
```typescript
{
  Name: string;        // Should be: make + model
  Model: string;       // This is actually trim level
  Color: string;       // ✅ Correct
  Year: string;        // ✅ Correct (but string vs number)
  Matricule: string;   // This is licensePlate
  Km: string;          // This is mileage
  Boite: string;       // This is transmission
  Status: string;      // This is availability
}
```

**Fix Required**: Update admin interface to match backend data structure

## Recommended Solutions

### 1. Data Mapping Layer

Create utility functions to handle data conversion between frontend and backend:

```typescript
// utils/vehicleDataMapper.ts

export const mapBackendToFrontend = (backendVehicle: VehicleWithImages): Vehicle => {
  return {
    id: backendVehicle.id,
    make: backendVehicle.make,
    model: backendVehicle.model,
    year: backendVehicle.year,
    location: backendVehicle.location,
    pricePerDay: Number(backendVehicle.pricePerDay), // Decimal → number
    currency: "DA", // Default currency or add to backend
    available: backendVehicle.availability, // availability → available
    featured: backendVehicle.featured,
    images: backendVehicle.images.map(img => ({
      url: img.imageUrl, // imageUrl → url
      alt: img.alt || "",
      isPrimary: img.isPrimary
    })),
    specs: {
      transmission: mapTransmissionToFrontend(backendVehicle.transmission),
      fuelType: mapFuelTypeToFrontend(backendVehicle.fuelType),
      year: backendVehicle.year,
      seats: backendVehicle.seats,
      doors: backendVehicle.doors
    }
  };
};

export const mapFrontendToBackend = (frontendVehicle: CreateVehicleInput): CreateVehicleRequest => {
  return {
    ...frontendVehicle,
    fuelType: mapFuelTypeToBackend(frontendVehicle.fuelType),
    transmission: mapTransmissionToBackend(frontendVehicle.transmission),
    pricePerDay: frontendVehicle.pricePerDay, // number → Decimal (handled by Prisma)
    availability: frontendVehicle.available, // available → availability
  };
};

// Enum mapping functions
const mapTransmissionToFrontend = (transmission: Transmission): TransmissionType => {
  const mapping: Record<Transmission, TransmissionType> = {
    'MANUAL': 'manual',
    'AUTOMATIC': 'automatic',
    'CVT': 'hybrid' // Map CVT to hybrid for frontend
  };
  return mapping[transmission];
};

const mapTransmissionToBackend = (transmission: TransmissionType): Transmission => {
  const mapping: Record<TransmissionType, Transmission> = {
    'manual': 'MANUAL',
    'automatic': 'AUTOMATIC',
    'hybrid': 'CVT' // Map hybrid to CVT for backend
  };
  return mapping[transmission];
};

const mapFuelTypeToFrontend = (fuelType: FuelType): FuelType => {
  const mapping: Record<FuelType, FuelType> = {
    'GASOLINE': 'petrol',
    'DIESEL': 'diesel',
    'ELECTRIC': 'electric',
    'HYBRID': 'hybrid',
    'PLUGIN_HYBRID': 'hybrid' // Map to hybrid for simplicity
  };
  return mapping[fuelType];
};

const mapFuelTypeToBackend = (fuelType: FuelType): FuelType => {
  const mapping: Record<FuelType, FuelType> = {
    'petrol': 'GASOLINE',
    'diesel': 'DIESEL',
    'electric': 'ELECTRIC',
    'hybrid': 'HYBRID'
  };
  return mapping[fuelType];
};
```

### 2. Backend Fixes Required

#### Add Currency Field
```typescript
// Option 1: Add to Prisma schema
model Vehicle {
  // ... existing fields
  currency String @default("DA")
}

// Option 2: Default in mapping layer (recommended)
```

#### Update Image Response Type
```typescript
// Ensure consistent property naming in API responses
interface VehicleImageResponse {
  id: string;
  url: string;        // Instead of imageUrl
  alt?: string;
  isPrimary: boolean;
  createdAt: Date;
}
```

### 3. Frontend Updates Required

#### Update Admin Vehicle Interface
```typescript
// Replace current admin mock structure with:
interface AdminVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage?: number;
  transmission: Transmission;
  availability: boolean;
  pricePerDay: number;
  location: string;
  featured: boolean;
  createdAt: Date;
  // ... other admin-specific fields
}
```

#### Create Admin Vehicle Form Fields
```typescript
interface CreateVehicleForm {
  // Basic Information (Required)
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  
  // Specifications (Required)
  fuelType: FuelType;
  transmission: Transmission;
  seats: number;
  doors: number;
  category: VehicleCategory;
  
  // Pricing & Location (Required)
  pricePerDay: number;
  location: string;
  
  // Rental Services (Required - at least one)
  rentalServices: RentalServiceType[];
  
  // Optional Fields
  vin?: string;
  mileage?: number;
  description?: string;
  engine?: string;
  power?: string;
  consumption?: string;
  acceleration?: string;
  maxSpeed?: string;
  trunkCapacity?: string;
  features?: string[];
  featured?: boolean;
}
```

## Implementation Checklist

### Backend Tasks
- [ ] Consider adding currency field to Vehicle model or default in API
- [ ] Ensure consistent image property naming (`url` vs `imageUrl`)
- [ ] Implement proper Decimal to number conversion in API responses
- [ ] Test enum mappings for transmission and fuel types

### Frontend Tasks
- [ ] Create data mapping utility functions
- [ ] Update admin vehicles page to use real backend data structure
- [ ] Create comprehensive vehicle creation form
- [ ] Implement image upload functionality
- [ ] Add proper type conversions for price fields
- [ ] Update vehicle filter components to work with backend enums

### Integration Tasks
- [ ] Test data flow from frontend form → backend API → database
- [ ] Test data flow from database → backend API → frontend display
- [ ] Validate enum conversions work correctly
- [ ] Test image upload and display functionality
- [ ] Verify admin-only fields are properly hidden from public pages

## API Endpoints to Implement/Update

### Vehicle CRUD Operations
- `GET /api/vehicles` - List vehicles with filtering
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (admin only)
- `PUT /api/vehicles/:id` - Update vehicle (admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin only)

### Image Operations
- `POST /api/vehicles/:id/images` - Upload vehicle images
- `DELETE /api/vehicles/:id/images/:imageId` - Delete vehicle image
- `PUT /api/vehicles/:id/images/:imageId/primary` - Set primary image

### Utility Endpoints
- `GET /api/vehicles/categories` - Get vehicle categories
- `GET /api/vehicles/stats` - Get vehicle statistics (admin only)

---

**Last Updated**: August 20, 2025
**Status**: Ready for implementation