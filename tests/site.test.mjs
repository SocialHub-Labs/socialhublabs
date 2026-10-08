import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");
const pages = readdirSync(root).filter(file => file.endsWith(".html"));

function mappedFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\//, "") + (
    path.extname(decoded) ? "" : ".html"
  );
  return path.join(root, relative);
}

test("every HTML page has a title and language", () => {
  for (const name of pages) {
    const text = readFileSync(path.join(root, name), "utf8");
    assert.match(text, /<html\s+lang=["']en["']/i, name + " missing language");
    assert.match(text, /<title>[^<]+<\/title>/i, name + " missing title");
  }
});

test("internal page links and local static asset links resolve", () => {
  for (const name of pages) {
    const text = readFileSync(path.join(root, name), "utf8");
    const attributes = /\b(?:href|src)=["']([^"']+)["']/g;
    for (const [, raw] of text.matchAll(attributes)) {
      if (!raw.startsWith("/")) continue;
      const pathname = new URL(raw, "https://socialhub.win").pathname;
      assert.ok(existsSync(mappedFile(pathname)), name + ": " + raw);
    }
  }
});

test("release website does not contain repository setup placeholders", () => {
  const homepage = readFileSync(path.join(root, "index.html"), "utf8");
  assert.doesNotMatch(homepage, /YOUR_USERNAME|YOUR_GITHUB_USERNAME|TODO|FIXME/);
  assert.match(homepage, /https:\/\/github.com\/SocialHub-Labs\/socialhublabs/);
});

test("site contains no dynamic Worker entrypoint", () => {
  const config = JSON.parse(readFileSync(path.join(root, "../wrangler.jsonc"), "utf8"));
  assert.deepEqual(config.assets, { directory: "./public", not_found_handling: "404-page" });
  assert.equal(config.main, undefined);
});
