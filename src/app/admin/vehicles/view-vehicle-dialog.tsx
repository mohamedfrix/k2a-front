"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, Gauge, Fuel, Settings, MapPin, Star, Users, DoorOpen } from "lucide-react";
import { 
  AdminVehicle, 
  getFuelTypeDisplayName, 
  getTransmissionDisplayName, 
  getCategoryDisplayName 
} from "@/types/AdminVehicle";
import { getSafeImageUrl, getPlaceholderImageUrl } from "@/lib/image-utils";

interface ViewVehicleDialogProps {
  vehicle: AdminVehicle;
  onClose: () => void;
}

export function ViewVehicleDialog({ vehicle, onClose }: ViewVehicleDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Open the dialog after component mounts
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-black text-xl font-bold flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Détails complets du véhicule
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 text-black mt-5 pr-2">
          {/* Vehicle Images */}
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicle.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={getSafeImageUrl(image.imageUrl)}
                      alt={image.alt || `Vehicle image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                      style={{ backgroundColor: '#f9fafb' }}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = getPlaceholderImageUrl();
                      }}
                    />
                    {image.isPrimary && (
                      <Badge className="absolute top-1 right-1 text-xs">
                        Principale
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Informations Générales</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Marque</label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.make}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modèle</label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.model}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Année
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.year}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur</label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.color}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Plaque d'immatriculation</label>
                <p className="text-sm border rounded p-2 bg-gray-50 font-mono">{vehicle.licensePlate}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">VIN</label>
                <p className="text-sm border rounded p-2 bg-gray-50 font-mono">{vehicle.vin || "Non renseigné"}</p>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Spécifications Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Gauge className="h-3 w-3" />
                  Kilométrage
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "Non renseigné"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  Type de carburant
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{getFuelTypeDisplayName(vehicle.fuelType)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Settings className="h-3 w-3" />
                  Transmission
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{getTransmissionDisplayName(vehicle.transmission)}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <div className="border rounded p-2 bg-gray-50">
                  <Badge variant="outline">{getCategoryDisplayName(vehicle.category)}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Nombre de places
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.seats}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <DoorOpen className="h-3 w-3" />
                  Nombre de portes
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.doors}</p>
              </div>
            </div>
          </div>

          {/* Performance & Engine (if available) */}
          {(vehicle.engine || vehicle.power || vehicle.consumption || vehicle.acceleration || vehicle.maxSpeed || vehicle.trunkCapacity) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Performance & Moteur</h3>
              <div className="grid grid-cols-2 gap-4">
                {vehicle.engine && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Moteur</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.engine}</p>
                  </div>
                )}
                {vehicle.power && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Puissance</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.power}</p>
                  </div>
                )}
                {vehicle.consumption && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Consommation</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.consumption}</p>
                  </div>
                )}
                {vehicle.acceleration && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Accélération 0-100km/h</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.acceleration}</p>
                  </div>
                )}
                {vehicle.maxSpeed && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vitesse maximale</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.maxSpeed}</p>
                  </div>
                )}
                {vehicle.trunkCapacity && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Capacité coffre</label>
                    <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.trunkCapacity}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rental Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Informations de Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prix par jour</label>
                <p className="text-sm border rounded p-2 bg-gray-50 font-semibold text-green-600">
                  {vehicle.pricePerDay.toLocaleString()} DA
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Emplacement
                </label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.location}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Disponibilité</label>
                <div className="border rounded p-2 bg-gray-50">
                  <Badge variant={vehicle.availability ? "default" : "destructive"}>
                    {vehicle.availability ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Statut vedette
                </label>
                <div className="border rounded p-2 bg-gray-50">
                  {vehicle.featured ? (
                    <Badge variant="secondary">★ Vedette</Badge>
                  ) : (
                    <span className="text-gray-500">Véhicule standard</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services & Features */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Services & Équipements</h3>
            <div className="space-y-4">
              {vehicle.rentalServices && vehicle.rentalServices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Services de location</label>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.rentalServices.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service.rentalServiceType === 'INDIVIDUAL' ? 'Particulier' :
                         service.rentalServiceType === 'EVENTS' ? 'Événements' :
                         service.rentalServiceType === 'ENTERPRISE' ? 'Entreprise' : service.rentalServiceType}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Équipements</label>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <div className="border rounded p-3 bg-gray-50">
                <p className="text-sm">{vehicle.description}</p>
              </div>
            </div>
          )}

          {/* Rating & Reviews */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Évaluations</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Note moyenne</label>
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {vehicle.rating ? `${vehicle.rating}/5 ⭐` : "Aucune note"}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre d'avis</label>
                <p className="text-sm border rounded p-2 bg-gray-50">{vehicle.reviewCount} avis</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-lg font-semibold">Informations système</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de création</label>
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {new Date(vehicle.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dernière modification</label>
                <p className="text-sm border rounded p-2 bg-gray-50">
                  {new Date(vehicle.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 flex-shrink-0 pt-4 border-t">
          <Button onClick={handleClose} variant="outline">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}