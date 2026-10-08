import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  SAMPLE, MAX_LINKS, THEMES, normaliseProfile, safeUrl,
  escapeHtml, encodeProfile, decodeProfile, makePortableHtml, validLinks
} from "../public/assets/core.mjs";
import { createCampaignUrl } from "../public/assets/tools-core.mjs";

test("share links round-trip Unicode profile content", () => {
  const input = { ...SAMPLE, name: "Café 🌿", bio: "Hello — 世界", links: [{ label: "📦 Code", url: "https://example.org/hello?q=1" }] };
  const decoded = decodeProfile(encodeProfile(input));
  assert.equal(decoded.name, "Café 🌿");
  assert.equal(decoded.bio, "Hello — 世界");
  assert.equal(decoded.links[0].label, "📦 Code");
});
test("malformed or too-long share strings reject", () => {
  assert.throws(() => decodeProfile("INVALID*"));
  assert.throws(() => decodeProfile("a".repeat(12001)));
});
test("protocol restrictions prevent javascript/data URLs and credentials", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hi", "ftp://example.org", "https://user:pass@example.org", "invalid"]) {
    assert.equal(safeUrl(url), "", url);
  }
  assert.equal(safeUrl("https://example.com"), "https://example.com/");
});
test("normalisation imposes link count and theme limits", () => {
  const input = { ...SAMPLE, theme: "__proto__", links: Array.from({ length: 30 }, () => ({ label: "x", url: "https://example.com" })) };
  assert.equal(normaliseProfile(input).theme, "midnight");
  assert.equal(normaliseProfile(input).links.length, MAX_LINKS);
  assert.ok(Object.hasOwn(THEMES, "ocean"));
});
test("escaping protects HTML export from script and attribute injection", () => {
  const input = {
    ...SAMPLE,
    name: '<script>alert("x")</script>',
    bio: '<img src=x onerror=alert(1)>',
    links: [{ label: '"><img src=x onerror=alert(1)>', url: "javascript:alert(1)" }, { label: "safe", url: "https://example.com" }]
  };
  const html = makePortableHtml(input);
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(!html.includes("<script>alert"));
  assert.ok(!html.includes('href="javascript:'));
  assert.equal(validLinks(input).length, 1);
  assert.equal(escapeHtml("a&b"), "a&amp;b");
});
test("UTM builder encodes values, retains arbitrary params and hash", () => {
  const result = createCampaignUrl("https://example.com/path?foo=1#part", {
    source: "social feed", medium: "post", campaign: "summer launch", content: "button 1"
  });
  const url = new URL(result);
  assert.equal(url.searchParams.get("foo"), "1");
  assert.equal(url.searchParams.get("utm_source"), "social feed");
  assert.equal(url.searchParams.get("utm_content"), "button 1");
  assert.equal(url.hash, "#part");
});
test("UTM builder rejects bad destination or empty required fields", () => {
  assert.throws(() => createCampaignUrl("javascript:alert(1)", { source:"x", medium:"y", campaign:"z" }));
  assert.throws(() => createCampaignUrl("https://example.com", { source:"", medium:"y", campaign:"z" }));
});
test("static site routes and script files exist", () => {
  const root = path.resolve(import.meta.dirname, "../public");
  for (const file of [
    "index.html", "studio.html", "tools.html", "profile.html", "privacy.html", "404.html",
    "assets/studio.js", "assets/tools.js", "assets/profile.js", "assets/style.css", "assets/favicon.svg"
  ]) assert.equal(fs.existsSync(path.join(root, file)), true, file);
  const config = JSON.parse(fs.readFileSync(path.resolve(root, "../wrangler.jsonc"), "utf8"));
  assert.equal(config.assets.directory, "./public");
  assert.equal(config.main, undefined, "There should be no dynamic Worker script");
});
