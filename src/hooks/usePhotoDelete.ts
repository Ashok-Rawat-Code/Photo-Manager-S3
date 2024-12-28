import { useState, useCallback } from 'react';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/aws';
import toast from 'react-hot-toast';

interface UsePhotoDeleteProps {
  onDelete: (key: string) => void;
  clearSelection: () => void;
}

export function usePhotoDelete({ onDelete, clearSelection }: UsePhotoDeleteProps) {
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(new Set());

  const handleDelete = useCallback(async (keys: string[]) => {
    if (keys.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${keys.length} photo${keys.length > 1 ? 's' : ''}?`
    );

    if (!confirmDelete) return;

    keys.forEach(key => setDeletingKeys(prev => new Set(prev).add(key)));

    try {
      const deletePromises = keys.flatMap(key => {
        const keysToDelete = [
          key,
          key.replace(/(.+)(\.[^.]+)$/, '$1_thumb$2')
        ];

        return keysToDelete.map(k =>
          s3Client.send(new DeleteObjectCommand({
            Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
            Key: k,
          }))
        );
      });

      await Promise.all(deletePromises);
      keys.forEach(key => onDelete(key));
      clearSelection();
      toast.success(`Successfully deleted ${keys.length} photo${keys.length > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete some photos. Please try again.');
    } finally {
      keys.forEach(key =>
        setDeletingKeys(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        })
      );
    }
  }, [onDelete, clearSelection]);

  return { deletingKeys, handleDelete };
}