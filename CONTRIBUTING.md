# Contributing to SocialHub Labs

Thanks for helping improve practical, portable tools for creators.

## Before you start

- Check [existing issues](https://github.com/SocialHub-Labs/socialhublabs/issues) for similar requests.
- For substantial changes, open an issue first to discuss scope. Small bug fixes and improvements can go straight to a pull request.
- Keep the site **free to use, static-first, accessible and easy to understand**. Avoid adding external services or frameworks unless the benefits clearly justify the maintenance and privacy costs.
- Please do not submit secrets, credentials, personal user profiles or copyrighted material you are not authorised to distribute.

## Local setup

```bash
git clone https://github.com/SocialHub-Labs/socialhublabs.git
cd socialhublabs
npm ci
npm run dev
```

In another terminal:

```bash
npm run check
```

Browser-test any user-facing changes at desktop and narrow/mobile widths.

## Pull request checklist

1. Explain the user-facing problem and the changes made.
2. Add or update tests for shared logic where possible.
3. Run `npm run check` and include the result in the PR.
4. Test keyboard focus and small-screen layout when changing UI.
5. Keep README/feature descriptions accurate: features planned for the future should never be presented as shipped.
6. Note privacy, storage, security or cost implications if the change adds external requests, new state or third-party dependencies.

## Code style

- Use plain modern JavaScript and ES modules.
- Treat all URL and profile fields as untrusted input.
- Prefer standard browser APIs over dependencies.
- Use DOM creation/text nodes instead of injecting user content via `innerHTML`.
- Avoid breaking the portable HTML export format and existing share links.
- Keep function names and comments clear; optimise for maintainability.

## Reporting bugs

Use the [issue tracker](https://github.com/SocialHub-Labs/socialhublabs/issues/new/choose) and include the affected browser/OS, reproducible steps, actual result and expected result. Redact account data and tokens from examples.

For a suspected security vulnerability, please follow [SECURITY.md](SECURITY.md), not a public issue.

## Licensing

By submitting code, you confirm you have the right to contribute it under this repository's [MIT licence](LICENSE). Preserve existing copyright and licence notices.
