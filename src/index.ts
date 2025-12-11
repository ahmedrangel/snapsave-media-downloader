import { load } from "cheerio";
import { $fetch } from "ofetch";
import { facebookRegex, fixThumbnail, instagramRegex, normalizeURL, tiktokRegex, twitterRegex, userAgent } from "./utils";
import type { SnapSaveDownloaderData, SnapSaveDownloaderMedia, SnapSaveDownloaderOptions, SnapSaveDownloaderResponse } from "./types";
import { decryptSnapSave, decryptSnaptik } from "./decrypter";

export const snapsave = async (url: string, options?: SnapSaveDownloaderOptions): Promise<SnapSaveDownloaderResponse> => {
  const retry = { retry: options?.retry || 1, retryDelay: options?.retryDelay || 500 };
  const UA = options?.userAgent || userAgent;
  try {
    const regexList = [facebookRegex, instagramRegex, twitterRegex, tiktokRegex];
    const isValid = regexList.some(regex => url.match(regex));
    if (!isValid) return { success: false, message: "Invalid URL" };
    const isTwitter = url.match(twitterRegex);
    const isTiktok = url.match(tiktokRegex);

    const formData = new URLSearchParams();
    formData.append("url", normalizeURL(url));

    if (isTiktok) {
      const homeHtml = await $fetch("https://snaptik.app/", {
        headers: { "user-agent": UA },
        responseType: "text",
        ...retry
      });
      const $ = load(homeHtml);
      const token = $("input[name='token']").val() as string;
      formData.append("token", token);
      const data = await $fetch("https://snaptik.app/abc2.php", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "origin": "https://snaptik.app",
          "referer": "https://snaptik.app/",
          "user-agent": UA
        },
        body: formData,
        responseType: "text",
        ...retry
      });
      const decode = decryptSnaptik(data);
      const $3 = load(decode);
      const _url = $3(".download-box > .video-links > a").attr("href");
      const description = $3(".video-title").text().trim();
      const preview = $3("#thumbnail").attr("src");
      const spanText = $3(".video-links > a.button.download-file").text().trim();
      const type = spanText === "Download photo" ? "image" : "video";
      return { success: true, data: { description, preview, media: [{ url: _url, type }] } };
    }
    if (isTwitter) {
      const homeHtml = await $fetch("https://twitterdownloader.snapsave.app/", {
        headers: { "user-agent": UA },
        responseType: "text"
      });
      const $ = load(homeHtml);
      const token = $("input[name='token']").val() as string;
      formData.append("token", token);
      const response2 = await $fetch("https://twitterdownloader.snapsave.app/action.php", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "content-type": "application/x-www-form-urlencoded",
          "origin": "https://twitterdownloader.snapsave.app",
          "referer": "https://twitterdownloader.snapsave.app/",
          "user-agent": UA
        },
        responseType: "json",
        body: formData,
        ...retry
      });
      const html2 = response2.data;
      const $2 = load(html2);
      const _url = $2("#download-block > .abuttons > a").attr("href");
      const description = $2(".videotikmate-middle > p > span").text().trim();
      const preview = $2(".videotikmate-left > img").attr("src");
      const spanText = $2("#download-block > .abuttons > a > span > span").text().trim();
      const type = spanText === "Download photo" ? "image" : "video";
      return { success: true, data: { description, preview, media: [{ url: _url, type }] } };
    }

    const html = await $fetch("https://snapsave.app/action.php", {
      method: "POST",
      query: { lang: "en" },
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://snapsave.app",
        "referer": "https://snapsave.app/",
        "user-agent": UA
      },
      body: formData,
      responseType: "text",
      ...retry
    });

    const decode = decryptSnapSave(html);
    const $ = load(decode);
    const data: SnapSaveDownloaderData = {};
    const media: SnapSaveDownloaderMedia[] = [];

    if ($("table.table").length || $("article.media > figure").length) {
      const description = $("span.video-des").text().trim();
      const preview = $("article.media > figure").find("img").attr("src");
      data.description = description;
      data.preview = preview;
      if ($("table.table").length) {
        $("tbody > tr").each((_, el) => {
          const $el = $(el);
          const $td = $el.find("td");
          const resolution = $td.eq(0).text();
          let _url = $td.eq(2).find("a").attr("href") || $td.eq(2).find("button").attr("onclick");
          const shouldRender = /get_progressApi/ig.test(_url || "");
          if (shouldRender) {
            _url = "https://snapsave.app" + /get_progressApi\('(.*?)'\)/.exec(_url || "")?.[1] || _url;
          }
          media.push({
            resolution,
            ...shouldRender ? { shouldRender } : {},
            url: _url,
            type: resolution ? "video" : "image"
          });
        });
      }
      else if ($("div.card").length) {
        $("div.card").each((_, el) => {
          const cardBody = $(el).find("div.card-body");
          const aText = cardBody.find("a").text().trim();
          const url = cardBody.find("a").attr("href");
          const type = aText === "Download Photo" ? "image" : "video";
          media.push({
            url,
            type
          });
        });
      }
      else {
        const url = $("a").attr("href") || $("button").attr("onclick");
        const aText = $("a").text().trim();
        const type = aText === "Download Photo" ? "image" : "video";
        media.push({
          url,
          type
        });
      }
    }
    else if ($("div.download-items").length) {
      $("div.download-items").each((_, el) => {
        const itemThumbnail = $(el).find("div.download-items__thumb > img").attr("src");
        const itemBtn = $(el).find("div.download-items__btn");
        const downloadUrl = itemBtn.find("a").attr("href");
        const spanText = itemBtn.find("span").text().trim();
        const type = spanText === "Download Photo" ? "image" : "video";
        const url = type === "image" ? itemThumbnail : downloadUrl;
        media.push({
          url,
          ...type === "video" ? {
            thumbnail: itemThumbnail ? fixThumbnail(itemThumbnail) : undefined
          } : {},
          type
        });
      });
    }
    if (!media.length) return { success: false, message: "Blank data" };
    return { success: true, data: { ...data, media } };
  }
  catch (e) {
    return { success: false, message: "Something went wrong" };
  }
};
