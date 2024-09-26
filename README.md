# Snapsave Media Downloader

Download Instagram, Facebook and TikTok media using snapsave.app downloader

## Install dependency
```bash
# Using npm
npm install snapsave-media-downloader

# Using pnpm
pnpm add snapsave-media-downloader
```

Example:
```js
import { snapsave } from "snapsave-media-downloader";

const download = await snapsave("https://www.instagram.com/p/C51YHfWJwHK/");

console.log(download);
```
Output:
```json
{
  "status": true,
  "data": [
    {
      "thumbnail": "https://d.rapidcdn.app/d?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LmNkbmluc3RhZ3JhbS5jb20vdi90NTEuMjkzNTAtMTUvNDM4Nzc5MDI3Xzc3OTg2MTY3MDg3ODYzMl8xNzYzNTk4MzE1MjMwMTk0MzVfbi5qcGc_c3RwPWRzdC1qcGdfZTE1Jl9uY19odD1zY29udGVudC5jZG5pbnN0YWdyYW0uY29tJl9uY19jYXQ9MTA0Jl9uY19vaGM9UjZ3SGlaRFpGQzhBYjdSYWFXMCZlZG09QVBzMTdDVUJBQUFBJmNjYj03LTUmb2g9MDBfQWZEWHRweFZnX3FuTWRfSDlaeWtPdlBFWmx0d2JFX2NscFVvS2I3S1NlVzg2USZvZT02NjIyODJCNSZfbmNfc2lkPTEwZDEzYiIsImZpbGVuYW1lIjoiU25hcHNhdmUuYXBwXzQzODc3OTAyN183Nzk4NjE2NzA4Nzg2MzJfMTc2MzU5ODMxNTIzMDE5NDM1X24uanBnIn0.ce0OstqOV1H0jGUFhoqjsj8j_UCojgsdJWaw1aVFKDk",
      "url": "https://d.rapidcdn.app/d?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LmNkbmluc3RhZ3JhbS5jb20vdi90NjYuMzAxMDAtMTYvMzIwODE0MTE3XzM2Mzg5MTAyNDMwMzMxODdfMTAzODIyMDkxMDcwNDgxNzc1M19uLm1wND9fbmNfaHQ9c2NvbnRlbnQuY2RuaW5zdGFncmFtLmNvbSZfbmNfY2F0PTEwNyZfbmNfb2hjPVRya3VtWUJIWFVnQWI3Nl9mdTUmZWRtPUFQczE3Q1VCQUFBQSZjY2I9Ny01Jm9oPTAwX0FmRDlRZDZkT0hWU01OSmtQOGI1OFVDWjVzM0ZPdFRQNkJmUFRuRm5PV0xkR0Emb2U9NjYyMjkwNzYmX25jX3NpZD0xMGQxM2IiLCJmaWxlbmFtZSI6IlNuYXBzYXZlLmFwcF8zMjA4MTQxMTdfMzYzODkxMDI0MzAzMzE4N18xMDM4MjIwOTEwNzA0ODE3NzUzX24ubXA0In0._bbBABT2b1x4iRDCqzWpQbZR8MfJ_eK5PlERfoDZozc&dl=1"
    }
  ]
}
```