import { useState, useCallback } from 'react';

export function useSelection() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelection = useCallback((key: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
        if (newSet.size === 0) {
          setIsSelectionMode(false);
        }
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  }, []);

  const startSelection = useCallback(() => {
    setIsSelectionMode(true);
  }, []);

  return {
    selectedItems,
    isSelectionMode,
    toggleSelection,
    clearSelection,
    startSelection
  };
}