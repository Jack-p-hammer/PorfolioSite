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
  "images": ["assets/image1.ext", "assets/image2.ext", "assets/image3.ext"],
  "links": [{ "label": "Link Text", "url": "https://..." }]
}
```

**Note:** 
- `image` is used for the project card thumbnail
- `images` array is used for the modal slideshow (optional - falls back to `image` if not provided)
- Keywords are automatically used to generate filter buttons

## Run locally

Open `index.html` in a browser, or serve with a simple HTTP server to avoid CORS issues.

## Deploy to GitHub Pages

1. Create a new public repo, e.g., `username.github.io` (user/organization site) or any repo name (project site).
2. Commit all files to the repo root (or to `/docs` if you choose to serve from docs).
3. In GitHub → Settings → Pages:
   - For a `username.github.io` repo (user/organization site):
     - Source: Deploy from branch
     - Branch: `main` (or `master`)
     - Folder: `/(root)`
   - For other repos (project sites), choose ONE of the following:
     - Option A: Keep site files at the repository top-level → set Folder to `/(root)`
     - Option B: Put site files in a `/docs` folder → set Folder to `/docs`
   - Note: You do NOT create a folder named `root`. `/(root)` simply means the top-level of the repository.
4. Wait a minute, then visit your site at `https://<username>.github.io/` or `https://<username>.github.io/<repo>/`.

## Features

- **Search & Filter**: Search projects by title, description, or keywords. Filter by skill tags.
- **Image Slideshow**: Support for multiple images per project with navigation controls.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.
- **Modern UI**: Clean, professional design with smooth animations.
- **JSON-driven**: Easy to update projects without touching code.

## Notes

- All assets are static; no backend is required.
- Update favicon and meta tags as desired.
- Search and filter functionality works in real-time.
- Modal slideshow supports keyboard navigation (arrow keys).
