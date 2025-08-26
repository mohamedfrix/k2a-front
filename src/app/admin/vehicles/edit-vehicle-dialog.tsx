"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader2, X, Plus } from "lucide-react";
import { AdminVehicle, FuelType, Transmission, VehicleCategory, RentalServiceType } from "@/types/AdminVehicle";
import { updateVehicle } from "@/lib/api/vehicles";
import { useAuth } from "@/context/AuthContext";

interface EditVehicleDialogProps {
  vehicle: AdminVehicle;
  onClose: () => void;
  onUpdate: (updatedVehicle: AdminVehicle) => void;
}

export function EditVehicleDialog({ vehicle, onClose, onUpdate }: EditVehicleDialogProps) {
  const { getAccessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Open the dialog after component mounts
    setOpen(true);
  }, []);
  
  const [formData, setFormData] = useState({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    licensePlate: vehicle.licensePlate,
    vin: vehicle.vin || "",
    mileage: vehicle.mileage || "",
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    category: vehicle.category,
    seats: vehicle.seats,
    doors: vehicle.doors,
    engine: vehicle.engine || "",
    power: vehicle.power || "",
    consumption: vehicle.consumption || "",
    acceleration: vehicle.acceleration || "",
    maxSpeed: vehicle.maxSpeed || "",
    trunkCapacity: vehicle.trunkCapacity || "",
    pricePerDay: vehicle.pricePerDay,
    location: vehicle.location,
    availability: vehicle.availability,
    featured: vehicle.featured,
    description: vehicle.description || "",
    features: vehicle.features || [],
    rentalServices: vehicle.rentalServices?.map(service => service.rentalServiceType) || [],
  });

  const [newFeature, setNewFeature] = useState("");

  const handleDialogOpenChange = (open: boolean) => {
    // Prevent dialog from closing during submission
    if (!open && !isLoading) {
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const validateForm = () => {
    console.log("EditVehicleDialog: validateForm called with data:", formData);
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.make.trim()) newErrors.make = "La marque est requise";
    if (!formData.model.trim()) newErrors.model = "Le modèle est requis";
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = "Année invalide";
    }
    if (!formData.color.trim()) newErrors.color = "La couleur est requise";
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "La plaque d'immatriculation est requise";
    if (!formData.location.trim()) newErrors.location = "L'emplacement est requis";
    if (formData.pricePerDay <= 0) newErrors.pricePerDay = "Le prix doit être supérieur à 0";
    if (formData.seats < 1 || formData.seats > 20) newErrors.seats = "Nombre de places invalide";
    if (formData.doors < 2 || formData.doors > 6) newErrors.doors = "Nombre de portes invalide";

    console.log("EditVehicleDialog: Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("EditVehicleDialog: handleSubmit called");
    
    if (!validateForm()) {
      console.log("EditVehicleDialog: Form validation failed", errors);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAccessToken();
      console.log("EditVehicleDialog: Token retrieved:", !!token);
      
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      console.log("EditVehicleDialog: Calling updateVehicle API with data:", {
        vehicleId: vehicle.id,
        formData: formData
      });

      const updatedVehicle = await updateVehicle(vehicle.id, {
        ...formData,
        vin: formData.vin || undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        engine: formData.engine || undefined,
        power: formData.power || undefined,
        consumption: formData.consumption || undefined,
        acceleration: formData.acceleration || undefined,
        maxSpeed: formData.maxSpeed || undefined,
        trunkCapacity: formData.trunkCapacity || undefined,
        description: formData.description || undefined,
        features: formData.features,
        rentalServices: formData.rentalServices,
      }, token);
      
      console.log("EditVehicleDialog: Vehicle updated successfully:", updatedVehicle);
      onUpdate(updatedVehicle);
      handleClose();
    } catch (error) {
      console.error("EditVehicleDialog: Error updating vehicle:", error);
      setErrors({ submit: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== indexToRemove)
    }));
  };

  const toggleRentalService = (service: RentalServiceType) => {
    setFormData(prev => ({
      ...prev,
      rentalServices: prev.rentalServices.includes(service)
        ? prev.rentalServices.filter(s => s !== service)
        : [...prev.rentalServices, service]
    }));
  };

  return (
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black text-xl font-bold flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Modifier {vehicle.make} {vehicle.model}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Modifiez les informations du véhicule
            </DialogDescription>
          </DialogHeader>                    
          <form onSubmit={handleSubmit} className="space-y-6 text-black mt-5">
            
            {/* Display submission errors */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations Générales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marque *</label>
                  <Input
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    className={errors.make ? 'border-red-500' : ''}
                  />
                  {errors.make && <p className="text-sm text-red-500">{errors.make}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modèle *</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={errors.model ? 'border-red-500' : ''}
                  />
                  {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Année *</label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                    className={errors.year ? 'border-red-500' : ''}
                  />
                  {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Couleur *</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={errors.color ? 'border-red-500' : ''}
                  />
                  {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plaque d'immatriculation *</label>
                  <Input
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    className={errors.licensePlate ? 'border-red-500' : ''}
                  />
                  {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">VIN</label>
                  <Input
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Spécifications Techniques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kilométrage</label>
                  <Input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de carburant *</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value as FuelType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={FuelType.GASOLINE}>Essence</option>
                    <option value={FuelType.DIESEL}>Diesel</option>
                    <option value={FuelType.HYBRID}>Hybride</option>
                    <option value={FuelType.ELECTRIC}>Électrique</option>
                    <option value={FuelType.PLUGIN_HYBRID}>Hybride Rechargeable</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmission *</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value as Transmission)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={Transmission.MANUAL}>Manuelle</option>
                    <option value={Transmission.AUTOMATIC}>Automatique</option>
                    <option value={Transmission.CVT}>CVT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={VehicleCategory.ECONOMY}>Économique</option>
                    <option value={VehicleCategory.COMPACT}>Compacte</option>
                    <option value={VehicleCategory.MIDSIZE}>Moyenne</option>
                    <option value={VehicleCategory.FULLSIZE}>Grande</option>
                    <option value={VehicleCategory.LUXURY}>Luxe</option>
                    <option value={VehicleCategory.SUV}>SUV</option>
                    <option value={VehicleCategory.CONVERTIBLE}>Cabriolet</option>
                    <option value={VehicleCategory.VAN}>Fourgonnette</option>
                    <option value={VehicleCategory.TRUCK}>Camion</option>
                    <option value={VehicleCategory.SPORTS}>Sport</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre de places *</label>
                  <Input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value) || 1)}
                    className={errors.seats ? 'border-red-500' : ''}
                  />
                  {errors.seats && <p className="text-sm text-red-500">{errors.seats}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre de portes *</label>
                  <Input
                    type="number"
                    value={formData.doors}
                    onChange={(e) => handleInputChange('doors', parseInt(e.target.value) || 2)}
                    className={errors.doors ? 'border-red-500' : ''}
                  />
                  {errors.doors && <p className="text-sm text-red-500">{errors.doors}</p>}
                </div>
              </div>
            </div>

            {/* Engine & Performance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Moteur & Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moteur</label>
                  <Input
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                    placeholder="Ex: 1.6L Turbo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Puissance</label>
                  <Input
                    value={formData.power}
                    onChange={(e) => handleInputChange('power', e.target.value)}
                    placeholder="Ex: 150 ch"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consommation</label>
                  <Input
                    value={formData.consumption}
                    onChange={(e) => handleInputChange('consumption', e.target.value)}
                    placeholder="Ex: 6.5L/100km"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Accélération 0-100km/h</label>
                  <Input
                    value={formData.acceleration}
                    onChange={(e) => handleInputChange('acceleration', e.target.value)}
                    placeholder="Ex: 8.5s"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vitesse maximale</label>
                  <Input
                    value={formData.maxSpeed}
                    onChange={(e) => handleInputChange('maxSpeed', e.target.value)}
                    placeholder="Ex: 200 km/h"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacité coffre</label>
                  <Input
                    value={formData.trunkCapacity}
                    onChange={(e) => handleInputChange('trunkCapacity', e.target.value)}
                    placeholder="Ex: 500L"
                  />
                </div>
              </div>
            </div>

            {/* Rental Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations de Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prix par jour (DA) *</label>
                  <Input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => handleInputChange('pricePerDay', parseInt(e.target.value) || 0)}
                    className={errors.pricePerDay ? 'border-red-500' : ''}
                  />
                  {errors.pricePerDay && <p className="text-sm text-red-500">{errors.pricePerDay}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emplacement *</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="availability" className="text-sm font-medium">
                    Véhicule disponible
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Véhicule vedette
                  </label>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services de Location</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(RentalServiceType).map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.rentalServices.includes(service)}
                      onChange={() => toggleRentalService(service)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={service} className="text-sm font-medium">
                      {service === 'INDIVIDUAL' ? 'Particulier' :
                       service === 'EVENTS' ? 'Événements' :
                       service === 'ENTERPRISE' ? 'Entreprise' : service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Équipements</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ajouter un équipement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
}