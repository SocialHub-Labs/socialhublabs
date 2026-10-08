# Using SocialHub Labs

This guide covers the tools currently available in the [open beta](https://socialhub.win). No sign-up is required.

## Create a link page

1. Open [Link Page Studio](https://socialhub.win/studio).
2. Enter your display name, username, headline, avatar symbol and short bio.
3. Add your destination links, using complete `https://` or `http://` URLs.
4. Reorder links with the up/down controls, remove links you don't want, and select a theme.
5. Check the live preview. Invalid or empty links are not shown in the published output.

The editor stores the draft in the current browser's local storage. If you clear site data, switch devices, or use private browsing, the draft may no longer be available.

### Save, publish or share

| Button | Result | Best for |
| --- | --- | --- |
| **Download HTML** | A self-contained HTML file that includes the profile and styles | Publishing on your own static host |
| **Export JSON** | A portable profile backup | Keeping an editable copy |
| **Import JSON** | Loads a saved draft | Moving between browsers/devices |
| **Copy preview link** | Encodes public profile data in a URL fragment | Quickly showing someone a draft |

### Host your exported page

After clicking **Download HTML**, you can:

- Open the downloaded file on your computer to preview it.
- Upload it as `index.html` to your own GitHub Pages or Cloudflare Pages static site.
- Publish it on any static HTML host that allows you to upload files.

There are no external stylesheets, JavaScript libraries or APIs required by the generated page. It links to the destinations you chose.

### Sharing and privacy

Shared preview links are not permanent hosted accounts or short URLs. The profile data is included in the URL fragment (after `#`), using reversible base64url encoding. Anyone who has the complete URL can read the contents. Keep sensitive information out of profiles intended for sharing.

Studio supports up to 12 links. Very large profiles may exceed the preview link length limit: use Download HTML instead.

## Create a social card

1. Open the [Creator Toolkit](https://socialhub.win/tools#card).
2. Write a headline and supporting line.
3. Choose a short signature or brand label.
4. Select a colour palette.
5. Select `1200 × 630` for a social-preview image or `1080 × 1080` for a square post.
6. Select **Download PNG**.

The image is drawn using your browser's Canvas API and saved as a PNG. It is not uploaded to a remote image generation service.

## Generate UTM campaign URLs

1. Open [Campaign Link Builder](https://socialhub.win/tools#utm).
2. Enter an existing destination URL beginning with `https://` or `http://`.
3. Set the required **source**, **medium** and **campaign** fields.
4. Optionally provide **content** and **term**.
5. Generate and copy the result.

Existing unrelated query parameters and URL fragments remain intact. UTM parameters identify campaign traffic; they do not themselves collect statistics. You'll need analytics at the destination if you want to measure results.

## Need help?

For bugs and feature requests, use the [GitHub issue tracker](https://github.com/SocialHub-Labs/socialhublabs/issues/new/choose). Please redact private profile data and credentials from reports.
