import { snapsave } from "snapsave-media-downloader";

const download = await snapsave("https://www.instagram.com/p/C51YHfWJwHK/");

console.log(download);