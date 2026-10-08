import { decodeProfile } from "./core.mjs";
import { renderProfile } from "./render.mjs";
const target = document.getElementById("public-preview");
const match = /^#p=([A-Za-z0-9_-]+)$/.exec(window.location.hash);
try {
  if (!match) throw new Error("No profile was included in this link.");
  const profile = decodeProfile(match[1]);
  renderProfile(target, profile);
  document.title = profile.name + " · SocialHub profile preview";
} catch (error) {
  target.replaceChildren();
  const heading = document.createElement("h1");
  heading.textContent = "This profile isn't available.";
  const description = document.createElement("p");
  description.textContent = error.message;
  target.append(heading, description);
  document.getElementById("profile-message").textContent = "Check the preview URL or create a new page in Studio.";
  const link = document.createElement("a");
  link.href = "/studio.html";
  link.textContent = "Open Studio ↗";
  target.append(link);
}
