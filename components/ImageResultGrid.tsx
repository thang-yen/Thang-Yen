
import React from 'react';
import Loader from './Loader';

interface ImageResultGridProps {
  images: string[];
  isLoading: boolean;
}

const ImageResultGrid: React.FC<ImageResultGridProps> = ({ images, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (images.length === 0) {
    return (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
            <i className="fas fa-images text-5xl text-gray-600 mb-4"></i>
            <p className="text-gray-500">Kết quả sẽ được hiển thị ở đây</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((src, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg group">
          <img src={src} alt={`Generated image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <a href={src} download={`generated-image-${index+1}.jpg`} className="absolute bottom-2 right-2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fas fa-download"></i>
          </a>
        </div>
      ))}
    </div>
  );
};

export default ImageResultGrid;
