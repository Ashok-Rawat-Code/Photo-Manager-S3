import React, { useState } from 'react';
import { FolderIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { deleteFolder, renameFolder } from '../../utils/s3Utils';
import toast from 'react-hot-toast';

interface FolderMenuProps {
  folderPath: string;
  onAction: () => void;
}

export function FolderMenu({ folderPath, onAction }: FolderMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this folder and all its contents?');
    if (!confirm) return;

    try {
      await deleteFolder(folderPath);
      toast.success('Folder deleted successfully');
      onAction();
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const parentPath = folderPath.split('/').slice(0, -2).join('/');
      const newPath = parentPath ? `${parentPath}/${newName}/` : `${newName}/`;
      await renameFolder(folderPath, newPath);
      toast.success('Folder renamed successfully');
      onAction();
      setIsRenaming(false);
    } catch (error) {
      toast.error('Failed to rename folder');
    }
  };

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="p-1 hover:bg-gray-100 rounded-full">
          <FolderIcon className="w-5 h-5" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg p-1 z-20">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setIsRenaming(true)}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex items-center w-full px-3 py-2 text-left rounded-md`}
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Rename
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleDelete}
                className={`${
                  active ? 'bg-red-50 text-red-600' : 'text-red-500'
                } flex items-center w-full px-3 py-2 text-left rounded-md`}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {isRenaming && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleRename}
            className="bg-white rounded-lg p-4 max-w-sm w-full"
          >
            <h3 className="text-lg font-semibold mb-4">Rename Folder</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New folder name"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsRenaming(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Rename
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}