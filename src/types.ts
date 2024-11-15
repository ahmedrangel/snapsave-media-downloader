export interface SnapSaveDownloaderMedia {
  resolution?: string;
  shouldRender?: boolean;
  url?: string;
}

export interface SnapSaveDownloaderData {
  description?: string;
  thumbnail?: string;
  media: SnapSaveDownloaderMedia[];
}

export interface SnapSaveDownloaderResponse {
  success: boolean;
  message?: string;
  data?: SnapSaveDownloaderData;
}
