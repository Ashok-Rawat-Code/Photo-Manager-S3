import { useState, useEffect } from 'react';
import { countImagesInFolder } from '../utils/folderUtils';
import { listObjects } from '../services/s3Service';

export function useFolderCount(folderPath: string) {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const imageCount = await countImagesInFolder(listObjects, folderPath);
        setCount(imageCount);
      } catch (error) {
        console.error('Error counting images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [folderPath]);

  return { count, isLoading };
}