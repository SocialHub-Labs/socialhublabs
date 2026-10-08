/* Shared pure functions for Studio, public profiles and tests. No external dependencies. */
export const THEMES = Object.freeze({
  midnight: { name: "Midnight", bg: "#101726", surface: "#1b2538", ink: "#f6f8ff", muted: "#b4c2d4", accent: "#9df3d4" },
  blossom: { name: "Blossom", bg: "#fff3f7", surface: "#ffffff", ink: "#392b38", muted: "#796d79", accent: "#dc4f90" },
  ocean: { name: "Ocean", bg: "#eafaff", surface: "#ffffff", ink: "#153b50", muted: "#58798b", accent: "#087fa0" },
  citrus: { name: "Citrus", bg: "#f8f5e9", surface: "#ffffff", ink: "#242d25", muted: "#626e60", accent: "#447d34" }
});
export const MAX_LINKS = 12;
export const STORAGE_KEY = "socialhublabs.studio.v1";

export const SAMPLE = Object.freeze({
  name: "Your name",
  handle: "yourname",
  headline: "Creator, builder & curious human",
  bio: "A little corner of the internet for my work, updates and favourite places.",
  avatar: "✦",
  theme: "midnight",
  links: [
    { label: "My website", url: "https://example.com" },
    { label: "Follow me on GitHub", url: "https://github.com" },
    { label: "Get in touch", url: "https://example.com/contact" }
  ]
});

const cut = (v, n) => String(v ?? "").trim().slice(0, n);
export function safeUrl(value) {
  const text = cut(value, 2048);
  if (!text) return "";
  try {
    const url = new URL(text);
    return ["https:", "http:"].includes(url.protocol) && url.hostname && !url.username && !url.password ? url.href : "";
  } catch { return ""; }
}
export function normaliseProfile(data) {
  const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const links = Array.isArray(source.links) ? source.links : SAMPLE.links;
  return {
    name: cut(source.name ?? SAMPLE.name, 70),
    handle: cut(source.handle ?? SAMPLE.handle, 36).replace(/[^a-zA-Z0-9_.-]/g, ""),
    headline: cut(source.headline ?? SAMPLE.headline, 100),
    bio: cut(source.bio ?? SAMPLE.bio, 280),
    avatar: cut(source.avatar ?? SAMPLE.avatar, 8),
    theme: Object.hasOwn(THEMES, source.theme) ? source.theme : "midnight",
    links: links.slice(0, MAX_LINKS).map(l => ({
      label: cut(l?.label, 60),
      url: cut(l?.url, 2048)
    }))
  };
}
export function validLinks(profile) {
  return normaliseProfile(profile).links.filter(l => l.label && safeUrl(l.url));
}
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
export function encodeProfile(data) {
  const json = JSON.stringify(normaliseProfile(data));
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
export function decodeProfile(encoded) {
  if (!/^[a-zA-Z0-9_-]{1,12000}$/.test(encoded || "")) throw new Error("Invalid profile link.");
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  base64 += "=".repeat((4 - base64.length % 4) % 4);
  const raw = atob(base64);
  const bytes = Uint8Array.from(raw, char => char.charCodeAt(0));
  return normaliseProfile(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)));
}
export function makePortableHtml(input) {
  const p = normaliseProfile(input);
  const theme = THEMES[p.theme];
  const links = validLinks(p);
  const linkMarkup = links.map(l =>
    `<a class="link" href="${escapeHtml(safeUrl(l.url))}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(l.label)}</span><span aria-hidden="true">↗</span></a>`
  ).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${escapeHtml(p.name)} — links</title>
<meta name="description" content="${escapeHtml(p.bio || p.headline)}">
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;font:16px/1.5 system-ui,-apple-system,sans-serif;background:${theme.bg};color:${theme.ink};display:grid;place-items:center;padding:42px 20px}main{width:min(100%,470px);text-align:center}.avatar{margin:auto;display:grid;place-items:center;width:88px;height:88px;border-radius:26px;background:${theme.accent};color:${theme.bg};font-size:40px;font-weight:700}.handle{opacity:.7;margin:18px 0 5px}h1{font-size:32px;letter-spacing:-.045em;margin:0}h2{font-size:17px;font-weight:600;margin:10px 0}.bio{color:${theme.muted};margin:14px auto 27px;max-width:380px}.links{display:grid;gap:12px}.link{display:flex;align-items:center;justify-content:space-between;padding:17px 20px;background:${theme.surface};border:1px solid ${theme.accent}42;border-radius:16px;color:${theme.ink};text-decoration:none;text-align:left;font-weight:650;transition:transform .15s}.link:hover{transform:translateY(-2px)}footer{font-size:12px;opacity:.55;margin-top:36px}a:focus-visible{outline:3px solid ${theme.accent};outline-offset:3px}
</style></head>
<body><main><div class="avatar" aria-hidden="true">${escapeHtml(p.avatar || p.name.slice(0,1))}</div><p class="handle">@${escapeHtml(p.handle)}</p><h1>${escapeHtml(p.name)}</h1><h2>${escapeHtml(p.headline)}</h2><p class="bio">${escapeHtml(p.bio)}</p><nav class="links" aria-label="My links">${linkMarkup || "<p>No links published yet.</p>"}</nav><footer>Made with SocialHub Studio · Exported independently</footer></main></body></html>`;
}
export function downloadText(text, filename, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function copyText(text) {
  if (navigator.clipboard && globalThis.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard permission unavailable. Copy the text manually.");
}
