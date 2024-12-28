import React, { useState } from 'react';
import { FolderIcon, FolderOpenIcon, PencilIcon } from '@heroicons/react/24/outline';
import { FolderMenu } from './FolderMenu';
import { RenameAlbumModal } from './folder/RenameAlbumModal';
import { FolderCount } from './folder/FolderCount';
import { useFolderCount } from '../hooks/useFolderCount';
import { FolderTreeProps } from '../types';

export function FolderTree({ name, path, structure, level, onFolderClick }: FolderTreeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const hasSubfolders = Object.keys(structure).length > 0;
  const { count, isLoading } = useFolderCount(path);

  return (
    <>
      <div className="w-full" style={{ paddingLeft: `${level * 1}rem` }}>
        <div className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg group">
          <button
            onClick={() => {
              onFolderClick(path);
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center flex-1"
          >
            {hasSubfolders ? (
              <FolderOpenIcon className="h-5 w-5 text-yellow-500 mr-2" />
            ) : (
              <FolderIcon className="h-5 w-5 text-yellow-500 mr-2" />
            )}
            <span className="text-sm text-gray-600 group-hover:text-gray-900">
              {name}
              {!isLoading && <FolderCount count={count} />}
            </span>
          </button>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsRenaming(true)}
              className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PencilIcon className="h-4 w-4 text-gray-500" />
            </button>
            <FolderMenu 
              folderPath={path} 
              folderName={name}
              onAction={() => onFolderClick('')} 
            />
          </div>
        </div>
        
        {isExpanded && hasSubfolders && (
          <div className="mt-1">
            {Object.entries(structure).map(([subName, subStructure]) => (
              <FolderTree
                key={`${path}${subName}/`}
                name={subName}
                path={`${path}${subName}/`}
                structure={subStructure}
                level={level + 1}
                onFolderClick={onFolderClick}
              />
            ))}
          </div>
        )}
      </div>

      <RenameAlbumModal
        isOpen={isRenaming}
        onClose={() => setIsRenaming(false)}
        currentName={name}
        albumPath={path}
        onRename={() => onFolderClick('')}
      />
    </>
  );
}