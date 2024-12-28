import React from 'react';

interface FolderCountProps {
  count: number;
}

export function FolderCount({ count }: FolderCountProps) {
  return (
    <span className="text-xs text-gray-500 ml-2">
      {count} {count === 1 ? 'photo' : 'photos'}
    </span>
  );
}