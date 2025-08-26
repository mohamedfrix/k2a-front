"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarCarouselProps } from '@/types/CarCarousel';
import { getSafeImageUrl } from '@/lib/image-utils';

const CarCarousel: React.FC<CarCarouselProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);

  const maxVisibleThumbnails = 5;

  useEffect(() => {
    if (selectedIndex >= thumbnailStartIndex + maxVisibleThumbnails) {
      setThumbnailStartIndex(selectedIndex - maxVisibleThumbnails + 1);
    } else if (selectedIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(selectedIndex);
    }
  }, [selectedIndex, thumbnailStartIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 bg-surface-variant rounded-md-lg text-on-surface-variant">
        No images to display.
      </div>
    );
  }

  const selectImage = (index: number) => {
    setSelectedIndex(index);
  };

  const nextImage = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const nextStartIndex = Math.min(thumbnailStartIndex + 1, images.length - maxVisibleThumbnails);
      setThumbnailStartIndex(nextStartIndex);
    } else {
      const nextStartIndex = Math.max(thumbnailStartIndex - 1, 0);
      setThumbnailStartIndex(nextStartIndex);
    }
  };

  const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + maxVisibleThumbnails);

  return (
    <div className="relative w-full max-w-4xl mx-auto font-inter bg-background p-4 rounded-md-xl">
      {/* Main Image Display */}
      <div className="relative h-[480px] w-full overflow-hidden rounded-md-lg mb-4">
        <Image
          src={getSafeImageUrl(typeof images[selectedIndex] === 'string' ? images[selectedIndex] : images[selectedIndex].src)}
          alt={`Car image ${selectedIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="transition-opacity duration-300"
          key={selectedIndex}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/carLogin.png'; // fallback image
          }}
        />
        {/* Main Image Navigation */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous Image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next Image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="relative flex items-center justify-center">
        {images.length > maxVisibleThumbnails && (
          <button
            onClick={() => scrollThumbnails('left')}
            disabled={thumbnailStartIndex === 0}
            className="p-2 rounded-full bg-surface-variant text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed mr-2"
            aria-label="Scroll thumbnails left"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="flex items-center space-x-2 overflow-hidden" ref={thumbnailsContainerRef}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer w-28 h-20 rounded-md-sm overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index ? 'border-primary scale-105' : 'border-transparent hover:border-primary/50'
              }`}
              onClick={() => selectImage(index)}
              style={{
                display: index >= thumbnailStartIndex && index < thumbnailStartIndex + maxVisibleThumbnails ? 'block' : 'none'
              }}
            >
              <Image
                src={getSafeImageUrl(typeof image === 'string' ? image : image.src)}
                alt={`Thumbnail ${index + 1}`}
                width={112}
                height={80}
                objectFit="cover"
                className="w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/carLogin.png'; // fallback image
                }}
              />
            </div>
          ))}
        </div>
        {images.length > maxVisibleThumbnails && (
          <button
            onClick={() => scrollThumbnails('right')}
            disabled={thumbnailStartIndex >= images.length - maxVisibleThumbnails}
            className="p-2 rounded-full bg-surface-variant text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed ml-2"
            aria-label="Scroll thumbnails right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CarCarousel;