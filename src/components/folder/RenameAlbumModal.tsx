import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { renameFolder } from '../../utils/s3Utils';

interface RenameAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  albumPath: string;
  onRename: () => void;
}

export function RenameAlbumModal({
  isOpen,
  onClose,
  currentName,
  albumPath,
  onRename,
}: RenameAlbumModalProps) {
  const [newName, setNewName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === currentName) return;

    setIsRenaming(true);
    try {
      const parentPath = albumPath.split('/').slice(0, -2).join('/');
      const newPath = parentPath ? `${parentPath}/${newName}/` : `${newName}/`;
      await renameFolder(albumPath, newPath);
      toast.success('Album renamed successfully');
      onRename();
      onClose();
    } catch (error) {
      toast.error('Failed to rename album');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Rename Album
          </Dialog.Title>

          <form onSubmit={handleRename}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New album name"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              autoFocus
            />
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRenaming || !newName.trim() || newName === currentName}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isRenaming ? 'Renaming...' : 'Rename'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}