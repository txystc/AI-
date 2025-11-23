import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  subLabel: string;
  imagePreview: string | null;
  onImageSelected: (file: File) => void;
  onClear: () => void;
  id: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  subLabel,
  imagePreview,
  onImageSelected,
  onClear,
  id
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      
      <div 
        className={`
          relative flex flex-col items-center justify-center w-full flex-grow
          min-h-[250px] border-2 border-dashed rounded-xl transition-all duration-300
          ${imagePreview 
            ? 'border-indigo-200 bg-slate-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 cursor-pointer'}
        `}
        onClick={!imagePreview ? triggerUpload : undefined}
      >
        <input
          id={id}
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {imagePreview ? (
          <div className="relative w-full h-full p-2 group">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg shadow-sm"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                // Reset file input value
                if(fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-full shadow-md text-slate-600 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6 space-y-3">
            <div className="p-4 bg-indigo-50 rounded-full text-indigo-500">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-700">点击上传</p>
              <p className="text-sm text-slate-400 mt-1">{subLabel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};