export interface SnapSaveDownloaderMedia {
  resolution?: string;
  shouldRender?: boolean;
  thumbnail?: string;
  type?: "image" | "video";
  url?: string;
}

export interface SnapSaveDownloaderData {
  description?: string;
  preview?: string;
  media?: SnapSaveDownloaderMedia[];
}

export interface SnapSaveDownloaderResponse {
  success: boolean;
  message?: string;
  data?: SnapSaveDownloaderData;
}
