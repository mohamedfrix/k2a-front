"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X } from "lucide-react";
import { 
  CreateVehicleForm, 
  FuelType, 
  Transmission, 
  VehicleCategory, 
  RentalServiceType,
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
  getCategoryDisplayName,
  getRentalServiceDisplayName
} from "@/types/AdminVehicle";

// Simple image preview component
function ImagePreview({ file, index, onRemove }: { file: File; index: number; onRemove: () => void }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Create object URL when component mounts
  useEffect(() => {
    try {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setIsLoading(false); // Set loading to false once URL is created
      
      // Cleanup function
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } catch (error) {
      console.error('Failed to create object URL:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [file]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', file.name);
  };

  const handleImageError = () => {
    setHasError(true);
    console.error('Failed to load image:', file.name);
  };

  return (
    <div className="relative group">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-500">
            <X className="h-8 w-8 mb-2" />
            <span className="text-xs text-center px-2">Erreur de chargement</span>
          </div>
        ) : isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-xs text-gray-500 mt-2">Chargement...</span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={file.name}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <Upload className="h-6 w-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Image</span>
          </div>
        )}
      </div>
      
      {/* Overlay with remove button */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all"
          title="Supprimer cette image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Image number */}
      <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        {index + 1}
      </div>
      
      {/* Primary badge */}
      {index === 0 && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          Principal
        </div>
      )}
      
      {/* File info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg">
        <div className="truncate">{file.name}</div>
        <div className="text-gray-300">{(file.size / 1024 / 1024).toFixed(1)}MB</div>
      </div>
    </div>
  );
}

interface CreateVehicleDialogProps {
  onSave: (vehicle: CreateVehicleForm, images: File[]) => void;
}

export function CreateVehicleDialog({ onSave }: CreateVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleForm>({
    // Basic Information
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    licensePlate: "",
    
    // Specifications
    fuelType: FuelType.GASOLINE,
    transmission: Transmission.MANUAL,
    seats: 5,
    doors: 4,
    category: VehicleCategory.ECONOMY,
    
    // Pricing & Location
    pricePerDay: 0,
    location: "",
    
    // Rental Services
    rentalServices: [RentalServiceType.INDIVIDUAL],
    
    // Optional Fields
    vin: "",
    mileage: 0,
    description: "",
    engine: "",
    power: "",
    consumption: "",
    acceleration: "",
    maxSpeed: "",
    trunkCapacity: "",
    features: [],
    featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInput, setFeatureInput] = useState("");

  const validateForm = () => {
    console.log("Validating form with data:", formData);
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.make.trim()) newErrors.make = "La marque est requise";
    if (!formData.model.trim()) newErrors.model = "Le modèle est requis";
    if (!formData.color.trim()) newErrors.color = "La couleur est requise";
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "La plaque d'immatriculation est requise";
    if (!formData.location.trim()) newErrors.location = "La localisation est requise";
    if (formData.pricePerDay <= 0) newErrors.pricePerDay = "Le prix par jour doit être supérieur à 0";
    if (formData.seats < 1) newErrors.seats = "Le nombre de sièges doit être d'au moins 1";
    if (formData.doors < 2) newErrors.doors = "Le nombre de portes doit être d'au moins 2";
    if (formData.rentalServices.length === 0) newErrors.rentalServices = "Au moins un service de location est requis";

    // VIN validation (17 characters if provided)
    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = "Le VIN doit faire exactement 17 caractères";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log("Form is valid:", isValid);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form submitted!", formData);
    console.log("Images in state:", images);
    console.log("Form validation starting...");
    
    if (!validateForm()) {
      console.log("Form validation failed!");
      return;
    }

    console.log("Form validation passed, preparing data...");

    // Clean up form data before submission
    const cleanFormData = {
      ...formData,
      vin: formData.vin?.trim() || undefined,
      mileage: formData.mileage || undefined,
      description: formData.description?.trim() || undefined,
      engine: formData.engine?.trim() || undefined,
      power: formData.power?.trim() || undefined,
      consumption: formData.consumption?.trim() || undefined,
      acceleration: formData.acceleration?.trim() || undefined,
      maxSpeed: formData.maxSpeed?.trim() || undefined,
      trunkCapacity: formData.trunkCapacity?.trim() || undefined,
    };

    console.log("Clean form data:", cleanFormData);
    console.log(`Images to upload: ${images.length} files`);
    console.log("Calling onSave...");

    try {
      onSave(cleanFormData, images);
      console.log("onSave called successfully");
      
      // Reset form and close dialog
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error in onSave:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      licensePlate: "",
      fuelType: FuelType.GASOLINE,
      transmission: Transmission.MANUAL,
      seats: 5,
      doors: 4,
      category: VehicleCategory.ECONOMY,
      pricePerDay: 0,
      location: "",
      rentalServices: [RentalServiceType.INDIVIDUAL],
      vin: "",
      mileage: 0,
      description: "",
      engine: "",
      power: "",
      consumption: "",
      acceleration: "",
      maxSpeed: "",
      trunkCapacity: "",
      features: [],
      featured: false,
    });
    setImages([]);
    setErrors({});
    setFeatureInput("");
  };

  const handleInputChange = <K extends keyof CreateVehicleForm>(
    field: K,
    value: CreateVehicleForm[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageUpload called");
    console.log("Files selected:", e.target.files);
    
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      console.log("New images array:", newImages);
      console.log("Number of files:", newImages.length);
      
      // Filter images that are too large (10MB limit)
      const validImages = newImages.filter(file => {
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          alert(`L'image "${file.name}" est trop volumineuse. Taille maximale: 10MB`);
          return false;
        }
        return true;
      });
      
      console.log("Valid images:", validImages);
      console.log("Current images before update:", images);
      
      setImages(prev => {
        const updated = [...prev, ...validImages];
        console.log("Updated images array:", updated);
        return updated;
      });
      
      // Clear the input value to allow selecting the same files again
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) {
      alert('Aucune image valide trouvée. Veuillez sélectionner des fichiers image (JPG, PNG, GIF, WebP).');
      return;
    }
    
    // Filter images that are too large (10MB limit)
    const validImages = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert(`L'image "${file.name}" est trop volumineuse. Taille maximale: 10MB`);
        return false;
      }
      return true;
    });
    
    if (validImages.length > 0) {
      setImages(prev => [...prev, ...validImages]);
      
      // Show success message for multiple files
      if (validImages.length > 1) {
        alert(`${validImages.length} images ajoutées avec succès!`);
      }
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features?.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };

  const toggleRentalService = (service: RentalServiceType) => {
    setFormData(prev => {
      const services = prev.rentalServices.includes(service)
        ? prev.rentalServices.filter(s => s !== service)
        : [...prev.rentalServices, service];
      return { ...prev, rentalServices: services };
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Créer un Véhicule
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">
              Créer un Nouveau Véhicule
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Remplissez les informations pour créer un nouveau véhicule.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 text-black">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Informations de Base</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make" className="text-black">Marque *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    placeholder="Toyota"
                    className={`bg-white text-black ${errors.make ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model" className="text-black">Modèle *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Corolla"
                    className={`bg-white text-black ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-black">Année *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", parseInt(e.target.value))}
                    className="bg-white text-black border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-black">Couleur *</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="Blanc"
                    className={`bg-white text-black ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.color && <p className="text-red-500 text-sm">{errors.color}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licensePlate" className="text-black">Plaque d'Immatriculation *</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    placeholder="123-AL-4567"
                    className={`bg-white text-black ${errors.licensePlate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.licensePlate && <p className="text-red-500 text-sm">{errors.licensePlate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vin" className="text-black">VIN (optionnel)</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    className="bg-white text-black border-gray-300"
                  />
                  {errors.vin && <p className="text-red-500 text-sm">{errors.vin}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-black">Kilométrage (optionnel)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage || ""}
                    onChange={(e) => handleInputChange("mileage", parseInt(e.target.value) || 0)}
                    placeholder="35000"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Spécifications</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="text-black">Type de Carburant *</Label>
                  <select
                    id="fuelType"
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange("fuelType", e.target.value as FuelType)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.values(FuelType).map(type => (
                      <option key={type} value={type}>
                        {getFuelTypeDisplayName(type)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transmission" className="text-black">Transmission *</Label>
                  <select
                    id="transmission"
                    value={formData.transmission}
                    onChange={(e) => handleInputChange("transmission", e.target.value as Transmission)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.values(Transmission).map(type => (
                      <option key={type} value={type}>
                        {getTransmissionDisplayName(type)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-black">Nombre de Sièges *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.seats}
                    onChange={(e) => handleInputChange("seats", parseInt(e.target.value))}
                    className="bg-white text-black border-gray-300"
                  />
                  {errors.seats && <p className="text-red-500 text-sm">{errors.seats}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doors" className="text-black">Nombre de Portes *</Label>
                  <Input
                    id="doors"
                    type="number"
                    min="2"
                    max="6"
                    value={formData.doors}
                    onChange={(e) => handleInputChange("doors", parseInt(e.target.value))}
                    className="bg-white text-black border-gray-300"
                  />
                  {errors.doors && <p className="text-red-500 text-sm">{errors.doors}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-black">Catégorie *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value as VehicleCategory)}
                    className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.values(VehicleCategory).map(category => (
                      <option key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Prix et Localisation</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay" className="text-black">Prix par Jour (DA) *</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={(e) => handleInputChange("pricePerDay", parseFloat(e.target.value))}
                    placeholder="5000"
                    className="bg-white text-black border-gray-300"
                  />
                  {errors.pricePerDay && <p className="text-red-500 text-sm">{errors.pricePerDay}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-black">Localisation *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Alger, Algérie"
                    className="bg-white text-black border-gray-300"
                  />
                  {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Rental Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Services de Location *</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(RentalServiceType).map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={service}
                      checked={formData.rentalServices.includes(service)}
                      onChange={() => toggleRentalService(service)}
                      className="accent-blue-500"
                    />
                    <Label htmlFor={service} className="text-black">
                      {getRentalServiceDisplayName(service)}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.rentalServices && <p className="text-red-500 text-sm">{errors.rentalServices}</p>}
            </div>

            {/* Performance Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Spécifications de Performance (Optionnel)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engine" className="text-black">Moteur</Label>
                  <Input
                    id="engine"
                    value={formData.engine}
                    onChange={(e) => handleInputChange("engine", e.target.value)}
                    placeholder="2.0L Turbo"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="power" className="text-black">Puissance</Label>
                  <Input
                    id="power"
                    value={formData.power}
                    onChange={(e) => handleInputChange("power", e.target.value)}
                    placeholder="248 CV"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consumption" className="text-black">Consommation</Label>
                  <Input
                    id="consumption"
                    value={formData.consumption}
                    onChange={(e) => handleInputChange("consumption", e.target.value)}
                    placeholder="6.8L/100km"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="acceleration" className="text-black">Accélération</Label>
                  <Input
                    id="acceleration"
                    value={formData.acceleration}
                    onChange={(e) => handleInputChange("acceleration", e.target.value)}
                    placeholder="6.3s (0-100km/h)"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxSpeed" className="text-black">Vitesse Max</Label>
                  <Input
                    id="maxSpeed"
                    value={formData.maxSpeed}
                    onChange={(e) => handleInputChange("maxSpeed", e.target.value)}
                    placeholder="235 km/h"
                    className="bg-white text-black border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunkCapacity" className="text-black">Capacité du Coffre</Label>
                <Input
                  id="trunkCapacity"
                  value={formData.trunkCapacity}
                  onChange={(e) => handleInputChange("trunkCapacity", e.target.value)}
                  placeholder="550L"
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Équipements</h3>
              
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Ajouter un équipement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="bg-white text-black border-gray-300"
                />
                <Button type="button" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                  >
                    <span className="text-black">{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("description", e.target.value)}
                placeholder="Description détaillée du véhicule..."
                rows={3}
                maxLength={1000}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-black">Images du Véhicule</h3>
              
              {/* Upload Zone */}
              <div className="space-y-3">
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                      : images.length > 0 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full ${
                      isDragOver ? 'bg-blue-100' : images.length > 0 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Upload className={`h-8 w-8 ${
                        isDragOver ? 'text-blue-500' : images.length > 0 ? 'text-green-500' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h4 className={`text-lg font-medium ${
                        isDragOver ? 'text-blue-700' : images.length > 0 ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {isDragOver 
                          ? 'Relâchez pour ajouter les images' 
                          : images.length > 0 
                            ? `${images.length} image${images.length > 1 ? 's' : ''} sélectionnée${images.length > 1 ? 's' : ''}`
                            : 'Ajoutez des images du véhicule'
                        }
                      </h4>
                      
                      <p className={`text-sm ${
                        isDragOver ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {!isDragOver && (
                          <>
                            Glissez-déposez vos images ici ou{" "}
                            <label htmlFor="images" className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium underline">
                              parcourez vos fichiers
                            </label>
                          </>
                        )}
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-1 rounded">JPG</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">PNG</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">GIF</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Max 10MB</span>
                      </div>
                    </div>
                    
                    {/* Hidden file input */}
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Sélectionner des images"
                    />
                  </div>
                </div>
                
                {/* Upload Button Alternative */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('images')?.click()}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter plus d'images
                  </Button>
                </div>
              </div>
              
              {/* Image Previews */}
              {images.length > 0 && (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-md font-medium text-black">
                        Images sélectionnées
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {images.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                    >
                      Supprimer toutes
                    </button>
                  </div>
                  
                  {/* Simple Preview Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <ImagePreview 
                        key={`img-${index}`}
                        file={image}
                        index={index}
                        onRemove={() => removeImage(index)}
                      />
                    ))}
                  </div>
                  
                  {/* Simple List Fallback */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Liste des fichiers:</h5>
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">{index + 1}</span>
                          <span className="text-sm text-gray-700">{image.name}</span>
                          <span className="text-xs text-gray-500">({(image.size / 1024 / 1024).toFixed(1)}MB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-blue-500 mt-0.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Conseils pour de meilleures images :</p>
                        <ul className="text-xs space-y-1 text-blue-600">
                          <li>• La première image sera utilisée comme image principale</li>
                          <li>• Utilisez des images de haute qualité (minimum 800x600)</li>
                          <li>• Montrez différents angles du véhicule</li>
                          <li>• Évitez les images floues ou mal éclairées</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("featured", e.target.checked)}
                className="accent-blue-500"
              />
              <Label htmlFor="featured" className="text-black">
                Véhicule en vedette
              </Label>
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                className="flex items-center gap-2"
              >
                Créer le Véhicule
                {images.length > 0 && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    +{images.length} image{images.length > 1 ? 's' : ''}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}