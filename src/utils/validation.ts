import { z } from 'zod';

export const photoSchema = z.object({
  key: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
});

export const s3ConfigSchema = z.object({
  accessKeyId: z.string().min(1),
  secretAccessKey: z.string().min(1),
  region: z.string().min(1),
  bucketName: z.string().min(1),
});