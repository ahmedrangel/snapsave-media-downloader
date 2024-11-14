import { describe, it, expect, vi, type Mock } from "vitest";
import { snapsave, type SnapSaveDownloaderResponse } from "../src";

vi.mock("../src", () => ({ snapsave: vi.fn() }))
describe("SnapSave successful responses", () => {
  it("Facebook response", async () =>{
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        thumbnail: "https://example.com/thumbnail.jpg",
        description: "This is a description",
        media: [
          {
            resolution: "720p (HD)",
            shouldRender: false,
            url: "https://example.com/video-720.mp4",
          },
          {
            resolution: "360p (SD)",
            shouldRender: true,
            url: "https://example.com/video-360.mp4",
          }
        ]
      },
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.facebook.com/watch?v=1234567890123456");
    expect(result).toEqual(mockData);
  });

  it("Instagram response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        thumbnail: "https://example.com/thumbnail.jpg",
        media: [
          {
            url: "https://example.com/video.mp4",
          }
        ]
      },
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.instagram.com/p/CcDeFg9hiJK/");
    expect(result).toEqual(mockData);
  });

  it("TikTok response", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: true,
      data: {
        thumbnail: "https://example.com/thumbnail.jpg",
        description: "This is a description",
        media: [
          {
            url: "https://example.com/video.mp4",
          }
        ]
      },
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.tiktok.com/@user_name/video/1234567890123456789");
    expect(result).toEqual(mockData);
  });
})

describe("SnapSave error responses", () => {
  it("Invalid URL", async () => {
    const { snapsave } = await vi.importActual<typeof import("../src")>("../src");
    const result = await snapsave("https://www.example.com/invalid");
    expect(result).toEqual({ success: false, message: "Invalid URL" });
  })

  it("Something went wrong", async () => {
    const mockData: SnapSaveDownloaderResponse = {
      success: false,
      message: "Something went wrong"
    };
    (snapsave as Mock).mockResolvedValue(mockData);
    const result = await snapsave("https://www.facebook.com/watch?v=123");
    expect(result).toEqual({ success: false, message: "Something went wrong" });
  })
});