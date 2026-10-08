# Architecture

SocialHub Labs is a client-side application built with plain HTML, CSS and ES modules. The production deployment is a Cloudflare Worker **static-assets** project, with no Worker `fetch()` entrypoint.

## Packages and responsibilities

| File | Responsibility |
| --- | --- |
| `public/index.html` | Marketing site and navigation |
| `public/studio.html` + `assets/studio.js` | Profile editor and browser storage |
| `assets/core.mjs` | Data normalisation, URL validation, share links, portable HTML export |
| `assets/render.mjs` | Safely render profile data into the DOM |
| `public/profile.html` + `assets/profile.js` | Render shared links from URL fragments |
| `public/tools.html` + `assets/tools.js` | Canvas card editor and UTM UI |
| `assets/tools-core.mjs` | UTM query generation |
| `assets/style.css` | Responsive design system |
| `wrangler.jsonc` | Cloudflare static asset routing |
| `tests/core.test.mjs` | Core regression tests |

There is deliberately no bundler, runtime framework, authentication, API key, cloud storage, hosted profile service or backend analytics layer.

## Data flow

### Editing a profile

```text
User edits form fields
    │
    ├── normaliseProfile() — limit lengths and safe formats
    │
    ├── Browser localStorage — save the draft locally
    │
    └── renderProfile() — live DOM preview
```

### Exporting

```text
Current profile
    ├── JSON.stringify() → .json backup
    ├── makePortableHtml() → downloadable standalone .html
    └── encodeProfile() → /profile#p=<encoded JSON>
```

Share URLs do not create a stored profile or permanent user identity. URL fragments normally stay in the browser rather than being sent in the HTTP request, but links may be saved in chat history, browser history and other locations. The base64url encoding is reversible, not encryption.

### UTM and social cards

- The campaign builder uses the browser `URL` and `URLSearchParams` APIs. It preserves unrelated parameters and URL fragments, and does not contact the destination site.
- The social card creator draws using the browser Canvas 2D API, then exports a Blob as PNG. It does not send text or images to a remote renderer.

## Security boundaries

- `safeUrl()` permits only `http:` and `https:`, rejecting URLs with embedded credentials.
- The editor's DOM rendering uses `textContent` and `document.createElement`, rather than interpolating user strings into HTML.
- The exported static HTML escapes user-supplied text and attribute values.
- Shared profile data is limited in length and decoded with error handling.
- Link previews open in a new tab with `rel="noopener noreferrer"`.
- External destinations are user-selected and have their own policies. SocialHub cannot guarantee the safety of sites users link to.

**Known boundaries:** Profile data is public once shared; localStorage is not an encrypted vault; generated HTML should be served by a trusted static host; and any future server-side capabilities would require a fresh security/privacy review.

## Performance and maintainability

- Static HTML pages can be cached at Cloudflare's edge.
- Frontend code does not need Node.js or npm once deployed.
- Tests use Node's built-in test runner.
- Styles and JavaScript are currently kept in straightforward files, intentionally avoiding framework and build-tool complexity.

## Extension guidelines

Add a backend only when a feature truly requires one. Adding social OAuth integrations, real-time analytics or persistent hosted accounts would introduce access tokens, storage, rate limits and new compliance obligations. Document those changes before shipping them.
