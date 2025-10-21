
import React, { useState, useRef, useEffect } from 'react';

interface ImageCompareSliderProps {
  originalImage: string;
  enhancedImage: string;
}

const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ originalImage, enhancedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  return (
    <div ref={containerRef} className="relative w-full aspect-video overflow-hidden rounded-lg select-none">
      <img
        src={enhancedImage}
        alt="Ảnh đã làm nét"
        className="absolute top-0 left-0 w-full h-full object-contain"
      />
      <img
        src={originalImage}
        alt="Ảnh gốc"
        className="absolute top-0 left-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div
        className="absolute top-0 bottom-0 bg-white w-1 cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-arrows-alt-h text-gray-700"></i>
        </div>
      </div>
       <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 rounded-md text-sm font-bold">ẢNH GỐC</div>
       <div className="absolute top-2 right-2 px-3 py-1 bg-black/60 rounded-md text-sm font-bold">ĐÃ LÀM NÉT</div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize"
      />
    </div>
  );
};

export default ImageCompareSlider;
