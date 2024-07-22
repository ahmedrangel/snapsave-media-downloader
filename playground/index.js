import { snapsave } from "snapsave-media-downloader";

const download = await snapsave("https://www.instagram.com/reel/CtjoC2BNsB2");

console.info(download);