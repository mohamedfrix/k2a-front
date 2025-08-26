'use client';

import React from 'react';
import { RangeSliderProps } from '@/types/FilterComponents';

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
  formatValue = (val) => val.toString(),
  step = 1
}) => {
  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.min(newMin, value[1]);
    onChange([clampedMin, value[1]]);
  };

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.max(newMax, value[0]);
    onChange([value[0], clampedMax]);
  };

  // Calculate positions for the range visualization
  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-on-surface">
        {label}
      </label>
      
      {/* Range visualization */}
      <div className="relative">
        <div className="h-2 bg-surface-variant rounded-full">
          <div 
            className="h-2 bg-primary rounded-full absolute"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
        </div>
        
        {/* Range inputs */}
        <div className="relative -mt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value[1]}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{ zIndex: 2 }}
          />
        </div>
      </div>
      
      {/* Value display */}
      <div className="flex justify-between text-sm text-on-surface-variant">
        <span>{formatValue(value[0])}</span>
        <span>{formatValue(value[1])}</span>
      </div>
      
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: rgb(var(--md-primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: rgb(var(--md-primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};
