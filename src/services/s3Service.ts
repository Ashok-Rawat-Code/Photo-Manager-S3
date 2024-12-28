import { s3Client } from '../config/aws';
import { ListObjectsV2Command, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { handleS3Error } from '../utils/errorHandling';
import { URL_EXPIRATION_TIME } from '../utils/constants';
import type { Photo, S3ListResponse } from '../types';

export const getSignedObjectUrl = async (key: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: URL_EXPIRATION_TIME });
  } catch (error) {
    return handleS3Error(error);
  }
};

export const checkObjectExists = async (key: string): Promise<boolean> => {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch {
    return false;
  }
};

export const listObjects = async (prefix: string): Promise<S3ListResponse> => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    });
    return await s3Client.send(command);
  } catch (error) {
    return handleS3Error(error);
  }
};

export const getPhotoUrls = async (key: string): Promise<Photo | null> => {
  try {
    const thumbnailKey = key.replace(/(.+)(\.[^.]+)$/, '$1_thumb.jpg');
    const thumbnailExists = await checkObjectExists(thumbnailKey);
    
    const [url, thumbnailUrl] = await Promise.all([
      getSignedObjectUrl(key),
      thumbnailExists ? getSignedObjectUrl(thumbnailKey) : getSignedObjectUrl(key),
    ]);

    return { key, url, thumbnailUrl };
  } catch (error) {
    console.error('Error getting photo URLs:', error);
    return null;
  }
};