import {
  SAMPLE, STORAGE_KEY, THEMES, MAX_LINKS,
  normaliseProfile, encodeProfile, makePortableHtml, downloadText, copyText
} from "./core.mjs";
import { renderProfile } from "./render.mjs";

const $ = id => document.getElementById(id);
let profile;
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  profile = stored ? normaliseProfile(JSON.parse(stored)) : normaliseProfile(SAMPLE);
} catch {
  profile = normaliseProfile(SAMPLE);
}

function message(text, error = false) {
  $("status").textContent = text;
  $("status").style.color = error ? "#b0414a" : "#247b5a";
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    $("save-status").textContent = "Saved to this browser ✓";
  } catch {
    $("save-status").textContent = "Browser storage unavailable — export JSON";
  }
  renderProfile($("preview"), profile);
  updateThemes();
}
function updateThemes() {
  for (const button of $("theme-choices").querySelectorAll("button[data-theme]")) {
    button.setAttribute("aria-pressed", String(button.dataset.theme === profile.theme));
  }
}
function drawLinks() {
  const list = $("link-list");
  list.replaceChildren();

  profile.links.forEach((link, index) => {
    const row = document.createElement("div");
    row.className = "link-row";
    row.dataset.index = index;

    const fields = document.createElement("div");
    fields.className = "link-fields";
    const label = document.createElement("input");
    label.value = link.label;
    label.dataset.field = "label";
    label.maxLength = 60;
    label.setAttribute("aria-label", "Link " + (index + 1) + " title");
    label.placeholder = "Link title";

    const url = document.createElement("input");
    url.value = link.url;
    url.type = "url";
    url.dataset.field = "url";
    url.maxLength = 2048;
    url.setAttribute("aria-label", "Link " + (index + 1) + " URL");
    url.placeholder = "https://example.com";

    fields.append(label, url);

    const controls = document.createElement("div");
    controls.className = "link-buttons";
    for (const [action, glyph, title] of [
      ["up", "↑", "Move up"],
      ["down", "↓", "Move down"],
      ["remove", "×", "Remove link"]
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "icon-button";
      button.dataset.action = action;
      button.textContent = glyph;
      button.title = title;
      button.setAttribute("aria-label", title + " " + (index + 1));
      button.disabled = (action === "up" && index === 0) ||
                        (action === "down" && index === profile.links.length - 1);
      controls.append(button);
    }
    row.append(fields, controls);
    list.append(row);
  });

  $("link-count").textContent = profile.links.length + " / " + MAX_LINKS + " links";
  $("add-link").disabled = profile.links.length >= MAX_LINKS;
}
function hydrate() {
  for (const key of ["name", "handle", "headline", "avatar", "bio"]) {
    $(key).value = profile[key];
  }
  drawLinks();
  save();
}
for (const key of ["name", "handle", "headline", "avatar", "bio"]) {
  $(key).addEventListener("input", e => {
    profile = normaliseProfile({ ...profile, [key]: e.target.value });
    save();
  });
}
$("link-list").addEventListener("input", e => {
  const field = e.target.dataset.field;
  const index = Number(e.target.closest(".link-row")?.dataset.index);
  if (!["label", "url"].includes(field) || !Number.isInteger(index) || !profile.links[index]) return;
  profile.links[index][field] = e.target.value;
  profile = normaliseProfile(profile);
  save();
});
$("link-list").addEventListener("click", e => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;
  const index = Number(button.closest(".link-row").dataset.index);
  if (button.dataset.action === "remove") profile.links.splice(index, 1);
  if (button.dataset.action === "up" && index > 0) {
    [profile.links[index - 1], profile.links[index]] = [profile.links[index], profile.links[index - 1]];
  }
  if (button.dataset.action === "down" && index < profile.links.length - 1) {
    [profile.links[index + 1], profile.links[index]] = [profile.links[index], profile.links[index + 1]];
  }
  drawLinks();
  save();
});
$("add-link").addEventListener("click", () => {
  if (profile.links.length >= MAX_LINKS) return;
  profile.links.push({ label: "", url: "" });
  drawLinks();
  save();
  $("link-list").lastElementChild?.querySelector("input")?.focus();
});
for (const [key, config] of Object.entries(THEMES)) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-option";
  button.dataset.theme = key;
  const swatch = document.createElement("span");
  swatch.className = "theme-preview";
  swatch.style.background = `linear-gradient(135deg, ${config.bg} 0 65%, ${config.accent} 65% 100%)`;
  button.append(swatch, document.createTextNode(config.name));
  button.addEventListener("click", () => {
    profile.theme = key;
    save();
  });
  $("theme-choices").append(button);
}

$("export-html").addEventListener("click", () => {
  downloadText(makePortableHtml(profile), "my-socialhub-page.html", "text/html;charset=utf-8");
  message("HTML downloaded. Host it on GitHub Pages, Cloudflare or another static host.");
});
$("export-json").addEventListener("click", () => {
  downloadText(JSON.stringify(profile, null, 2), "socialhub-profile.json", "application/json");
  message("JSON backup downloaded.");
});
$("import-json").addEventListener("click", () => $("json-file").click());
$("json-file").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 64 * 1024) throw new Error("The JSON file must be smaller than 64 KB.");
    const incoming = JSON.parse(await file.text());
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      throw new Error("Expected a profile JSON object.");
    }
    profile = normaliseProfile(incoming);
    hydrate();
    message("Profile imported successfully.");
  } catch (err) {
    message("Import failed: " + err.message, true);
  }
  e.target.value = "";
});
$("share-profile").addEventListener("click", async () => {
  const encoded = encodeProfile(profile);
  const url = location.origin + "/profile#p=" + encoded;
  if (url.length > 7500) {
    message("The preview link is too long; remove links or export HTML instead.", true);
    return;
  }
  const output = $("share-output");
  output.textContent = url;
  output.hidden = false;
  try {
    await copyText(url);
    message("Preview URL copied. Anyone with this link can read your profile.");
  } catch {
    message("Preview URL generated below. Select and copy it manually.");
  }
});
$("reset-profile").addEventListener("click", () => {
  if (!confirm("Replace your current draft with the example? Export a JSON backup first if needed.")) return;
  profile = normaliseProfile(SAMPLE);
  hydrate();
  $("share-output").hidden = true;
  message("Example profile restored.");
});
hydrate();
