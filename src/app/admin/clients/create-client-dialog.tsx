"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { Client } from "./columns-simple";

// Create Client Dialog using manual state management
interface CreateClientDialogProps {
  onSave: (client: Omit<Client, "id">) => void;
}

export function CreateClientDialog({ onSave }: CreateClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    telephone: "",
    email: "",
    adresse: "",
    datePermis: "",
    status: "Actif" as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

    onSave(formData);
    
    // Reset form and close dialog
    setFormData({
      nom: "",
      prenom: "",
      dateNaissance: "",
      telephone: "",
      email: "",
      adresse: "",
      datePermis: "",
      status: "Actif",
    });
    setErrors({});
    setOpen(false);
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
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Créer un Client
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="sm:max-w-[600px] data-[state=open]:animate-none data-[state=closed]:animate-none"
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            padding: '24px',
            borderRadius: '8px',
            maxHeight: '80vh',
            overflowY: 'auto',
            transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
            opacity: 1,
            scale: 1
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
              Créer un Nouveau Client
            </DialogTitle>
            <DialogDescription style={{ color: '#6b7280' }}>
              Remplissez les informations pour créer un nouveau client.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4" style={{ color: 'black' }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" style={{ color: 'black' }}>Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  placeholder="Dupont"
                  style={{ 
                    backgroundColor: 'white',
                    border: errors.nom ? '1px solid #ef4444' : '1px solid #d1d5db',
                    color: 'black'
                  }}
                />
                {errors.nom && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.nom}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prenom" style={{ color: 'black' }}>Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  placeholder="Jean"
                  style={{ 
                    backgroundColor: 'white',
                    border: errors.prenom ? '1px solid #ef4444' : '1px solid #d1d5db',
                    color: 'black'
                  }}
                />
                {errors.prenom && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.prenom}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateNaissance" style={{ color: 'black' }}>Date de Naissance *</Label>
              <Input
                id="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange("dateNaissance", e.target.value)}
                style={{ 
                  backgroundColor: 'white',
                  border: errors.dateNaissance ? '1px solid #ef4444' : '1px solid #d1d5db',
                  color: 'black'
                }}
              />
              {errors.dateNaissance && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.dateNaissance}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephone" style={{ color: 'black' }}>Téléphone *</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  style={{ 
                    backgroundColor: 'white',
                    border: errors.telephone ? '1px solid #ef4444' : '1px solid #d1d5db',
                    color: 'black'
                  }}
                />
                {errors.telephone && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.telephone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: 'black' }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="jean.dupont@email.com"
                  style={{ 
                    backgroundColor: 'white',
                    border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                    color: 'black'
                  }}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse" style={{ color: 'black' }}>Adresse *</Label>
              <Input
                id="adresse"
                value={formData.adresse}
                onChange={(e) => handleInputChange("adresse", e.target.value)}
                placeholder="123 Rue de la République, 75001 Paris"
                style={{ 
                  backgroundColor: 'white',
                  border: errors.adresse ? '1px solid #ef4444' : '1px solid #d1d5db',
                  color: 'black'
                }}
              />
              {errors.adresse && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.adresse}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datePermis" style={{ color: 'black' }}>Date de Permis *</Label>
                <Input
                  id="datePermis"
                  type="date"
                  value={formData.datePermis}
                  onChange={(e) => handleInputChange("datePermis", e.target.value)}
                  style={{ 
                    backgroundColor: 'white',
                    border: errors.datePermis ? '1px solid #ef4444' : '1px solid #d1d5db',
                    color: 'black'
                  }}
                />
                {errors.datePermis && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.datePermis}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status" style={{ color: 'black' }}>Statut</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as "Actif" | "Inactif" | "Suspendu")}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    color: 'black'
                  }}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Suspendu">Suspendu</option>
                </select>
              </div>
            </div>

            <DialogFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}