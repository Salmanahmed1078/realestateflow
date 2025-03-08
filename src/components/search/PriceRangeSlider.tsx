
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { formatPrice } from '../../data/properties';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  onChange: (minPrice: number, maxPrice: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 50000,
  onChange
}) => {
  const [priceRange, setPriceRange] = useState([min, max]);

  useEffect(() => {
    // Update component if min/max props change
    setPriceRange([min, max]);
  }, [min, max]);

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onChange(values[0], values[1]);
  };

  // Logarithmic scale for better UX with large price ranges
  const logScale = (value: number) => {
    const minLog = Math.log(min || 1);
    const maxLog = Math.log(max);
    const scale = (Math.log(value) - minLog) / (maxLog - minLog);
    return scale * (max - min) + min;
  };

  const inverseLogScale = (value: number) => {
    const minLog = Math.log(min || 1);
    const maxLog = Math.log(max);
    const normalized = (value - min) / (max - min);
    return Math.exp(minLog + normalized * (maxLog - minLog));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Price Range</span>
        <div className="text-sm">
          <span className="font-semibold">{formatPrice(priceRange[0])}</span>
          <span className="mx-2">-</span>
          <span className="font-semibold">{formatPrice(priceRange[1])}</span>
        </div>
      </div>
      
      <Slider 
        defaultValue={[min, max]}
        value={priceRange}
        min={min}
        max={max}
        step={step}
        onValueChange={handlePriceChange}
        className="w-full"
      />

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max / 2)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
