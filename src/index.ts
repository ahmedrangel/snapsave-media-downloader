import { load } from "cheerio";
import { facebookRegex, instagramRegex, normalizeURL, tiktokRegex } from "./utils";

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
        while (h[i] !== n[e]) {
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
    const media = [] as SnapSaveDownloaderMedia[];
    const data = {} as SnapSaveDownloaderResponse["data"];

    if ($("table.table").length || $("article.media > figure").length) {
      const thumbnail = $("article.media > figure").find("img").attr("src");
      const description = $("span.video-des").text().trim();
      data.thumbnail = thumbnail;
      data.description = description;
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
            shouldRender,
            url: _url
          });
        });
      }
      else {
        let _url = $("a").attr("href") || $("button").attr("onclick");
        media.push({
          url: _url
        });
      }
    }
    else {
      $("div.download-items__thumb").each((_, tod) => {
        const thumbnail = $(tod).find("img").attr("src");
        data.thumbnail = thumbnail;
        $("div.download-items__btn").each((_, ol) => {
          let _url = $(ol).find("a").attr("href");
          if (!/https?:\/\//.test(_url || "")) _url = `https://snapsave.app${_url}`;
          media.push({
            url: _url
          });
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

interface SnapSaveDownloaderMedia {
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