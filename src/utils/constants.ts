export const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 200,
  useWebWorker: true,
  fileType: 'image/jpeg',
} as const;

export const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp']
} as const;

export const URL_EXPIRATION_TIME = 3600; // 1 hour in seconds