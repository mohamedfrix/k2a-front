import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { CarSpecsCardProps } from '@/types';

const CarSpecsCard: React.FC<CarSpecsCardProps> = ({ 
  specifications, 
  equipements, 
  className = "" 
}) => {
  const { t } = useLanguage();

  return (
    <div className={`card-elevated bg-surface text-on-surface w-full ${className}`}>
      {/* Header */}
      <h2 className="font-unbounded text-xl sm:text-2xl font-semibold text-on-surface mb-6">
        {t('carSpecs.title')}
      </h2>
      
      {/* Specifications Grid - More responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Column 1 */}
        <div className="space-y-4">
          {/* Brand */}
          {specifications.marque ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.brand')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.marque}
              </p>
            </div>
          ) : null}

          {/* Model */}
          {specifications.modele ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.model')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.modele}
              </p>
            </div>
          ) : null}
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {/* Year */}
          {specifications.annee ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.year')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.annee}
              </p>
            </div>
          ) : null}

          {/* Color */}
          {specifications.couleur ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.color')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.couleur}
              </p>
            </div>
          ) : null}
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          {/* Engine */}
          {specifications.typeDeMoteur ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.engineType')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.typeDeMoteur}
              </p>
            </div>
          ) : null}

          {/* Transmission */}
          {specifications.transmission ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.transmission')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.transmission}
              </p>
            </div>
          ) : null}
        </div>

        {/* Column 4 */}
        <div className="space-y-4">
          {/* Fuel Type */}
          {specifications.typeDeCarburant ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.fuelType')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.typeDeCarburant}
              </p>
            </div>
          ) : null}

          {/* Capacity */}
          {specifications.capacite ? (
            <div className="py-3 border-b border-outline-variant">
              <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                {t('carSpecs.specifications.capacity')}
              </span>
              <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">
                {specifications.capacite}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      
      {/* Detailed Specifications - optional values shown here */}
      <div className="mt-4 mb-6">
        <h3 className="font-unbounded text-lg sm:text-xl font-medium text-on-surface mb-4">
          {t('carSpecs.titleDetailed') || t('carSpecs.title')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Power */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.power')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.puissance || 'N/A'}</p>
          </div>

          {/* Consumption */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.consumption')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.consommation || 'N/A'}</p>
          </div>

          {/* Acceleration */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.acceleration')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.acceleration || 'N/A'}</p>
          </div>

          {/* Max Speed */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.maxSpeed')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.vitesseMax || 'N/A'}</p>
          </div>

          {/* Trunk Capacity */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.trunkCapacity')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.coffre || 'N/A'}</p>
          </div>

          {/* Mileage */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.mileage')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.mileage ?? 'N/A'}</p>
          </div>

          {/* Doors */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.doors')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.doors ?? 'N/A'}</p>
          </div>

          {/* License Plate */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.licensePlate')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.licensePlate || 'N/A'}</p>
          </div>

          {/* VIN */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.vin')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.vin || 'N/A'}</p>
          </div>

          {/* Category */}
          <div className="py-2 border-b border-outline-variant">
            <span className="font-inter text-xs sm:text-sm font-medium text-on-surface-variant uppercase tracking-wider">{t('carSpecs.specifications.category')}</span>
            <p className="font-inter font-semibold text-on-surface mt-1 text-sm sm:text-base">{specifications.category || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="border-t border-outline-variant pt-6">
        <h3 className="font-unbounded text-lg sm:text-xl font-medium text-on-surface mb-4">
          {t('carSpecs.equipment')}
        </h3>
        

        {equipements.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {equipements.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 py-2">
                {item.available ? (
                  <div className="bg-success rounded-full p-1 flex-shrink-0">
                    <Check className="w-3 h-3 text-on-success" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-outline rounded-full flex-shrink-0" />
                )}
                <span className={`font-inter text-xs sm:text-sm ${
                  item.available 
                    ? 'text-on-surface font-medium' 
                    : 'text-on-surface-variant line-through'
                }`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-on-surface-variant">{t('carSpecs.noEquipment') || 'No equipment listed'}</p>
        )}
      </div>
    </div>
  );
};

export default CarSpecsCard;
