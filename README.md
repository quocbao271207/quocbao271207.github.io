# quocbao271207.github.io

Personal portfolio of **Trịnh Quốc Bảo** — AI engineer and Data Science student at HCMUT.

**Live:** https://quocbao271207.github.io/

## Stack

Plain HTML, CSS and JavaScript — no build step, no framework. Served directly by GitHub Pages.

```
index.html            page structure and static sections
assets/css/main.css   design tokens (dark / light), layout, components, animations
assets/js/data.js     project case studies (cards, modal content, filters)
assets/js/main.js     theme, navigation, filters, modal gallery, reveal effects, background canvas
assets/img/           optimised project images and generated SVG covers
```

## Updating content

- **Add or edit a project:** append an object to `PROJECTS` in `assets/js/data.js`
  (`title`, `meta`, `categories`, `short`, `summary`, `highlights`, `facts`, `tags`, `images`, `links`).
  Set `featured: true` to make the card span two columns.
- **Images:** export at ≤ 1400 px wide as JPEG (~80% quality) into `assets/img/`.

## Local preview

```bash
python -m http.server 5500
```

Then open http://localhost:5500.
