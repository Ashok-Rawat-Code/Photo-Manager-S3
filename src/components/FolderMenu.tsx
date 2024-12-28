import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DeleteAlbumModal } from './folder/DeleteAlbumModal';

interface FolderMenuProps {
  folderPath: string;
  folderName: string;
  onAction: () => void;
}

export function FolderMenu({ folderPath, folderName, onAction }: FolderMenuProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg p-1 z-20">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className={`${
                  active ? 'bg-red-50 text-red-600' : 'text-red-500'
                } flex items-center w-full px-3 py-2 text-left rounded-md`}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Album
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <DeleteAlbumModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        albumPath={folderPath}
        albumName={folderName}
        onDelete={onAction}
      />
    </>
  );
}