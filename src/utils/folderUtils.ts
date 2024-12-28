import { S3ListResponse } from '../types';

export const countImagesInFolder = async (
  listObjects: (prefix: string) => Promise<S3ListResponse>,
  folderPath: string
): Promise<number> => {
  const response = await listObjects(folderPath);
  return (response.Contents || [])
    .filter(item => 
      item.Key && 
      !item.Key.endsWith('/') && 
      /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(item.Key) &&
      !item.Key.endsWith('_thumb.jpg')
    ).length;
};