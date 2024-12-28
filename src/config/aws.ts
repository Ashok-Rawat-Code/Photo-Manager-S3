import { S3Client } from '@aws-sdk/client-s3';
import { getEnvironment } from './environment';

export const createS3Client = (): S3Client => {
  const env = getEnvironment();
  
  return new S3Client({
    region: env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });
};

export const s3Client = createS3Client();
export const getBucketName = () => getEnvironment().VITE_AWS_BUCKET_NAME;