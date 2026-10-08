<div align="center">
  <img src="public/assets/favicon.svg" alt="SocialHub Labs mark" width="72" height="72">

  # SocialHub Labs

  **Create your corner of the internet. Keep control of it.**

  Free, privacy-conscious creator tools that run in your browser. No account, no server-side profile database, and no subscription required.

  [Website](https://socialhub.win) · [Link Page Studio](https://socialhub.win/studio) · [Creator Toolkit](https://socialhub.win/tools) · [Report an issue](https://github.com/SocialHub-Labs/socialhublabs/issues)

  ![License: MIT](https://img.shields.io/badge/license-MIT-2c7962)
  ![JavaScript: vanilla](https://img.shields.io/badge/JavaScript-vanilla-f3cd70)
  ![Deployment: static](https://img.shields.io/badge/deployment-static%20assets-4181b8)
  [![CI](https://github.com/SocialHub-Labs/socialhublabs/actions/workflows/ci.yml/badge.svg)](https://github.com/SocialHub-Labs/socialhublabs/actions/workflows/ci.yml)
</div>

---

## What you can do

### Link Page Studio

Build a personal link page with your own name, bio, links and visual theme. See updates instantly and publish independently.

- Add up to 12 links, change their order and preview the result.
- Choose between four colour palettes.
- Download a **standalone HTML page**, with styles included, to host anywhere.
- Import and export a JSON backup.
- Share a **read-only preview link** without registering an account.

**Open:** [SocialHub Studio](https://socialhub.win/studio)

### Creator Toolkit

Two small utilities that work entirely in the browser:

| Tool | What it does | Output |
| --- | --- | --- |
| **Social Card Maker** | Compose a branded announcement with editable copy, palette and format | 1200 × 630 or 1080 × 1080 PNG |
| **Campaign Link Builder** | Add correctly encoded UTM tags to an existing URL | Copyable URL with original query parameters and fragment preserved |

**Open:** [Creator Toolkit](https://socialhub.win/tools)

> **Current scope:** SocialHub Labs is an early-stage project. It does not offer hosted user accounts, cross-platform social posting, click analytics or integrations with social-network accounts. Shared previews are not a hosted-profile service.

## Why we built it this way

SocialHub Labs focuses on **small, portable tools**. The editor remembers your draft in your own browser; profile exports can be published on any static host. The website itself is deliberately simple to inspect, improve and self-host.

| Principle | Implementation |
| --- | --- |
| No account required | Edits are saved in browser `localStorage` |
| Own your content | Export a complete HTML page and JSON backup |
| No platform APIs | Client-side HTML, CSS, JavaScript and Canvas |
| No operational backend | Cloudflare Workers **Static Assets**, with no Worker script |
| No third-party JS dependencies | Native browser APIs, ES modules and a small codebase |

### How sharing works

A preview link encodes the profile JSON in its URL **fragment** (`#p=…`). The viewer reconstructs it in the browser; SocialHub Labs does **not** store a remote copy or assign you a persistent user account.

**It is not encrypted.** Anyone with the link can read the embedded profile data. Do not put private information or credentials in a shared profile. For a fully independent web page, use **Download HTML**.

## Try it locally

Requirements: **Node.js 20+** (24 recommended) and npm.

```bash
git clone https://github.com/SocialHub-Labs/socialhublabs.git
cd socialhublabs
npm ci
npm run dev
```

Open the URL Wrangler prints, then visit `/studio` or `/tools`.

Run the test suite and JavaScript syntax checks:

```bash
npm run check
```

Deploy to Cloudflare using:

```bash
npm run deploy
```

You need an authenticated Cloudflare account for deployment. For the repository's Git-connected deployment and domain setup, see [Deployment & operations](docs/DEPLOY.md).

## Code map

```text
public/
├── index.html           Product website
├── studio.html          Link Page Studio UI
├── profile.html         Read-only profile preview viewer
├── tools.html           Card maker and UTM builder
├── privacy.html         Privacy notice
└── assets/
    ├── core.mjs         Profile validation, sharing and HTML export
    ├── render.mjs       Safe DOM rendering
    ├── studio.js        Editor interactions and local persistence
    ├── profile.js       Shared profile viewer
    ├── tools-core.mjs   Campaign URL builder
    ├── tools.js         Card rendering and toolkit interactions
    └── style.css        Responsive styles
tests/                   Automated tests with Node's built-in runner
docs/                    Deployment, architecture and product notes
.github/workflows/       CI checks
wrangler.jsonc           Cloudflare static-asset deployment
```

There is no application build step: the browser loads the files under `public/` directly. npm is used for local development, deployment and tests, not for bundling client-side dependencies.

## Project status and roadmap

**Open beta (v0.1)** — the three tools above are usable today. We are exploring additional profile templates, accessibility improvements and user-owned publishing workflows; these are ideas, not features we claim to have shipped.

See the [User Guide](docs/USER_GUIDE.md) for publishing/export instructions, [CHANGELOG.md](CHANGELOG.md) for release notes, and [Architecture](docs/ARCHITECTURE.md) for the implementation and security model.

## Contributing and security

Pull requests and bug reports are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing, and [SECURITY.md](SECURITY.md) for responsible security reporting.

If you're reporting a regular issue, [open a GitHub issue](https://github.com/SocialHub-Labs/socialhublabs/issues/new/choose). Please do not paste private profile contents, access tokens or sensitive URLs into public issues.

## Licence

Released under the [MIT licence](LICENSE).

SocialHub Labs is an independent open-source project. References to third-party platforms are descriptive and do not imply affiliation.
