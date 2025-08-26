import normalizeVehicleForUI from '../src/lib/normalizeVehicle';

const sample = {
  "id": "cmesl79ha0004hi9s8oyw6py2",
  "make": "Hyunday",
  "model": "Accent",
  "year": 2025,
  "color": "Noire",
  "licensePlate": "123-2-3-9",
  "vin": "hdyd8ysy87r7dyhgm",
  "mileage": 10000,
  "fuelType": "GASOLINE",
  "transmission": "MANUAL",
  "seats": 5,
  "doors": 4,
  "category": "ECONOMY",
  "pricePerDay": 8000,
  "availability": true,
  "location": "Alger",
  "description": "Some description",
  "features": [
    "gps",
    "speed regulator"
  ],
  "featured": false,
  "engine": "2.0 L",
  "power": "175 CV",
  "consumption": "6.8L/100km",
  "acceleration": "6.3s(0-100km)",
  "maxSpeed": "235km/h",
  "trunkCapacity": "550L",
  "rating": 0,
  "reviewCount": 0,
  "isActive": true,
  "createdAt": "2025-08-26T13:33:46.558Z",
  "updatedAt": "2025-08-26T13:33:46.558Z",
  "images": []
};

const out = normalizeVehicleForUI(sample as any);
console.log(JSON.stringify(out, null, 2));
