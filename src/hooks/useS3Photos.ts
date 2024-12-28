import { useState, useEffect, useCallback } from 'react';
import { ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/aws';
import { Photo, S3ListResponse, FolderStructure } from '../types';
import toast from 'react-hot-toast';

export function useS3Photos(currentPath: string) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [isLoading, setIsLoading] = useState(true);

  const checkThumbnailExists = async (key: string): Promise<boolean> => {
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: key,
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const getPhotoUrls = async (key: string): Promise<Photo | null> => {
    try {
      const getOriginalCommand = new GetObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        Key: key,
      });

      const thumbnailKey = key.replace(/(.+)(\.[^.]+)$/, '$1_thumb.jpg');
      const thumbnailExists = await checkThumbnailExists(thumbnailKey);
      
      if (thumbnailExists) {
        const getThumbnailCommand = new GetObjectCommand({
          Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
          Key: thumbnailKey,
        });
        
        const [url, thumbnailUrl] = await Promise.all([
          getSignedUrl(s3Client, getOriginalCommand, { expiresIn: 3600 }),
          getSignedUrl(s3Client, getThumbnailCommand, { expiresIn: 3600 }),
        ]);

        return { key, url, thumbnailUrl };
      } else {
        const url = await getSignedUrl(s3Client, getOriginalCommand, { expiresIn: 3600 });
        return { key, url, thumbnailUrl: url };
      }
    } catch (error) {
      console.error('Error getting photo URLs:', error);
      return null;
    }
  };

  const buildFolderStructure = (prefixes: string[]): FolderStructure => {
    const structure: FolderStructure = {};
    
    prefixes.forEach(prefix => {
      const parts = prefix.split('/').filter(Boolean);
      let current = structure;
      
      parts.forEach(part => {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      });
    });

    return structure;
  };

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const allPhotos: Photo[] = [];
      const allFolders = new Set<string>();
      let continuationToken: string | undefined;

      do {
        const command = new ListObjectsV2Command({
          Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
          Prefix: currentPath,
          Delimiter: '/',
          ContinuationToken: continuationToken,
        });

        const response: S3ListResponse = await s3Client.send(command);
        
        if (response.CommonPrefixes) {
          response.CommonPrefixes.forEach(prefix => {
            if (prefix.Prefix) {
              allFolders.add(prefix.Prefix);
            }
          });
        }

        if (response.Contents) {
          const imageFiles = response.Contents
            .filter(item => 
              item.Key && 
              item.Key.startsWith(currentPath) &&
              !item.Key.endsWith('/') &&
              /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(item.Key) &&
              !item.Key.endsWith('_thumb.jpg')
            );

          const photoUrls = await Promise.all(
            imageFiles.map(item => item.Key ? getPhotoUrls(item.Key) : null)
          );

          allPhotos.push(...photoUrls.filter((photo): photo is Photo => photo !== null));
        }

        continuationToken = response.NextContinuationToken;
      } while (continuationToken);

      allPhotos.sort((a, b) => a.key.localeCompare(b.key));
      setPhotos(allPhotos);
      setFolderStructure(buildFolderStructure(Array.from(allFolders)));
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch photos. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return {
    photos,
    folderStructure,
    isLoading,
    refreshPhotos: fetchPhotos
  };
}