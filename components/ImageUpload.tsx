
import React, { useRef, useCallback } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
  onImageRemove: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, imagePreview, onImageRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
  }

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
          onImageUpload(event.dataTransfer.files[0]);
      }
  }, [onImageUpload]);

  return (
    <div className="w-full p-4 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg text-center">
      <h3 className="text-lg font-semibold text-gray-200 mb-3">Tải ảnh gốc của bạn lên</h3>
      {imagePreview ? (
        <div className="relative group">
          <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-60 object-contain rounded-md mx-auto" />
          <div 
            onClick={onImageRemove}
            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-red-600 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i className="fas fa-times text-white"></i>
          </div>
        </div>
      ) : (
        <div 
            className="flex flex-col items-center justify-center p-6 cursor-pointer" 
            onClick={() => inputRef.current?.click()}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
          />
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-4"></i>
          <p className="text-gray-400">Kéo và thả ảnh hoặc <span className="text-indigo-400 font-semibold">nhấn để chọn file</span></p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
