import { PutObjectCommand, CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '../config/aws';
import { getBucketName } from '../config/aws';

export const createFolder = async (folderPath: string) => {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: folderPath,
    Body: '', // Empty content for folder placeholder
  });
  await s3Client.send(command);
};

export const movePhoto = async (sourceKey: string, destinationKey: string) => {
  const bucketName = getBucketName();
  // Copy to new location
  const copyCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${sourceKey}`,
    Key: destinationKey,
  });
  await s3Client.send(copyCommand);

  // Delete from old location
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: sourceKey,
  });
  await s3Client.send(deleteCommand);
};

export const deleteFolder = async (folderPath: string) => {
  const listCommand = new ListObjectsV2Command({
    Bucket: getBucketName(),
    Prefix: folderPath,
  });

  const response = await s3Client.send(listCommand);
  if (!response.Contents) return;

  await Promise.all(
    response.Contents.map(async (object) => {
      if (!object.Key) return;
      const deleteCommand = new DeleteObjectCommand({
        Bucket: getBucketName(),
        Key: object.Key,
      });
      await s3Client.send(deleteCommand);
    })
  );
};

export const renameFolder = async (oldPath: string, newPath: string) => {
  const listCommand = new ListObjectsV2Command({
    Bucket: getBucketName(),
    Prefix: oldPath,
  });

  const response = await s3Client.send(listCommand);
  if (!response.Contents) return;

  await Promise.all(
    response.Contents.map(async (object) => {
      if (!object.Key) return;
      const newKey = object.Key.replace(oldPath, newPath);
      await movePhoto(object.Key, newKey);
    })
  );
};