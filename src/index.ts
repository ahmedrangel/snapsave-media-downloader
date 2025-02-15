import { load } from "cheerio";
import { facebookRegex, fixThumbnail, instagramRegex, normalizeURL, tiktokRegex } from "./utils";
import type { SnapSaveDownloaderData, SnapSaveDownloaderMedia, SnapSaveDownloaderResponse } from "./types";

export const snapsave = async (url: string): Promise<SnapSaveDownloaderResponse> => {
  try {
    const regexList = [facebookRegex, instagramRegex, tiktokRegex];
    if (!regexList.some(regex => url.match(regex))) return { success: false, message: "Invalid URL" };
    function decodeSnapApp (args: string[]) {
      let [h, u, n, t, e, r] = args;
      function decode (d: number, e: number, f: number) {
        const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
        const h = g.slice(0, e);
        const i = g.slice(0, f);
        // @ts-expect-error
        let j = d.split("").reverse().reduce(function (a: string, b: string, c: number) {
          if (h.indexOf(b) !== -1)
            return a += h.indexOf(b) * (Math.pow(e, c));
        }, 0);
        let k = "";
        while (j > 0) {
          k = i[j % f] + k;
          j = (j - (j % f)) / f;
        }
        return k || "0";
      }
      r = "";
      for (let i = 0, len = h.length; i < len; i++) {
        let s = "";
        while (h[i] !== n[Number(e)]) {
          s += h[i]; i++;
        }
        for (let j = 0; j < n.length; j++)
          s = s.replace(new RegExp(n[j], "g"), j.toString());
          // @ts-expect-error
        r += String.fromCharCode(decode(s, e, 10) - t);
      }

      const fixEncoding = (str: string) => {
        const bytes = new Uint8Array(str.split("").map(char => char.charCodeAt(0)));
        return new TextDecoder("utf-8").decode(bytes);
      };

      return fixEncoding(r);
    }
    function getEncodedSnapApp (data: string) {
      return data.split("decodeURIComponent(escape(r))}(")[1]
        .split("))")[0]
        .split(",")
        .map(v => v.replace(/"/g, "").trim());
    }
    function getDecodedSnapSave (data: string) {
      return data.split("getElementById(\"download-section\").innerHTML = \"")[1]
        .split("\"; document.getElementById(\"inputData\").remove(); ")[0]
        .replace(/\\(\\)?/g, "");
    }
    function decryptSnapSave (data: string) {
      return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
    }

    const formData = new URLSearchParams();
    formData.append("url", normalizeURL(url));

    const response = await fetch("https://snapsave.app/action.php?lang=en", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://snapsave.app",
        "referer": "https://snapsave.app/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0"
      },
      body: formData
    });

    const html = await response.text();
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
        const url = itemBtn.find("a").attr("href");
        const spanText = itemBtn.find("span").text().trim();
        const type = spanText === "Download Photo" ? "image" : "video";
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
