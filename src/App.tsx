import React, { useState } from 'react';
import { PhotoGrid } from './components/PhotoGrid';
import { FolderNavigation } from './components/FolderNavigation';
import { MovePhotoModal } from './components/MovePhotoModal';
import { ConfigurationCheck } from './components/ConfigurationCheck';
import { useS3Photos } from './hooks/useS3Photos';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [currentPath, setCurrentPath] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  
  const { photos, folderStructure, isLoading, refreshPhotos } = useS3Photos(currentPath);

  const handleFolderClick = (folder: string) => {
    setCurrentPath(folder);
    refreshPhotos();
  };

  const handleNavigateUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const newPath = parts.length > 0 ? `${parts.join('/')}/` : '';
    setCurrentPath(newPath);
    refreshPhotos();
  };

  return (
    <ConfigurationCheck>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Photo Manager</h1>
          
          <FolderNavigation
            currentPath={currentPath}
            folderStructure={folderStructure}
            onFolderClick={handleFolderClick}
            onNavigateUp={handleNavigateUp}
            onUploadSuccess={refreshPhotos}
          />

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading photos...</p>
            </div>
          ) : (
            <PhotoGrid
              photos={photos}
              onDelete={() => refreshPhotos()}
              onMove={() => setIsMoveModalOpen(true)}
              setSelectedPhotos={setSelectedPhotos}
            />
          )}

          {isMoveModalOpen && (
            <MovePhotoModal
              isOpen={isMoveModalOpen}
              onClose={() => setIsMoveModalOpen(false)}
              selectedPhotos={selectedPhotos}
              currentPath={currentPath}
              folderStructure={folderStructure}
              onMove={refreshPhotos}
            />
          )}
        </div>
        <Toaster position="bottom-right" />
      </div>
    </ConfigurationCheck>
  );
}