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
import { Edit } from "lucide-react";
import { Client } from "./columns-simple";

// Edit Client Dialog using manual state management
interface EditClientDialogProps {
  client: Client;
  onSave: (client: Client) => void;
  trigger: React.ReactNode;
}

export function EditClientDialog({ client, onSave, trigger }: EditClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    nom: client.nom,
    prenom: client.prenom,
    dateNaissance: client.dateNaissance,
    telephone: client.telephone,
    email: client.email || "",
    adresse: client.adresse,
    datePermis: client.datePermis,
    status: client.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle dialog opening properly to ensure centering
  useEffect(() => {
    if (mounted) {
      setOpen(true);
    }
  }, [mounted]);

  const handleTriggerClick = () => {
    setMounted(true);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setMounted(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    if (!formData.dateNaissance) {
      newErrors.dateNaissance = "La date de naissance est requise";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise";
    }
    if (!formData.datePermis) {
      newErrors.datePermis = "La date de permis est requise";
    }

    // Validate email format if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      ...client,
      ...formData,
      email: formData.email || undefined,
    });
    
    setErrors({});
    handleOpenChange(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <div onClick={handleTriggerClick} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier le Client
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  placeholder="Dupont"
                  className={errors.nom ? "border-red-500" : ""}
                />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-prenom">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  placeholder="Jean"
                  className={errors.prenom ? "border-red-500" : ""}
                />
                {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dateNaissance">Date de Naissance *</Label>
              <Input
                id="edit-dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                className={errors.dateNaissance ? "border-red-500" : ""}
              />
              {errors.dateNaissance && <p className="text-red-500 text-sm">{errors.dateNaissance}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-telephone">Téléphone *</Label>
                <Input
                  id="edit-telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className={errors.telephone ? "border-red-500" : ""}
                />
                {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="jean.dupont@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-adresse">Adresse *</Label>
              <Input
                id="edit-adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange("adresse", e.target.value)}
                placeholder="123 Rue de la République, 75001 Paris"
                className={errors.adresse ? "border-red-500" : ""}
              />
              {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-datePermis">Date de Permis *</Label>
                <Input
                  id="edit-datePermis"
                  type="date"
                  value={formData.datePermis}
                  onChange={(e) => handleInputChange("datePermis", e.target.value)}
                  className={errors.datePermis ? "border-red-500" : ""}
                />
                {errors.datePermis && <p className="text-red-500 text-sm">{errors.datePermis}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as "Actif" | "Inactif" | "Suspendu")}
                  className="w-full h-9 px-3 py-1 text-sm border border-input bg-background rounded-md"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}