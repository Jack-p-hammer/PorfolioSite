# Mechanical Engineer Portfolio

A sleek, modern, JSON-driven portfolio designed for GitHub Pages.

## Customize

- Contact links in `index.html` (email, phone, LinkedIn, GitHub)
- Project data in `data/projects.json`
- Colors and layout in `styles.css`
- Images in `assets/`

### Project JSON schema

Each project is an object in the array:

```json
{
  "id": "unique-id",
  "title": "Project Title",
  "shortDescription": "Short summary for the card",
  "longDescription": "Longer write-up for the modal",
  "keywords": ["Tag1", "Tag2"],
  "image": "assets/your-image.ext",
  "links": [{ "label": "Link Text", "url": "https://..." }]
}
```

## Run locally

Open `index.html` in a browser, or serve with a simple HTTP server to avoid CORS issues.

## Deploy to GitHub Pages

1. Create a new public repo, e.g., `username.github.io` or any repo name.
2. Commit all files to the repo root (or to `/docs` if you prefer Pages from docs).
3. In GitHub → Settings → Pages:
   - For `username.github.io` repo: Source = `main`/`master`, folder = `/`.
   - For other repos: Source = `main`/`master`, folder = `/root` or `/docs` as configured.
4. Wait a minute, then visit your site at `https://<username>.github.io/` (or `https://<username>.github.io/<repo>/`).

## Notes

- All assets are static; no backend is required.
- Update favicon and meta tags as desired.
