import { type Mock, describe, expect, it, vi } from "vitest";
import { snapsave } from "../src";
import type { SnapSaveDownloaderResponse } from "../src/types";

vi.mock("../src", () => ({ snapsave: vi.fn() }));
describe("SnapSave successful responses", () => {
  it("Facebook response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        description: "This is a description",
        preview: "https://example.com/preview.jpg",
        media: [
          {
            resolution: "720p (HD)",
            url: "https://example.com/video-720.mp4",
            type: "video"
          },
          {
            resolution: "360p (SD)",
            shouldRender: true,
            url: "https://example.com/video-360.mp4",
            type: "video"
          }
        ]
      }
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.facebook.com/watch?v=1234567890123456");
    expect(result).toEqual(mockData);
  });

  it("Instagram response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        preview: "https://example.com/preview.jpg",
        media: [
          {
            url: "https://example.com/video.mp4",
            thumbnail: "https://example.com/thumbnail.jpg",
            type: "video"
          }
        ]
      }
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.instagram.com/p/CcDeFg9hiJK/");
    expect(result).toEqual(mockData);
  });

  it("TikTok response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        description: "This is a description",
        preview: "https://example.com/preview.jpg",
        media: [
          {
            url: "https://example.com/video.mp4",
            type: "video"
          }
        ]
      }
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.tiktok.com/@user_name/video/1234567890123456789");
    expect(result).toEqual(mockData);
  });

  it("Twitter response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        description: "This is a description",
        preview: "https://example.com/preview.jpg",
        media: [
          {
            url: "https://example.com/video.mp4",
            type: "video"
          }
        ]
      }
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://x.com/user_name/status/1234567890123456789");
    expect(result).toEqual(mockData);
  });
});

describe("SnapSave error responses", () => {
  it("Invalid URL", async () => {
    const { snapsave } = await vi.importActual<typeof import("../src")>("../src");
    const result = await snapsave("https://www.example.com/invalid");
    expect(result).toEqual({ success: false, message: "Invalid URL" });
  });

  it("Something went wrong", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: false,
      message: "Something went wrong"
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.facebook.com/watch?v=123");
    expect(result).toEqual({ success: false, message: "Something went wrong" });
  });
});