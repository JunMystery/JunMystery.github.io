# Project Architecture

**JunMystery.github.io** — Personal Portfolio Site  
Static GitHub Pages site. No build step, no framework, no dependencies beyond Google Fonts and Font Awesome CDN.

---

## File Structure

```
JunMystery.github.io/
├── index.html          # Single-page document markup
├── style.css           # Entry point — imports all CSS layers
├── theme.css           # Design tokens, color system, base resets
├── layout.css          # Structural layout: navbar, hero, grid, footer, breakpoints
├── components.css      # UI components: buttons, terminal frames, skills (under 300 LOC)
├── content.css         # Section components: projects, certifications, education
├── print.css           # A4 CV print layout (media print)
├── script.js           # Interactive JS: theme toggle, skill filter, nav toggle, print
└── docs/
    ├── architecture.md # This file
    └── ui-ux-style.md  # Design system and UI/UX guidelines
```

---

## CSS Layer Architecture

CSS is split into four strict layers. Each file is under **300 lines** (enforced rule).

| File | Responsibility | Imports |
|---|---|---|
| `style.css` | Entry point that chains all layers | Imports all 4 CSS files |
| `theme.css` | CSS custom properties (tokens), fonts, base resets | Google Fonts |
| `layout.css` | Structural placement — navbar, hero, sections, footer, breakpoints | Uses tokens from `theme.css` |
| `components.css` | Visual components — buttons, cards, terminal frames, grids | Uses tokens from `theme.css` |
| `print.css` | A4 paper layout for CV export via `window.print()` | Overrides all screen styles |

### Why Layered?

- **Zero cascade conflicts** — each layer owns its domain.
- **DRY enforcement** — shared tokens only exist once in `theme.css` as CSS variables.
- **Surgical edits** — touching layout never risks breaking component visual style.

---

## HTML Structure (`index.html`)

Single scrollable page. Organized as:

```
<body>
  <!-- Print-only CV header (hidden on screen) -->
  <div class="print-only-header">

  <!-- Fixed top navigation bar -->
  <nav class="navbar">

  <!-- Hero section: name, title, CTA buttons, socials -->
  <header class="hero" id="home">

  <!-- About: Professional paradigm summary -->
  <section id="about">

  <!-- Skills: filterable Bento card grid, wrapped in terminal frame -->
  <section id="skills">

  <!-- Projects: project cards with architecture diagrams, wrapped in terminal frame -->
  <section id="projects">

  <!-- Certifications: cert cards, wrapped in terminal frame -->
  <section id="certifications">

  <!-- Education: edu cards, wrapped in terminal frame -->
  <section id="education">

  <footer class="footer">
  <script src="script.js">
</body>
```

### Terminal Window Pattern

All major content sections use a reusable **mock terminal frame**:

```html
<div class="terminal-window">
  <div class="terminal-header">
    <!-- macOS-style traffic light dots -->
    <div class="terminal-dots">...</div>
    <!-- Centered filename label -->
    <span class="terminal-title">section.ext</span>
  </div>
  <div class="terminal-body-raw">
    <!-- Section title + content, unstyled internally -->
  </div>
</div>
```

- **`terminal-window`** — border, shadow, rounded corners, overflow:hidden.
- **`terminal-header`** — top chrome bar with traffic lights + centered filename.
- **`terminal-body-raw`** — padding-only container. Content inside is **not re-styled**; existing grids, cards, and typography are preserved exactly.

---

## JavaScript (`script.js`)

Vanilla ES6. One `DOMContentLoaded` listener with four independent modules:

| Module | Trigger | Behavior |
|---|---|---|
| **Theme Toggle** | `#theme-toggle` button click | Toggles `data-theme` on `<html>`, saves to `localStorage`, swaps icon |
| **Skills Filter** | `.skills-tab-btn` click | Shows/hides `.skill-card` elements by `data-category` attribute |
| **Mobile Nav** | `#nav-toggle` click | Toggles `.active` class on `#nav-menu`, closes on link click or outside click |
| **Print/CV** | `#btn-print`, `#btn-print-nav` click | Calls `window.print()` to open browser print dialog |

---

## Responsive Breakpoints

Defined in `layout.css`:

| Breakpoint | Rules Applied |
|---|---|
| `<= 768px` | Mobile hamburger nav drawer activates; slides in from right |
| `<= 768px` | Summary grid stacks to single column; hero title scales down to `2.25rem` |

> **Note on Windows High-DPI Scaling:** At 150% OS display scaling, a `994px` browser window maps to `~662px` CSS viewport width. All layout stacking thresholds are set at `768px` to correctly remain side-by-side on standard scaled screens.

---

## Print / CV Mode (`print.css`)

Triggered by `window.print()`. Key behaviors:

- Hides navbar, hero, social links, filter buttons, print buttons.
- Reveals `<div class="print-only-header">` with full contact info row.
- Converts all sections to flat, A4-optimized single-column layouts.
- Removes shadows, borders, and terminal chrome frames.
- Forces black text on white paper background.
- Page-break safe with `break-inside: avoid` on cards.
