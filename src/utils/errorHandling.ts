export class S3Error extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'S3Error';
  }
}

export const handleS3Error = (error: unknown): never => {
  console.error('S3 Operation Error:', error);
  
  if (error instanceof Error) {
    throw new S3Error(error.message);
  }
  
  throw new S3Error('An unknown error occurred during S3 operation');
};