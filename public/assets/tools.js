import { copyText } from "./core.mjs";
import { createCampaignUrl } from "./tools-core.mjs";

const $ = id => document.getElementById(id);
let generatedUrl = "";

$("utm-form").addEventListener("submit", event => {
  event.preventDefault();
  try {
    generatedUrl = createCampaignUrl($("utm-url").value, {
      source: $("utm-source").value,
      medium: $("utm-medium").value,
      campaign: $("utm-campaign").value,
      content: $("utm-content").value,
      term: $("utm-term").value
    });
    $("utm-output").textContent = generatedUrl;
    $("utm-copy").disabled = false;
    $("utm-status").textContent = "Link generated. Ready to copy.";
  } catch (err) {
    generatedUrl = "";
    $("utm-output").textContent = err.message;
    $("utm-copy").disabled = true;
    $("utm-status").textContent = "";
  }
});
$("utm-copy").addEventListener("click", async () => {
  if (!generatedUrl) return;
  try {
    await copyText(generatedUrl);
    $("utm-status").textContent = "Copied to clipboard.";
  } catch {
    $("utm-status").textContent = "Clipboard not available. Select the URL above to copy.";
  }
});

const canvas = $("card-canvas");
const palettes = {
  night: { bg: "#17243c", ink: "#eff8fa", accent: "#9df3d4", second: "#293b53" },
  peach: { bg: "#ffe2d0", ink: "#38223f", accent: "#ae5686", second: "#fff0e7" },
  blue: { bg: "#2553bf", ink: "#ffffff", accent: "#a3eaff", second: "#426bd5" },
  cream: { bg: "#f3f0dc", ink: "#263b35", accent: "#d57e58", second: "#e7e0c6" }
};

function linesFor(ctx, input, maxWidth, limit = 4) {
  const words = String(input).replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > limit) {
    const clipped = lines.slice(0, limit);
    let last = clipped[limit - 1];
    while (ctx.measureText(last + "…").width > maxWidth && last.length > 1) last = last.slice(0, -1);
    clipped[limit - 1] = last + "…";
    return clipped;
  }
  return lines;
}
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
function drawCard() {
  const square = $("card-size").value === "square";
  canvas.width = square ? 1080 : 1200;
  canvas.height = square ? 1080 : 630;
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const p = palettes[$("card-theme").value] || palettes.night;

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);
  // Simple abstract geometric accents, all generated locally.
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = p.second;
  ctx.beginPath(); ctx.arc(w * .84, h * .20, h * .43, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = square ? 7 : 6;
  ctx.strokeStyle = p.accent;
  const smallX = w - (square ? 300 : 270);
  const smallY = square ? 260 : 160;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(smallX + Math.cos(a) * 40, smallY + Math.sin(a) * 40);
    ctx.lineTo(smallX + Math.cos(a) * 100, smallY + Math.sin(a) * 100);
    ctx.stroke();
  }
  const x = square ? 92 : 86;
  const y = square ? 150 : 118;

  ctx.fillStyle = p.accent;
  roundedRect(ctx, x, y - 44, square ? 250 : 215, 38, 19);
  ctx.fill();
  ctx.fillStyle = p.bg;
  ctx.font = "bold 19px system-ui, sans-serif";
  ctx.fillText("SOCIALHUB TOOLKIT", x + 17, y - 18);

  const size = square ? 92 : 76;
  ctx.font = "800 " + size + "px system-ui,-apple-system,sans-serif";
  ctx.fillStyle = p.ink;
  const lines = linesFor(ctx, $("card-title").value || "Your announcement", square ? 850 : 950, square ? 6 : 4);
  const lh = size * 1.18;
  lines.forEach((line, i) => ctx.fillText(line, x, y + 85 + i * lh));
  const base = y + 100 + lines.length * lh;

  ctx.fillStyle = p.accent;
  roundedRect(ctx, x, Math.min(h - 182, base + 12), square ? 310 : 275, 6, 3);
  ctx.fill();
  ctx.fillStyle = p.ink;
  ctx.globalAlpha = .85;
  ctx.font = "28px system-ui,-apple-system,sans-serif";
  const subtitles = linesFor(ctx, $("card-subtitle").value || "", square ? 790 : 850, 2);
  const subStart = Math.min(h - 147, base + 55);
  subtitles.forEach((line, i) => ctx.fillText(line, x, subStart + i * 38));
  ctx.globalAlpha = 1;

  ctx.strokeStyle = p.accent;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, h - 80); ctx.lineTo(w - x, h - 80); ctx.stroke();
  ctx.font = "bold 22px system-ui,-apple-system,sans-serif";
  ctx.fillStyle = p.accent;
  ctx.fillText(($("card-tag").value || "SOCIALHUB LABS").slice(0, 45), x, h - 39);
  ctx.textAlign = "right";
  ctx.fillText("↗", w - x, h - 39);
  ctx.textAlign = "left";
}
for (const id of ["card-title", "card-subtitle", "card-tag", "card-theme", "card-size"]) {
  $(id).addEventListener("input", drawCard);
  $(id).addEventListener("change", drawCard);
}
$("download-card").addEventListener("click", () => {
  drawCard();
  canvas.toBlob(blob => {
    if (!blob) {
      $("card-status").textContent = "Could not create an image in this browser.";
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "socialhub-card-" + $("card-size").value + ".png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    $("card-status").textContent = "PNG downloaded.";
  }, "image/png");
});
drawCard();
$("utm-form").requestSubmit();
