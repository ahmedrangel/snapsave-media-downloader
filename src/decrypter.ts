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
export function decryptSnaptik (data: string) {
  return getDecodedSnaptik(decodeSnapApp(getEncodedSnapApp(data)));
}