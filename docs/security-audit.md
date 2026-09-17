# Security Audit — HTML Backend

**Scope:** Static GitHub Pages site. No server-side backend exists; "HTML backend" covers
the static HTML/CSS/JS that serves content. Last audit: 2026-07-17.

## Posture

| Check | Result |
|---|---|
| External/CDN dependencies | None — fully offline-first, self-hosted fonts/icons |
| Secrets / API keys in source | None found |
| Mixed content / protocol-relative URLs | None |
| Broken relative paths | None |
| `eval()` / `document.write` / string-arg `setTimeout` | None |
| DOM injection from URL/user input | None — `location.hash`/`location.search` never reflected into DOM |
| XSS via `innerHTML` | Only static/literal data (game state, bundled locale strings) — safe |

## Fixed

- **`target="_blank"` without `rel="noopener noreferrer"`** — 20 links across
  `index.html` and `cv/index.html`. Reverse-tabnabbing protection added.

## Accepted (no fix needed)

- **Inline `<style>`/`<script>` in `cv.html` and `src/404.html`** — these are
  intentionally self-contained standalone pages (redirect + 404). The 404 script
  uses `textContent` (not `innerHTML`) for the path, so no XSS risk.
- **`innerHTML` in game files + `language.js`** — inputs are hardcoded literals or
  bundled static locale data, never user/URL controlled. Safe as-is.

## Hardening Note

If locale data or game messages ever become externally sourced, the `innerHTML`
usages should be sanitized (e.g. `escapeHtml()` helper already exists in
`bundle/controllers/pipeline-render.js`).

---

# Frontend Audit — 2026-07-17

**Verdict:** No broken CSS/asset references, no missing i18n keys, no duplicate IDs.
Fixed the following:

## Fixed
- **HIGH** — Missing FA glyphs `fa-external-link-alt` (7 cert links) and `fa-globe`
  (CV portfolio link) rendered as blank boxes. Added definitions to
  `styles/vendor/fontawesome.css` (codepoints `\f35d`, `\f0ac` in `fa-solid-900`).
- **MEDIUM** — Icon-only buttons (`lang-toggle`, `theme-toggle`, `achieve-btn`) now
  have `aria-label`. Lang menu got `role="menu"`/`aria-label`; options got
  `role="menuitem"` + `tabindex="0"` + Enter/Space keyboard handlers
  (`src/bundle/controllers/language.js`, bundle rebuilt).
- **MEDIUM** — Removed `maximum-scale=1.0, user-scalable=no` zoom lock from all 5
  game pages (WCAG 1.4.4).
- **MEDIUM** — Lowered `body::before` noise overlay `z-index` from 9999 → 1 so it
  can't trap modals/drawers (`styles/main.css`).
- **LOW** — `aria-hidden="true"` on 4 decorative terminal-dots blocks; aligned stale
  no-JS fallback text (`hero.badge`, `skills.tab_aiops`) with locale.

## Verified clean
- Canvas scaling already handled by `game-layout.css` (`width:100%; max-width; height:auto`).
- HTML structure validated (no unclosed/stray tags).
- All `fa-external-link-alt`/`fa-globe` usages are `fas` (solid) — match font face.

