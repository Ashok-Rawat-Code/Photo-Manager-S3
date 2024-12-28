import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { generateThumbnail, uploadToS3 } from '../utils/imageUtils';

interface PhotoUploaderProps {
  currentPath: string;
  onUploadSuccess: () => void;
}

export function PhotoUploader({ currentPath, onUploadSuccess }: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const uploadFile = async (file: File) => {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const fullPath = `${currentPath}${filename}`;
    
    await uploadToS3(file, fullPath, file.type);
    
    const thumbnail = await generateThumbnail(file);
    const thumbnailPath = fullPath.replace(/(.+)(\.[^.]+)$/, '$1_thumb.jpg');
    await uploadToS3(thumbnail, thumbnailPath);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!currentPath) {
      toast.error('Please select an album first before uploading photos');
      return;
    }

    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setProgress({ current: 0, total: acceptedFiles.length });

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        await uploadFile(acceptedFiles[i]);
        setProgress(prev => ({ ...prev, current: i + 1 }));
      }

      toast.success(`Successfully uploaded ${acceptedFiles.length} photo${acceptedFiles.length > 1 ? 's' : ''}!`);
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload some photos. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress({ current: 0, total: 0 });
    }
  }, [currentPath, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
    },
    disabled: isUploading || !currentPath,
    multiple: true
  });

  if (!currentPath) {
    return null;
  }

  return (
    <div
      {...getRootProps()}
      className={`p-4 md:p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors touch-manipulation mb-4
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <PhotoIcon className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
        {isUploading ? (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">
              Uploading... {progress.current}/{progress.total}
            </p>
            <div className="w-36 md:w-48 h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : isDragActive ? (
          <p className="mt-2 text-sm text-gray-600">Drop your photos here...</p>
        ) : (
          <p className="mt-2 text-sm text-center text-gray-600">
            {window.innerWidth <= 768 ? 'Tap to select photos' : 'Drag & drop photos here, or click to select'}
          </p>
        )}
      </div>
    </div>
  );
}