export interface SnapSaveDownloaderMedia {
  resolution?: string;
  shouldRender?: boolean;
  url: string;
}

export interface SnapSaveDownloaderResponse {
  success: boolean;
  message?: string;
  data?: {
    description?: string;
    thumbnail?: string;
    media: SnapSaveDownloaderMedia[];
  };
}