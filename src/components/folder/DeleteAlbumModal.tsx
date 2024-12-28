import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { deleteFolder } from '../../utils/s3Utils';

interface DeleteAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumPath: string;
  albumName: string;
  onDelete: () => void;
}

export function DeleteAlbumModal({
  isOpen,
  onClose,
  albumPath,
  albumName,
  onDelete,
}: DeleteAlbumModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFolder(albumPath);
      toast.success('Album deleted successfully');
      onDelete();
      onClose();
    } catch (error) {
      toast.error('Failed to delete album');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="flex items-center gap-4 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <Dialog.Title className="text-lg font-semibold">
              Delete Album
            </Dialog.Title>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the album "{albumName}" and all its contents? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Album'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

