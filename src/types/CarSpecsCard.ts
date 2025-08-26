// Car Specifications Types
export interface CarSpecifications {
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
  typeDeMoteur: string;
  transmission: string;
  typeDeCarburant: string;
  capacite: string;
  // Optional additional specs
  puissance?: string;
  consommation?: string;
  acceleration?: string;
  vitesseMax?: string;
  coffre?: string;
  mileage?: number | string;
  doors?: number | string;
  licensePlate?: string;
  vin?: string;
  category?: string;
  description?: string;
}

export interface CarEquipmentItem {
  name: string;
  available: boolean;
}

export interface CarSpecsCardProps {
  specifications: CarSpecifications;
  equipements: CarEquipmentItem[];
  className?: string;
}
