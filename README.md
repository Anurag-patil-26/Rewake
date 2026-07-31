# Rewake — Website

Landing page for [Rewake](https://github.com/Anurag-patil-26/Rewake-Windows).
Plain HTML/CSS/JS — no build step, no dependencies.

```
index.html    page content
styles.css    styling (design tokens in :root)
app.js        scroll reveal + hero demo animation
assets\       screenshots
Media\        local copy of the installer zip (buttons currently link to GitHub Releases)
```

## Run

Open `index.html` in a browser.

## Deploy

Copy the whole folder to any static host (GitHub Pages, Netlify, a web
server's root). Keep all files together.

## Release update

1. Run `build-release.ps1` in Rewake-Windows — it bumps the version in
   `index.html`, including the zip filename the buttons link to.
2. Upload the new `Rewake-Setup-v<version>.zip` to the GitHub release — the
   Download buttons link straight to the release asset.
3. Replace screenshots in `assets\` if the UI changed (same filenames).
