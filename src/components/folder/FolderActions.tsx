import React, { useState } from 'react';
import { FolderPlusIcon } from '@heroicons/react/24/outline';
import { createFolder } from '../../utils/s3Utils';
import toast from 'react-hot-toast';

interface FolderActionsProps {
  currentPath: string;
  onFolderCreated: () => void;
}

export function FolderActions({ currentPath, onFolderCreated }: FolderActionsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreating(true);
    try {
      const folderPath = `${currentPath}${newFolderName.trim()}/`;
      await createFolder(folderPath);
      onFolderCreated();
      setNewFolderName('');
      toast.success('Album created successfully!');
    } catch (error) {
      toast.error('Failed to create album');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreateFolder} className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
        placeholder="New album name"
        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        disabled={isCreating}
      />
      <button
        type="submit"
        disabled={isCreating || !newFolderName.trim()}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        <FolderPlusIcon className="w-5 h-5 mr-2" />
        Create Album
      </button>
    </form>
  );
}