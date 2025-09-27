# Mechanical Engineer Portfolio

A sleek, modern, JSON-driven portfolio designed for GitHub Pages.

### Project JSON schema (for future project additions)

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
