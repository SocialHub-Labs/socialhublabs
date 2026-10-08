# Security policy

SocialHub Labs is a small open-beta project with no account backend. Security reports are still welcome.

## Supported versions

The latest version of the `main` branch is the supported public build. Older exported standalone HTML files are controlled by the users who downloaded them; we cannot update those files remotely.

## Reporting a vulnerability

**Please do not disclose an exploitable issue in a public GitHub issue before it has been assessed.**

Use the GitHub repository's **Security → Report a vulnerability** option when private vulnerability reporting is enabled:

https://github.com/SocialHub-Labs/socialhublabs/security/advisories/new

If GitHub private reporting is not enabled, open a regular issue requesting a private contact channel **without including exploit details or sensitive information**.

We aim to investigate good-faith reports, but as a small independent project cannot promise a particular response or resolution time. Do not test against third-party accounts or services you do not own.

## Relevant risks

- URL handling and clickable third-party destinations.
- User-controlled text in the editor and exported HTML.
- Data that appears in share-link fragments.
- Browser storage, downloads and file imports.
- Supply chain and deployment changes if dependencies are added later.

The application does **not** currently store profiles on a server, process credentials, connect to social-platform accounts or expose a custom API endpoint.
