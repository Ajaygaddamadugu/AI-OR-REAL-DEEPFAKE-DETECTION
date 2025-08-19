import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  selectedVideo: File | null;
  onClearVideo: () => void;
  isAnalyzing: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoSelect,
  selectedVideo,
  onClearVideo,
  isAnalyzing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid video file (MP4, AVI, MOV, or WebM)';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }
    
    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    onVideoSelect(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (selectedVideo) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Selected Video</h3>
          {!isAnalyzing && (
            <button
              onClick={onClearVideo}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedVideo.name}
            </p>
            <p className="text-sm text-gray-500">
              {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload a video for analysis
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop your video here, or click to browse
        </p>
        
        <div className="text-xs text-gray-400">
          Supported formats: MP4, AVI, MOV, WebM • Max size: 100MB
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};