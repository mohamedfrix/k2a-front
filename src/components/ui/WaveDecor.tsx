/**
 * Wave Decorator Component
 * 
 * Creates a wave effect for page section transitions
 * Used to separate the orange header from white content
 */

'use client';

import React from 'react';
import type { WaveDecorProps } from '@/types/CarsPage';

export function WaveDecor({ className = '', color = 'bg-primary' }: WaveDecorProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Wave SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full h-12 sm:h-16 md:h-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          transition: 'all 0.3s ease'
        }}
      >
        {/* Main wave path */}
        <path
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          style={{
            fill: `rgb(var(--md-background))`,
            transition: 'fill 0.3s ease'
          }}
          className="drop-shadow-lg"
        />
      </svg>
    </div>
  );
}

export default WaveDecor;
