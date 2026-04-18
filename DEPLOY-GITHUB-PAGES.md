# Deploy Coin Divination to GitHub Pages

This project is already structured as a static site, so GitHub Pages can publish it directly from the repository root.

## What is ready

- `index.html` is the entry page.
- `styles.css` and `app.js` are loaded with relative paths.
- `assets/` contains the optimized coin images used by the site.
- `.nojekyll` is included so GitHub Pages serves the site as-is.

## Recommended repo structure

Keep these files at the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `fortune-core.js`
- `bazi-rules.js`
- `book-rules.js`
- `lunar-almanac.js`
- `yijing-rules.js`
- `assets/`
- `.nojekyll`

You can keep notes and test files in the repo, but they are not needed for the live site.

## Deploy steps

1. Create a GitHub repository.
2. Upload this project to the repository root.
3. Commit and push your files to the default branch, usually `main`.
4. Open the repository on GitHub.
5. Go to `Settings` -> `Pages`.
6. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
7. Click `Save`.
8. Wait for GitHub Pages to publish the site.
9. Open the site URL shown in the Pages settings.

## Optional next step

If you want a cleaner public URL, add a custom domain later in:

- `Settings` -> `Pages` -> `Custom domain`

## Notes

- This site is fully static, so it does not need `node server.mjs` on GitHub Pages.
- Browser `localStorage` still works after deployment, but it stores data per browser and device.
- If you update files later, push a new commit and GitHub Pages will redeploy automatically.
