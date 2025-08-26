/**
 * Utility functions for handling vehicle images and Minio URLs
 */

/**
 * Get the Minio image URL prefix from environment variables
 * @returns The base URL for Minio images
 */
export const getMinioImagePrefix = (): string => {
  return process.env.NEXT_PUBLIC_MINIO_IMAGE_PREFIX || 'http://127.0.0.1:9000/vehicle-images/';
};

/**
 * Convert a Minio image key to a full URL
 * @param imageKey - The Minio object key/path
 * @returns The full URL to the image
 */
export const getImageUrl = (imageKey: string): string => {
  if (!imageKey) return getPlaceholderImageUrl();
  
  // If the imageKey is already a full URL (starts with http), return as is
  if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
    return imageKey;
  }
  
  // Otherwise, construct the URL using the Minio prefix
  const prefix = getMinioImagePrefix();
  // Ensure there's no double slash
  const cleanKey = imageKey.startsWith('/') ? imageKey.slice(1) : imageKey;
  const cleanPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
  
  return `${cleanPrefix}${cleanKey}`;
};

/**
 * Get a placeholder image URL for when no image is available
 * @returns URL to a placeholder image
 */
export const getPlaceholderImageUrl = (): string => {
  return '/images/carLogin.png'; // Using the existing fallback image
};

/**
 * Handle image loading errors by providing a fallback
 * @param imageKey - The original image key
 * @returns A fallback image URL or placeholder
 */
export const getImageUrlWithFallback = (imageKey: string): string => {
  try {
    return getImageUrl(imageKey);
  } catch (error) {
    console.warn('Error constructing image URL:', error);
    return getPlaceholderImageUrl();
  }
};

/**
 * Check if an image URL is valid and accessible
 * @param imageUrl - The image URL to check
 * @returns Promise<boolean> - True if image is accessible
 */
export const isImageAccessible = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get a safe image URL that won't cause infinite retries
 * @param imageKey - The original image key
 * @returns A safe image URL with proper fallback
 */
export const getSafeImageUrl = (imageKey: string): string => {
  // If no image key provided, return placeholder immediately
  if (!imageKey || imageKey.trim() === '') {
    return getPlaceholderImageUrl();
  }
  
  // For development, if the image key contains specific vehicle names that we know don't exist,
  // return placeholder immediately to prevent 404 loops
  const missingImagePatterns = [
    'bmw-x3.jpg', 'bmw-320i.jpg', 'audi-q5.jpg', 'audi-a4.jpg',
    'mercedes-glc.jpg', 'mercedes-c-class.jpg', 'toyota-camry.jpg',
    'toyota-rav4.jpg', 'hyundai-tucson.jpg', 'range-rover-evoque.jpg'
  ];
  
  const isKnownMissingImage = missingImagePatterns.some(pattern => 
    imageKey.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (isKnownMissingImage) {
    return getPlaceholderImageUrl();
  }
  
  return getImageUrl(imageKey);
};