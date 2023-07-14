export enum UploadState {
  NotUploading,
  Uploading,
  UploadComplete,
  UploadFailed
}

/**
 Holds file object and information about the file including name,
 size and upload status.
 */
export class FileInfo {
  file: File;
  name: string;
  size: number;
  uploadState: UploadState;

  constructor(file: File) {
    this.file = file;
    this.name = file.name;
    this.size = file.size;
    this.uploadState = UploadState.NotUploading;
  }
}
