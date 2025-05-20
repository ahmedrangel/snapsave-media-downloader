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

export function decryptSnapSave (data: string) {
  return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)));
}