'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  CarRentalFormProps, 
  RentalBooking, 
  AccessoryOption 
} from '@/types/PriceCalc';

export default function PriceCalc({ 
  car, 
  accessories, 
  onBookingChange,
  onSubmit,
  className = ""
}: CarRentalFormProps) {
  const { t, isRTL, textDirection } = useLanguage();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  // accessories removed from UI-level calculation by request
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // Calculate totals
  const calculateBooking = (): RentalBooking => {
    const totalDays = startDate && endDate 
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) 
      : 0;
    
    const carTotal = totalDays * car.dailyRate;
    
    // Do not include accessories in the total price (per user's request)
    const accessoriesTotal = 0;
    const grandTotal = carTotal;

    return {
      car,
      startDate,
      endDate,
      selectedAccessories,
      totalDays,
      carTotal,
      accessoriesTotal,
      grandTotal
    };
  };

  const booking = calculateBooking();

  // Notify parent of booking changes
  useEffect(() => {
    // Notify parent, but accessories are not included in the calculation
    onBookingChange?.(booking);
  }, [startDate, endDate, onBookingChange]);

  // accessory toggling removed from UI (kept stub for compatibility)
  const handleAccessoryToggle = (accessoryId: string) => {
    // no-op
  };

  const handleSubmit = () => {
    if (startDate && endDate && onSubmit) {
      onSubmit(booking);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div 
      className={`w-full bg-transparent p-0 ${className}`}
      dir={textDirection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div 
        className="mb-6 sm:mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="font-unbounded text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface mb-2">
          {t('priceCalc.title')}
        </h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="font-unbounded text-xl sm:text-2xl font-semibold text-on-surface">
            {car.make} {car.model} {car.year}
          </h2>
        </div>
        <p className="font-inter text-xl sm:text-2xl font-semibold text-primary">
          {formatCurrency(car.dailyRate)} {car.currency}{t('priceCalc.perDay')}
        </p>
      </motion.div>

      {/* Date Selection */}
      <motion.div 
        className="card-elevated bg-surface-variant/30 rounded-xl p-4 sm:p-6 mb-6"
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block font-inter text-base sm:text-lg font-semibold text-primary mb-3">
              {t('priceCalc.startDate')}:
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                dir="ltr" // Keep date input LTR for consistency
              />
              <ChevronDown className="absolute top-1/2 transform -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" 
                style={{ [isRTL ? 'left' : 'right']: '12px' }} />
            </div>
          </div>
          
          <div>
            <label className="block font-inter text-base sm:text-lg font-semibold text-primary mb-3">
              {t('priceCalc.endDate')}:
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                min={startDate ? startDate.toISOString().split('T')[0] : ''}
                className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                dir="ltr" // Keep date input LTR for consistency
              />
              <ChevronDown className="absolute top-1/2 transform -translate-y-1/2 text-on-surface-variant w-5 h-5 pointer-events-none" 
                style={{ [isRTL ? 'left' : 'right']: '12px' }} />
            </div>
          </div>
        </div>

        {booking.totalDays > 0 && (
          <motion.div 
            className={`text-${isRTL ? 'left' : 'right'}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-inter text-lg sm:text-xl font-bold text-primary">
              {t('priceCalc.carRentalPrice')}: {formatCurrency(booking.carTotal)} {car.currency}
            </p>
            <p className="font-inter text-sm text-on-surface-variant">
              {booking.totalDays} {booking.totalDays === 1 ? t('priceCalc.day') : t('priceCalc.days')}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Accessories removed from UI and totals by request */}

      {/* Total */}
      <motion.div 
        className={`text-${isRTL ? 'left' : 'right'} mb-6 sm:mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="font-unbounded text-2xl sm:text-3xl font-bold text-primary">
          {t('priceCalc.totalPrice')}: {formatCurrency(booking.grandTotal)} {car.currency}
        </h2>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!startDate || !endDate}
        className="w-full py-3 sm:py-4 px-6 bg-primary hover:bg-primary/90 disabled:bg-surface-variant disabled:cursor-not-allowed disabled:text-on-surface-variant text-on-primary font-inter font-bold text-base sm:text-xl rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        whileHover={{ scale: startDate && endDate ? 1.02 : 1 }}
        whileTap={{ scale: startDate && endDate ? 0.98 : 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {startDate && endDate ? t('priceCalc.confirmBooking') : t('priceCalc.selectDatesToContinue')}
      </motion.button>
    </motion.div>
  );
}