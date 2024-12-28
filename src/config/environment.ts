import { z } from 'zod';

const envSchema = z.object({
  VITE_AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS Access Key ID is required'),
  VITE_AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS Secret Access Key is required'),
  VITE_AWS_REGION: z.string().min(1, 'AWS Region is required'),
  VITE_AWS_BUCKET_NAME: z.string().min(1, 'S3 Bucket Name is required'),
});

export type Environment = z.infer<typeof envSchema>;

export const validateEnvironment = (): Environment => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missingFields}`);
    }
    throw error;
  }
};

export const getEnvironment = (): Environment => {
  return validateEnvironment();
};