"use client";
import SimpleInputField from "@/components/ui/SimpleInputField";
import LoginImage from "../../../public/images/carLogin.png";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthError } from "@/types/Auth";

export default function Login() {
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      // Redirect is handled by AuthContext
    } catch (error) {
      console.error("Login error:", error);
      
      if (error instanceof AuthError) {
        setErrors((prev) => ({ 
          ...prev, 
          general: error.message 
        }));
      } else {
        setErrors((prev) => ({ 
          ...prev, 
          general: "Une erreur inattendue s'est produite. Veuillez réessayer." 
        }));
      }
    }
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="min-w-[400px] flex-shrink-0 w-[40%] h-full">
        {/* Logo */}
        <div className="font-bold text-3xl p-4 m-4">K2A ADMIN</div>
        
        {/* Header */}
        <div className="flex flex-col items-start justify-center gap-1 p-8">
          <div className="font-unbounded font-normal text-3xl">Bonjour</div>
          <div className="font-unbounded font-semibold text-3xl">
            Bon retour!
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-5 p-8">
            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <SimpleInputField
                name="email"
                label="Email"
                type="email"
                placeholder="Entrez votre email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <SimpleInputField
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            <div className="font-unbounded font-normal text-sm text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
              Mot de passe oublié ?
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-32 h-10 font-unbounded text-white flex justify-center items-center rounded-[10px] ml-8 transition-all ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 active:bg-primary/80'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion...</span>
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="font-unbounded font-normal self-end ml-8 mt-16 text-sm">
          Système d'administration K2A
          <br />
          <span className="text-gray-500">
            Connexion sécurisée pour les administrateurs
          </span>
        </div>
      </div>
      
      {/* Right Side Image */}
      <div className="flex-1 relative overflow-hidden hidden sm:block">
        <div className="h-[150%] w-[130%] aspect-square rounded-full bg-red-500 absolute left-20 top-2/5 -translate-y-1/2">
          <Image
            src={LoginImage}
            alt="Login"
            className="w-full h-full object-cover rounded-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
