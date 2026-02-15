import { snapsave } from "../dist/index.mjs";

const proxyUrl = "http://xxxxx:xxxx@23.95.x.x:xxxx";

console.log("Testing with proxy:", proxyUrl);
console.log("=".repeat(50));

const testUrls = [
  "https://www.facebook.com/reel/1737584400241330"
];

for (const url of testUrls) {
  console.log(`\nTesting URL: ${url}`);
  try {
    const startTime = Date.now();
    const result = await snapsave(url, {
      proxy: proxyUrl,
      retry: 2,
      retryDelay: 1000
    });
    const duration = Date.now() - startTime;
    if (result.success) {
      console.log(`✅ Success! (${duration}ms)`);
      console.log("Media count:", result.data?.media?.length || 0);
      if (result.data?.description) {
        console.log("Description:", result.data.description.substring(0, 100) + "...");
      }
    }
    else {
      console.log("❌ Failed:", result.message);
    }
  }
  catch (error) {
    console.log("❌ Error:", error.message);
  }
}

console.log("\n" + "=".repeat(50));
console.log("Test completed!");
