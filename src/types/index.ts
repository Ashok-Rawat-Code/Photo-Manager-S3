export interface Photo {
  key: string;
  url: string;
  thumbnailUrl: string;
}

export interface S3Object {
  Key?: string;
  Size?: number;
  LastModified?: Date;
}

export interface S3ListResponse {
  Contents?: S3Object[];
  CommonPrefixes?: { Prefix?: string }[];
  NextContinuationToken?: string;
}

export interface FolderStructure {
  [key: string]: FolderStructure;
}

export interface FolderTreeProps {
  name: string;
  path: string;
  structure: FolderStructure;
  level: number;
  onFolderClick: (folder: string) => void;
}

export interface FolderNavigationProps {
  currentPath: string;
  folderStructure: FolderStructure;
  onFolderClick: (folder: string) => void;
  onNavigateUp: () => void;
}