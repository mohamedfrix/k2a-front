// src/types/PriceCard.ts

/**
 * Props for the PriceCard component (Car Rental Card).
 */
export interface PriceCardProps {
  /** The name/model of the car (e.g., "Audi A1 2023"). */
  carName: string;
  
  /** The availability status of the car. */
  isAvailable: boolean;
  
  /** The price of the car rental (e.g., "23,000"). */
  price: string;
  
  /** The location where the car is available (e.g., "Berline", "SUV"). */
  location: string;
  
  /** The transmission type (e.g., "Automatique", "Manuel"). */
  transmission: string;
  
  /**
   * Optional click handler for the card.
   */
  onClick?: () => void;
}
