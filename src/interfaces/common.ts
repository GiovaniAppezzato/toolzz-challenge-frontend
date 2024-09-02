export interface ITimestamps {
  created_at: string;
  updated_at: string|null;
  deleted_at?: string|null;
}

export interface IFile {
  name: string;
  mime_type: string;
  size: number;
  path: string;
}