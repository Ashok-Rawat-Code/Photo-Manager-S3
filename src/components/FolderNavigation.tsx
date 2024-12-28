import React, { useState } from 'react';
import { ChevronRightIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { FolderNavigationProps } from '../types';
import { FolderTree } from './FolderTree';
import { PhotoUploader } from './PhotoUploader';
import { createFolder } from '../utils/s3Utils';
import toast from 'react-hot-toast';

export function FolderNavigation({ 
  currentPath, 
  folderStructure,
  onFolderClick, 
  onNavigateUp,
  onUploadSuccess 
}: FolderNavigationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const pathParts = currentPath.split('/').filter(Boolean);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreating(true);
    try {
      const folderPath = `${currentPath}${newFolderName.trim()}/`;
      await createFolder(folderPath);
      setNewFolderName('');
      toast.success('Album created successfully!');
      onFolderClick(currentPath);
    } catch (error) {
      toast.error('Failed to create album');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4 bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={onNavigateUp}
          disabled={currentPath === ''}
          className={`text-sm ${currentPath === '' ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
        >
          ← Back
        </button>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onFolderClick('')}
            className="text-gray-600 hover:text-gray-800"
          >
            Root
          </button>
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              <button
                onClick={() => onFolderClick(pathParts.slice(0, index + 1).join('/') + '/')}
                className="text-gray-600 hover:text-gray-800"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Albums</h2>
          <form onSubmit={handleCreateFolder} className="flex items-center space-x-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New album name"
              className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating || !newFolderName.trim()}
              className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              <FolderPlusIcon className="w-4 h-4 mr-1" />
              Create
            </button>
          </form>
        </div>

        {currentPath && (
          <PhotoUploader
            currentPath={currentPath}
            onUploadSuccess={onUploadSuccess}
          />
        )}
        
        <div className="space-y-1">
          {Object.entries(folderStructure).map(([name, structure]) => (
            <FolderTree
              key={name}
              name={name}
              path={`${name}/`}
              structure={structure}
              level={0}
              onFolderClick={onFolderClick}
            />
          ))}
          {Object.keys(folderStructure).length === 0 && (
            <p className="text-sm text-gray-500 py-2">No albums yet. Create your first album above.</p>
          )}
        </div>
      </div>
    </div>
  );
}