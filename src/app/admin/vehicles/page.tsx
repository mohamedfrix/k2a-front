"use client";

import { useState, useEffect } from "react";
import DashboardNavBar from "@/components/dashboard/navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { CreateVehicleDialog } from "./create-vehicle-dialog";
import { ViewVehicleDialog } from "./view-vehicle-dialog";
import { EditVehicleDialog } from "./edit-vehicle-dialog";
import { AdminVehicle, CreateVehicleForm } from "@/types/AdminVehicle";
import { 
  createVehicleWithImages, 
  getVehicles, 
  deleteVehicle, 
  VehicleApiError 
} from "@/lib/api/vehicles";

function VehiclesContent() {
  const { t, isRTL } = useLanguage();
  const { getAccessToken } = useAuth();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<AdminVehicle | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null);

  // Load vehicles from backend
  const loadVehicles = async () => {
    const token = getAccessToken();
    if (!token) {
      setError("Token d'authentification manquant");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getVehicles(token);
      setVehicles(response.vehicles || []);
      
      // Show a helpful message if no vehicles found
      if (!response.vehicles || response.vehicles.length === 0) {
        console.info("No vehicles found in database. You can create new vehicles using the form.");
      }
    } catch (err) {
      const errorMessage = err instanceof VehicleApiError 
        ? err.message 
        : "Erreur lors du chargement des véhicules";
      
      // Check if it's a database initialization issue
      if (errorMessage.includes('database not initialized') || errorMessage.includes('table') || errorMessage.includes('migration')) {
        setError("Base de données non initialisée. Veuillez exécuter les migrations et importer des données.");
      } else {
        setError(errorMessage);
      }
      
      console.error("Error loading vehicles:", err);
      
      // Fallback to mock data if API fails
      setVehicles(mockVehicles);
      alert("Connexion à l'API échouée, utilisation des données de test");
    } finally {
      setLoading(false);
    }
  };

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  // Handle vehicle creation
  const handleCreateVehicle = async (vehicleData: CreateVehicleForm, images: File[]) => {
    console.log("handleCreateVehicle called with:", vehicleData, images);
    
    const token = getAccessToken();
    if (!token) {
      alert("Token d'authentification manquant");
      return;
    }

    try {
      console.log("Calling createVehicleWithImages...");
      const result = await createVehicleWithImages(vehicleData, images, token);
      console.log("Vehicle creation result:", result);
      
      // Add the new vehicle to the local state
      setVehicles(prev => [result.vehicle, ...prev]);
      
      alert("Véhicule créé avec succès!");
      
      if (images.length > 0 && !result.imageUploadResult) {
        alert("Véhicule créé mais échec du téléchargement des images");
      }
    } catch (error) {
      console.error("Error in handleCreateVehicle:", error);
      const errorMessage = error instanceof VehicleApiError 
        ? error.message 
        : "Erreur lors de la création du véhicule";
      alert(errorMessage);
      console.error("Error creating vehicle:", error);
    }
  };

  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicle: AdminVehicle) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.make} ${vehicle.model} ?`)) {
      return;
    }

    const token = getAccessToken();
    if (!token) {
      alert("Token d'authentification manquant");
      return;
    }

    try {
      await deleteVehicle(vehicle.id, token);
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      alert("Véhicule supprimé avec succès");
    } catch (error) {
      const errorMessage = error instanceof VehicleApiError 
        ? error.message 
        : "Erreur lors de la suppression du véhicule";
      alert(errorMessage);
      console.error("Error deleting vehicle:", error);
    }
  };

  // Handle vehicle view
  const handleViewVehicle = (vehicle: AdminVehicle) => {
    setViewingVehicle(vehicle);
  };

  // Handle vehicle edit
  const handleEditVehicle = (vehicle: AdminVehicle) => {
    setEditingVehicle(vehicle);
  };

  // Handle vehicle update
  const handleUpdateVehicle = (updatedVehicle: AdminVehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const columns = createColumns({
    onEdit: handleEditVehicle,
    onDelete: handleDeleteVehicle,
    onView: handleViewVehicle,
  });

  return (
    <div className="w-full min-h-full">
      <DashboardNavBar
        title={t("dashboard.navbar.vehicles.title")}
        subtitle={t("dashboard.navbar.vehicles.subtitle")}
        isRTL={isRTL}
        t={t}
      />
      
      {/* Header with Create Button */}
      <div className="m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestion des Véhicules</h1>
            <p className="text-muted-foreground">
              Gérez votre flotte de véhicules et leurs informations.
            </p>
          </div>
          
          <CreateVehicleDialog onSave={handleCreateVehicle} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadVehicles}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Chargement des véhicules...</span>
          </div>
        ) : (
          /* Table Content */
          <DataTable columns={columns} data={vehicles} />
        )}

        {/* View Vehicle Dialog */}
        {viewingVehicle && (
          <ViewVehicleDialog
            vehicle={viewingVehicle}
            onClose={() => setViewingVehicle(null)}
          />
        )}

        {/* Edit Vehicle Dialog */}
        {editingVehicle && (
          <EditVehicleDialog
            vehicle={editingVehicle}
            onClose={() => setEditingVehicle(null)}
            onUpdate={handleUpdateVehicle}
          />
        )}
      </div>
    </div>
  );
}

// Mock data for fallback (keeping structure compatible with new types)
const mockVehicles: AdminVehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    color: "Blanc",
    licensePlate: "123-AL-4567",
    mileage: 35000,
    fuelType: "GASOLINE" as any,
    transmission: "AUTOMATIC" as any,
    seats: 5,
    doors: 4,
    category: "COMPACT" as any,
    pricePerDay: 5000,
    availability: true,
    location: "Alger",
    description: "Véhicule économique et fiable",
    features: ["Climatisation", "Bluetooth", "GPS"],
    featured: false,
    rating: 4.2,
    reviewCount: 15,
    images: [],
    rentalServices: [],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    make: "Renault",
    model: "Clio",
    year: 2019,
    color: "Rouge",
    licensePlate: "456-BL-9876",
    mileage: 42000,
    fuelType: "GASOLINE" as any,
    transmission: "MANUAL" as any,
    seats: 5,
    doors: 4,
    category: "ECONOMY" as any,
    pricePerDay: 4500,
    availability: false,
    location: "Oran",
    description: "Parfait pour la ville",
    features: ["Climatisation", "Radio"],
    featured: true,
    rating: 4.0,
    reviewCount: 8,
    images: [],
    rentalServices: [],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    make: "Peugeot",
    model: "208",
    year: 2021,
    color: "Bleu",
    licensePlate: "789-ZK-1234",
    mileage: 18000,
    fuelType: "GASOLINE" as any,
    transmission: "AUTOMATIC" as any,
    seats: 5,
    doors: 4,
    category: "COMPACT" as any,
    pricePerDay: 5500,
    availability: true,
    location: "Constantine",
    description: "Moderne et confortable",
    features: ["Climatisation", "Bluetooth", "GPS", "Caméra de recul"],
    featured: false,
    rating: 4.5,
    reviewCount: 12,
    images: [],
    rentalServices: [],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Export the protected vehicles page
export default function Vehicles() {
  return (
    <ProtectedRoute>
      <VehiclesContent />
    </ProtectedRoute>
  );
}
