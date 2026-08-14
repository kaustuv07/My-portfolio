# assets/ — what goes where

## 1. Your CV (for the Download button)
Drop your CV file here and name it **`cv.pdf`**:

```
assets/cv.pdf
```

The hero "DOWNLOAD CV" button in `index.html` already points to `assets/cv.pdf`
(with download filename `Kaustuv_Baral_CV.pdf`). If you name the file something
else, update the `href` inside `index.html`:

```html
<a class="btn btn-primary" href="assets/cv.pdf" download="Kaustuv_Baral_CV.pdf">▸ DOWNLOAD CV</a>
```

## 2. Page logos (for "Pages I've Managed")
Drop brand logos in `assets/img/` (PNG/JPG/SVG). Then in `index.html`, for each
`.page-card`, swap the `src` and the `href`:

```html
<a class="page-card" href="https://facebook.com/your-page" target="_blank" rel="noopener">
  <img src="assets/img/your-logo.png" alt="" class="page-logo" loading="lazy" onerror="this.style.display='none'" />
  <span class="page-name">Your Brand Name</span>
  <span class="page-type">Facebook / Instagram</span>
  <span class="page-go">→</span>
</a>
```

If a logo is missing, the card still works — the image simply hides itself.

## 3. Current placeholders included
- `placeholder-logo.svg` — neon placeholder shown in all 4 page cards until you
  replace them with real brand logos.