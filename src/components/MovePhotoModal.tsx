import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FolderIcon } from '@heroicons/react/24/outline';
import { FolderStructure } from '../types';
import { movePhoto } from '../utils/s3Utils';
import toast from 'react-hot-toast';

interface MovePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPhotos: string[];
  currentPath: string;
  folderStructure: FolderStructure;
  onMove: () => void;
}

export function MovePhotoModal({
  isOpen,
  onClose,
  selectedPhotos,
  currentPath,
  folderStructure,
  onMove
}: MovePhotoModalProps) {
  const [targetPath, setTargetPath] = useState('');
  const [isMoving, setIsMoving] = useState(false);

  const handleMove = async () => {
    setIsMoving(true);
    try {
      await Promise.all(
        selectedPhotos.map(async (photoKey) => {
          const fileName = photoKey.split('/').pop();
          const newKey = `${targetPath}${fileName}`;
          await movePhoto(photoKey, newKey);
          
          // Move thumbnail if exists
          const thumbKey = photoKey.replace(/(.+)(\.[^.]+)$/, '$1_thumb.jpg');
          const newThumbKey = newKey.replace(/(.+)(\.[^.]+)$/, '$1_thumb.jpg');
          await movePhoto(thumbKey, newThumbKey).catch(() => {});
        })
      );
      
      toast.success(`Moved ${selectedPhotos.length} photo(s) successfully!`);
      onMove();
      onClose();
    } catch (error) {
      toast.error('Failed to move some photos');
    } finally {
      setIsMoving(false);
    }
  };

  const renderFolderOption = (name: string, structure: FolderStructure, path: string = '') => {
    const fullPath = `${path}${name}/`;
    return (
      <div key={fullPath} className="space-y-2">
        <button
          onClick={() => setTargetPath(fullPath)}
          className={`flex items-center w-full p-2 rounded-lg ${
            targetPath === fullPath ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
          }`}
        >
          <FolderIcon className="w-5 h-5 mr-2" />
          <span>{fullPath || 'Root'}</span>
        </button>
        <div className="ml-4">
          {Object.entries(structure).map(([subName, subStructure]) =>
            renderFolderOption(subName, subStructure, fullPath)
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Move {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''}
          </Dialog.Title>

          <div className="mb-4">
            <div className="font-medium mb-2">Select destination album:</div>
            <div className="border rounded-lg p-4 space-y-2">
              <button
                onClick={() => setTargetPath('')}
                className={`flex items-center w-full p-2 rounded-lg ${
                  targetPath === '' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <FolderIcon className="w-5 h-5 mr-2" />
                <span>Root</span>
              </button>
              {Object.entries(folderStructure).map(([name, structure]) =>
                renderFolderOption(name, structure)
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={isMoving || targetPath === currentPath}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isMoving ? 'Moving...' : 'Move'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}