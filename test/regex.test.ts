import { describe, expect, it } from "vitest";
import { facebookRegex, instagramRegex, normalizeURL, tiktokRegex } from "../src/utils";

describe("Facebook regex", () => {
  const urls = [
    "https://facebook.com/watch?v=1234567890123456",
    "https://www.facebook.com/watch?v=1234567890123456",
    "https://www.facebook.com/watch?v=1234567890123456",
    "https://www.facebook.com/watch/?v=1234567890123456",
    "https://www.facebook.com/reel/1234567890123456",
    "https://www.facebook.com/reel/1234567890123456?locale=es_LA",
    "https://web.facebook.com/reel/1234567890123456",
    "https://www.facebook.com/user_name/videos/1234567890123456",
    "https://www.facebook.com/user_name/posts/1234567890123456",
    "https://www.facebook.com/1234567890123456/videos/1234567890123456",
    "https://www.facebook.com/1234567890123456/posts/1234567890123456",
    "https://www.facebook.com/Page_Name/videos/1234567890123456",
    "https://www.facebook.com/Page_Name/posts/1234567890123456",
    "https://fb.watch/abCDefghI9",
    "https://www.facebook.com/share/v/ab0cdEfGHIJKMnlO/",
    "https://www.facebook.com/share/r/ab0cdEfGHIJKMnlO/"
  ];

  urls.forEach((url, index) => {
    it(`should match facebook video url: type ${index + 1}`, () => {
      expect(url.match(facebookRegex)).toBeTruthy();
    });
  });
});

describe("Instagram regex", () => {
  const urls = [
    "https://instagram.com/p/CcDeFg9hiJK",
    "https://www.instagram.com/p/CcDeFg9hiJK",
    "https://www.instagram.com/p/CcDeFg9hiJK/",
    "https://www.instagram.com/reel/1234567890123456",
    "https://www.instagram.com/reel/1234567890123456/",
    "https://www.instagram.com/reels/1234567890123456",
    "https://www.instagram.com/reels/1234567890123456/",
    "https://www.instagram.com/tv/CcDeFg9hiJK",
    "https://www.instagram.com/tv/CcDeFg9hiJK/",
    "https://www.instagram.com/stories/user_name",
    "https://www.instagram.com/stories/user_name/",
    "https://www.instagram.com/stories/user_name/1234567890123456",
    "https://www.instagram.com/stories/user_name/1234567890123456/"

  ];

  urls.forEach((url, index) => {
    it(`should match instagram video url: type ${index + 1}`, () => {
      expect(url.match(instagramRegex)).toBeTruthy();
    });
  });
});

describe("TikTok regex", () => {
  const urls = [
    "https://tiktok.com/@user_name/video/1234567890123456789",
    "https://www.tiktok.com/@user_name/video/1234567890123456789/",
    "https://www.tiktok.com/@user_name/video/1234567890123456789?is_from_webapp=1&sender_device=pc",
    "https://www.tiktok.com/t/ZTFErV3e5",
    "https://www.tiktok.com/t/ZTFErV3e5/",
    "https://vm.tiktok.com/ZAbc8d911",
    "https://vm.tiktok.com/ZAbc8d911/",
    "https://m.tiktok.com/v/1234567890123456789",
    "https://m.tiktok.com/v/1234567890123456789/"
  ];

  urls.forEach((url, index) => {
    it(`should match tiktok video url: type ${index + 1}`, () => {
      expect(url.match(tiktokRegex)).toBeTruthy();
    });
  });
});

describe("Normalize URL", () => {
  it("should normalize: type 1", () => {
    expect(normalizeURL("https://tiktok.com")).toStrictEqual("https://www.tiktok.com");
  });
  it("should normalize: type 2", () => {
    expect(normalizeURL("https://www.tiktok.com")).toStrictEqual("https://www.tiktok.com");
  });
  it("should normalize: type 3", () => {
    expect(normalizeURL("https://vm.tiktok.com")).toStrictEqual("https://vm.tiktok.com");
  });
});