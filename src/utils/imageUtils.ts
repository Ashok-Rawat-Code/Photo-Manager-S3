import imageCompression from 'browser-image-compression';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/aws';

export const generateThumbnail = async (file: File): Promise<Blob> => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 200,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };
  return imageCompression(file, options);
};

export const uploadToS3 = async (file: File | Blob, key: string, contentType?: string) => {
  const command = new PutObjectCommand({
    Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType || 'image/jpeg',
  });
  await s3Client.send(command);
};