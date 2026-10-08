import { normaliseProfile, THEMES, validLinks, safeUrl } from "./core.mjs";

function element(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = content;
  return el;
}

/** Render user-provided profile data using safe DOM APIs, not innerHTML. */
export function renderProfile(container, data) {
  const profile = normaliseProfile(data);
  const theme = THEMES[profile.theme];
  const vars = {
    "--profile-bg": theme.bg, "--profile-surface": theme.surface,
    "--profile-ink": theme.ink, "--profile-muted": theme.muted,
    "--profile-accent": theme.accent
  };
  Object.entries(vars).forEach(([key, value]) => container.style.setProperty(key, value));
  container.replaceChildren();

  container.append(element("div", "profile-avatar", profile.avatar || profile.name.slice(0, 1)));
  container.append(element("p", "profile-handle", "@" + (profile.handle || "yourname")));
  container.append(element("h2", "profile-name", profile.name || "Your name"));
  container.append(element("p", "profile-headline", profile.headline));
  container.append(element("p", "profile-bio", profile.bio));

  const links = element("nav", "preview-links");
  links.setAttribute("aria-label", "Profile links");

  const items = validLinks(profile);
  if (!items.length) {
    links.append(element("p", "empty-links", "Add a valid link to see it here."));
  } else {
    for (const link of items) {
      const anchor = element("a", "", "");
      anchor.href = safeUrl(link.url);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.append(element("span", "", link.label));
      anchor.append(element("span", "", "↗"));
      links.append(anchor);
    }
  }
  container.append(links);
  container.append(element("p", "preview-brand", "MADE WITH SOCIALHUB STUDIO"));
}
