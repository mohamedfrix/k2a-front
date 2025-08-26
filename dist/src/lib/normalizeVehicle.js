"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeVehicleForUI = normalizeVehicleForUI;
const TRANSMISSION_MAP = {
    MANUAL: 'Manuelle',
    AUTOMATIC: 'Automatique',
    manual: 'Manuelle',
    automatic: 'Automatique'
};
const FUEL_MAP = {
    GASOLINE: 'Essence',
    DIESEL: 'Diesel',
    ELECTRIC: 'Électrique',
    HYBRID: 'Hybride',
    petrol: 'Essence',
    diesel: 'Diesel',
    electric: 'Électrique',
    hybrid: 'Hybride'
};
function normalizeVehicleForUI(vehicle) {
    const specsSrc = (vehicle.specs && typeof vehicle.specs === 'object') ? vehicle.specs : {};
    const transmissionKey = specsSrc?.transmission ?? vehicle?.transmission ?? '';
    const fuelKey = specsSrc?.fuelType ?? vehicle?.fuelType ?? specsSrc?.fuel ?? '';
    const transmissionLabel = transmissionKey ? (TRANSMISSION_MAP[transmissionKey] ?? transmissionKey) : '';
    const fuelLabel = fuelKey ? (FUEL_MAP[fuelKey] ?? fuelKey) : '';
    const seats = specsSrc?.seats ?? vehicle?.seats ?? null;
    const specifications = {
        marque: vehicle.make ?? vehicle.brand ?? '',
        modele: vehicle.model ?? '',
        annee: vehicle?.year ?? specsSrc?.year ?? 0,
        couleur: vehicle?.color ?? specsSrc?.color ?? '',
        typeDeMoteur: vehicle?.engine ?? specsSrc?.engine ?? '',
        transmission: transmissionLabel,
        typeDeCarburant: fuelLabel,
        capacite: seats ? `${seats} places` : ''
    };
    // Optional fields
    specifications.puissance = vehicle?.power ?? specsSrc?.power ?? '';
    specifications.consommation = vehicle?.consumption ?? specsSrc?.consumption ?? '';
    specifications.acceleration = vehicle?.acceleration ?? specsSrc?.acceleration ?? '';
    specifications.vitesseMax = vehicle?.maxSpeed ?? specsSrc?.maxSpeed ?? '';
    specifications.coffre = vehicle?.trunkCapacity ?? specsSrc?.trunkCapacity ?? '';
    specifications.mileage = typeof vehicle?.mileage === 'number' ? `${vehicle.mileage.toLocaleString()} km` : (specsSrc?.mileage ?? vehicle?.mileage ?? '');
    specifications.doors = specsSrc?.doors ?? vehicle?.doors ?? '';
    specifications.licensePlate = vehicle?.licensePlate ?? specsSrc?.licensePlate ?? '';
    specifications.vin = vehicle?.vin ?? specsSrc?.vin ?? '';
    specifications.category = vehicle?.category ?? specsSrc?.category ?? '';
    specifications.description = vehicle?.description ?? specsSrc?.description ?? '';
    // Map optional specs if present
    if (vehicle?.power ?? specsSrc?.power) {
        specifications.puissance = vehicle?.power ?? specsSrc?.power;
    }
    if (vehicle?.consumption ?? specsSrc?.consumption) {
        specifications.consommation = vehicle?.consumption ?? specsSrc?.consumption;
    }
    if (vehicle?.acceleration ?? specsSrc?.acceleration) {
        specifications.acceleration = vehicle?.acceleration ?? specsSrc?.acceleration;
    }
    if (vehicle?.maxSpeed ?? specsSrc?.maxSpeed) {
        specifications.vitesseMax = vehicle?.maxSpeed ?? specsSrc?.maxSpeed;
    }
    if (vehicle?.trunkCapacity ?? specsSrc?.trunkCapacity) {
        specifications.coffre = vehicle?.trunkCapacity ?? specsSrc?.trunkCapacity;
    }
    if (vehicle?.mileage ?? specsSrc?.mileage) {
        specifications.mileage = vehicle?.mileage ?? specsSrc?.mileage;
    }
    if (vehicle?.doors ?? specsSrc?.doors) {
        specifications.doors = vehicle?.doors ?? specsSrc?.doors;
    }
    if (vehicle?.licensePlate ?? specsSrc?.licensePlate) {
        specifications.licensePlate = vehicle?.licensePlate ?? specsSrc?.licensePlate;
    }
    if (vehicle?.vin ?? specsSrc?.vin) {
        specifications.vin = vehicle?.vin ?? specsSrc?.vin;
    }
    if (vehicle?.category ?? specsSrc?.category) {
        specifications.category = vehicle?.category ?? specsSrc?.category;
    }
    if (vehicle?.description ?? specsSrc?.description) {
        specifications.description = vehicle?.description ?? specsSrc?.description;
    }
    const rawFeatures = Array.isArray(vehicle?.features)
        ? vehicle.features
        : Array.isArray(specsSrc?.features)
            ? specsSrc.features
            : [];
    // Normalize feature strings and filter out values that actually represent specs
    const specValues = new Set([
        (vehicle?.power ?? specsSrc?.power ?? '').toString().toLowerCase(),
        (vehicle?.consumption ?? specsSrc?.consumption ?? '').toString().toLowerCase(),
        (vehicle?.acceleration ?? specsSrc?.acceleration ?? '').toString().toLowerCase(),
        (vehicle?.maxSpeed ?? specsSrc?.maxSpeed ?? '').toString().toLowerCase(),
        (vehicle?.trunkCapacity ?? specsSrc?.trunkCapacity ?? '').toString().toLowerCase(),
        (vehicle?.mileage ?? specsSrc?.mileage ?? '').toString().toLowerCase(),
        (vehicle?.licensePlate ?? specsSrc?.licensePlate ?? '').toString().toLowerCase(),
        (vehicle?.vin ?? specsSrc?.vin ?? '').toString().toLowerCase(),
        (vehicle?.category ?? specsSrc?.category ?? '').toString().toLowerCase(),
        (vehicle?.engine ?? specsSrc?.engine ?? '').toString().toLowerCase()
    ].filter(Boolean));
    const features = rawFeatures
        .filter(Boolean)
        .map((f) => (typeof f === 'string' ? f.trim() : String(f)))
        .map((f) => f.toLowerCase())
        // Remove entries that equal one of the spec values (e.g., '175 cv')
        .filter((f) => !specValues.has(f))
        // Remove entries that look like spec keys
        .filter((f) => !['power', 'puissance', 'consumption', 'consommation', 'acceleration', 'accel', 'maxspeed', 'vitesse', 'trunk', 'trunkcapacity', 'coffre', 'mileage', 'miles', 'doors', 'door', 'license', 'licenseplate', 'vin', 'category', 'engine'].includes(f));
    // Map common feature slugs to user-friendly labels (extend as needed)
    const FEATURE_LABELS = {
        gps: 'GPS Navigation',
        'speed regulator': 'Speed Regulator',
        'speed_regulator': 'Speed Regulator',
        bluetooth: 'Bluetooth',
        ac: 'Air Conditioning',
        'heated seats': 'Heated Seats',
        'parking sensors': 'Parking Sensors',
        'rear camera': 'Rear Camera',
        sunroof: 'Sunroof'
    };
    const equipements = features.map((f) => ({
        name: FEATURE_LABELS[f] ?? (typeof f === 'string' ? (f.charAt(0).toUpperCase() + f.slice(1)) : String(f)),
        available: true
    }));
    return { specifications, equipements };
}
exports.default = normalizeVehicleForUI;
