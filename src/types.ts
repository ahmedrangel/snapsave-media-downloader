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

export interface SnapSaveDownloaderOptions {
  /**
   * @default 1
   */
  retry: number;
  /**
   * Delay between retries in milliseconds.
   * @default 500
   */
  retryDelay: number;
  /**
   * @default "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
   */
  userAgent?: string;
  /**
   * Proxy URL for requests (e.g., "http://proxy.example.com:8080")
   */
  proxy?: string;
}
