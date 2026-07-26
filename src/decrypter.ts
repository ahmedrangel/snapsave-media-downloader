// --- Snaptik new API helpers (snaptik.app redesigned their API to use AES-256-CBC) ---

const snaptikTokenKey = (() => {
  // Key is assembled at runtime to avoid hardcoding it as a plain string.
  // Mirrors the same obfuscation used by the snaptik.app client.
  const prefix = [115, 110, 52, 112].map(x => String.fromCharCode(x)).join(""); // "sn4p"
  const suffix = (() => {
    const t = "s0j^";
    let h = "";
    for (let i = 0; i < t.length; i++) h += String.fromCharCode(t.charCodeAt(i) + 1);
    return h; // "t1k_"
  })();
  const mid = Buffer.from("djNyMQ==", "base64").toString(); // "v3r1"
  return prefix + suffix + mid + "fy2026";
})();

export async function decryptSnaptikToken (id: string, payload: string): Promise<string> {
  const { createHash, createDecipheriv } = await import("crypto");
  const data = Buffer.from(payload, "base64");
  const iv = data.subarray(0, 16);
  const encrypted = data.subarray(16);
  const hash = createHash("sha256").update(`${snaptikTokenKey}:${id}`).digest();
  const decipher = createDecipheriv("aes-256-cbc", hash, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

export function solveSnaptikChallenge (t: Record<string, any>): number {
  switch (t.t) {
    case "b": return ((t.a ^ t.b) >> t.s) & 255;
    case "r": return t.n.reduce((h: number, f: number) => h + f, 0) * 2 + 1;
    case "c": return t.w.charCodeAt(t.i) * t.m;
    case "m": return ((t.a + t.b) % 100) * t.c;
    case "n": return t.a * t.b + t.b * t.c + t.c * t.a - t.a;
    default: throw new Error("Unknown snaptik challenge type");
  }
}

// --- End Snaptik new API helpers ---

function decodeSnapApp (
  args: string[]
): string {
  let [h, u, n, t, e, r] = args;
  const tNum: number = Number(t);
  const eNum: number = Number(e);

  function decode (d: string, e: number, f: number): string {
    const g: string[] = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
    const hArr: string[] = g.slice(0, e);
    const iArr: string[] = g.slice(0, f);
    let j: number = d.split("").reverse().reduce((a: number, b: string, c: number) => {
      const idx = hArr.indexOf(b);
      if (idx !== -1) return a + idx * (Math.pow(e, c));
      return a;
    }, 0);
    let k: string = "";
    while (j > 0) {
      k = iArr[j % f] + k;
      j = Math.floor(j / f);
    }
    return k || "0";
  }

  let result = "";
  for (let i = 0, len = h.length; i < len;) {
    let s = "";
    while (i < len && h[i] !== n[eNum]) {
      s += h[i];
      i++;
    }
    i++; // skip delimiter
    for (let j = 0; j < n.length; j++)
      s = s.replace(new RegExp(n[j], "g"), j.toString());
    result += String.fromCharCode(Number(decode(s, eNum, 10)) - tNum);
  }

  // Optional: fix encoding for UTF-8
  const fixEncoding = (str: string): string => {
    try {
      const bytes = new Uint8Array(str.split("").map(char => char.charCodeAt(0)));
      return new TextDecoder("utf-8").decode(bytes);
    }
    catch (e) {
      return str;
    }
  };

  return fixEncoding(result);
}

function getEncodedSnapApp (data: string) {
  return data.split("decodeURIComponent(escape(r))}(")[1]
    .split("))")[0]
    .split(",")
    .map(v => v.replace(/"/g, "").trim());
}
function getDecodedSnapSave (data: string) {
  const errorMessage = data?.split("document.querySelector(\"#alert\").innerHTML = \"")?.[1]?.split("\";")?.[0]?.trim();
  if (errorMessage) throw new Error(errorMessage);
  return data.split("getElementById(\"download-section\").innerHTML = \"")[1]
    .split("\"; document.getElementById(\"inputData\").remove(); ")[0]
    .replace(/\\(\\)?/g, "");
}
function getDecodedSnaptik (data: string) {
  return data.split("$(\"#download\").innerHTML = \"")[1]
    .split("\"; document.getElementById(\"inputData\").remove(); ")[0]
    .replace(/\\(\\)?/g, "");
}

export function decryptSnapSave (data: string) {
  return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
}
/**
 * @deprecated The old snaptik.app HTML-based flow was removed.
 * This function is kept temporarily and may fail.
 * Use `decryptSnaptikToken` instead.
 */
export function decryptSnaptik (data: string) {
  return getDecodedSnaptik(decodeSnapApp(getEncodedSnapApp(data)));
}