# quocbao271207.github.io

Portfolio of **Trịnh Quốc Bảo** — AI engineer and Data Science student at HCMUT — built as an opened field kit:
each project sits in a foam pocket, trays lift out in 3D as you scroll, and every item opens an inspection sheet
with real recordings, figures and status.

**Live:** https://quocbao271207.github.io/ · Vietnamese: https://quocbao271207.github.io/?lang=vi

## Structure

```
index.html            page shell (case, trays, log, contact label)
assets/css/kit.css    materials (shell, foam, tags), trays, inspection sheet, responsive and reduced-motion rules
assets/js/data.js     all content (bilingual { en, vi }) and the real numbers behind every chart
assets/js/i18n.js     interface strings
assets/js/charts.js   SVG charts drawn from data.js
assets/js/kit.js      rendering, EN/VI latch, scroll-driven 3D, video autoplay, inspection sheets, deep links (#TQB-101)
assets/img/           photos, screenshots and result figures (all real)
assets/video/         screen recordings (OneVoice local demo, VieGrand app/web/technician app, Sankit)
```

No build step and no framework — GitHub Pages serves the files as they are.

## Updating content

- Projects, research, awards, honours and the log live in `assets/js/data.js`. Each item has an asset tag
  (`TQB-1xx` projects, `TQB-2xx` research, `TQB-3xx` awards) that doubles as its deep link.
- Chart numbers live in `CHART_DATA` with their source file noted; change them only from a real result.
- Images: JPEG ≤ 1600 px wide, ~80% quality. Videos: H.264 MP4 or VP9 WebM, muted, a few MB at most.

## Local preview

```bash
python -m http.server 5500
```
