# Project Architecture

**JunMystery.github.io** — Personal Portfolio Site  
Static GitHub Pages site. No build step, no framework, no dependencies beyond Google Fonts and Font Awesome CDN.

---

## File Structure (MVC — Refactored)

```
JunMystery.github.io/
├── index.html              # View Shell — single-page markup
├── 404.html                # Catch-all redirect to index.html
│
├── styles/
│   ├── main.css            # Entry point — @import chain for all layers
│   ├── base/
│   │   ├── typography.css  # Google Fonts import (Fira Code + Inter)
│   │   ├── tokens.css      # CSS custom properties, dark/light variables
│   │   └── reset.css       # Universal reset, base body/html/a/ul styles
│   ├── layout/
│   │   ├── nav.css         # Fixed navbar, mobile drawer, breakpoints
│   │   ├── hero.css        # Hero section layout, title, subtitle
│   │   ├── sections.css    # Container, section padding, section-title
│   │   └── footer.css      # Footer layout, typewriter cursor
│   ├── components/
│   │   ├── terminal.css    # Mock terminal frame (header, dots, window)
│   │   ├── buttons.css     # .btn, .btn-primary, hero-badge/objective
│   │   ├── tabs.css        # Skills filter tabs
│   │   ├── project-flow.css# Horizontal flow nodes + arrows
│   │   └── reveal.css      # Apple-style scroll reveal animations
│   ├── content/
│   │   ├── about.css       # Terminal session output (.term-session, .term-tag)
│   │   ├── skills.css      # Skill groups, category titles, tag pills
│   │   ├── projects.css    # Project cards, metadata, tech stacks
│   │   ├── certifications.css  # Compact cert list (.cert-line, .cert-prompt)
│   │   └── education.css   # Education cards (.edu-grid, .edu-card)
│   └── print/
│       └── print.css       # A4 CV print layout (@media print)
│
├── src/
│   ├── app.js              # Bootstrap — imports all controllers (ES module source)
│   ├── bundle.js           # Offline-friendly single-file build (no import/export)
│   ├── controllers/
│   │   ├── theme.controller.js   # Dark/light toggle + localStorage
│   │   ├── nav.controller.js     # Mobile nav, smooth scroll without URL hash
│   │   ├── skills.controller.js  # Tab filter by data-category
│   │   ├── footer.controller.js  # Typewriter effect on scroll
│   │   └── scroll.controller.js  # IntersectionObserver reveal
│   ├── models/
│   │   ├── footer.model.js       # Typewriter line data
│   │   └── navigation.model.js   # Nav link configuration
│   ├── services/
│   │   ├── theme.service.js      # get/set/apply theme
│   │   ├── print.service.js      # window.print trigger
│   │   └── scroll.service.js     # IntersectionObserver factory
│   └── utils/
│       ├── constants.js          # CSS selectors, timing values
│       └── dom.js                # $, $$, createEl helpers
│
└── docs/
    ├── architecture.md       # This file
    └── ui-ux-style.md        # Design system and UI/UX guidelines
```

---

## CSS Layer Architecture

CSS is organized into four layers under `styles/`. Each file is under **300 lines** (enforced rule).

| Layer | Directory | Responsibility |
|---|---|---|
| `styles/base/` | 3 files | Design tokens, resets, font import |
| `styles/layout/` | 4 files | Structural placement — navbar, hero, sections, footer |
| `styles/components/` | 5 files | Reusable UI components — terminal, buttons, tabs, reveal |
| `styles/content/` | 5 files | Section-specific styles — about, skills, projects, etc. |
| `styles/print/` | 1 file | A4 paper layout for CV export |
| `styles/main.css` | Entry point | `@import` chain importing all layers in dependency order |

### Why Layered?

- **Zero cascade conflicts** — each file owns its domain.
- **DRY enforcement** — shared tokens only exist once in `tokens.css` as CSS variables.
- **Surgical edits** — touching layout never risks breaking component visual style.
- **300 LOC cap** — no file exceeds 300 lines; large components are split into separate files.

### Import Order

```
main.css
  → base/typography.css     (fonts must load first)
  → base/tokens.css         (CSS variables before any usage)
  → base/reset.css          (base element styles)
  → layout/*.css            (structural layout)
  → components/*.css        (reusable components)
  → content/*.css           (section-specific content)
  → print/print.css         (print overrides, last)
```

---

## HTML Structure (`index.html`)

Single scrollable page. Organized as:

```
<body>
  <!-- Print-only CV header (hidden on screen) -->
  <div class="print-only-header">

  <!-- Fixed top navigation bar -->
  <nav class="navbar">

  <!-- Hero section: name, title, career objective, CTA buttons, socials -->
  <header class="hero" id="home">

  <!-- About: Professional paradigm in terminal session format -->
  <section id="about">

  <!-- Skills: filterable tag clouds by category, wrapped in terminal frame -->
  <section id="skills">

  <!-- Projects: project cards with flow diagrams, wrapped in terminal frame -->
  <section id="projects">

  <!-- Certifications: compact terminal list, wrapped in terminal frame -->
  <section id="certifications">

  <!-- Education: edu cards, wrapped in terminal frame -->
  <section id="education">

  <footer class="footer">
  <script src="src/bundle.js">
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

## JavaScript Architecture (MVC)

Vanilla JS organized as **Model-View-Controller**. Code is authored as ES modules in `src/` and bundled into `src/bundle.js` for offline file:// compatibility.

### Module Map

| Layer | Directory | Files | Purpose |
|---|---|---|---|
| **Controllers** | `src/controllers/` | 5 | Handle DOM events, user interaction |
| **Models** | `src/models/` | 2 | Static data definitions (footer lines, nav config) |
| **Services** | `src/services/` | 3 | Pure logic (theme get/set, print, IntersectionObserver factory) |
| **Utils** | `src/utils/` | 2 | DOM helpers (`$`, `$$`), app constants |

### Controller Responsibilities

| Controller | Trigger | Behavior |
|---|---|---|
| **Theme** | `#theme-toggle` button click | Toggles `data-theme` on `<html>`, saves to `localStorage`, swaps icon |
| **Nav** | `#nav-toggle` click, `.nav-link` click | Mobile drawer toggle, smooth scroll without `#hash` in URL, close on click-outside |
| **Skills** | `.skills-tab-btn` click | Shows/hides `.skill-group` elements by `data-category` attribute |
| **Footer** | Scroll into view | Runs token-based typewriter effect on footer lines |
| **Scroll** | `DOMContentLoaded` | Registers IntersectionObserver for `.reveal` / `.reveal-stagger` / `.reveal-hero` |

### Data Flow

```
User Click → Controller.handle()
                → Service.call()        (if pure logic needed)
                → Model.read()          (if data needed)
                → DOM update            (controller applies changes directly)
```

### Offline Compatibility

`index.html` loads `src/bundle.js` — a single non-module script concatenated from all ES module sources. This avoids CORS restrictions when opening the page from `file://` protocol. The modular source files in `src/` are maintained for development clarity; running `python _concat.py` regenerates the bundle when sources change.

---

## Responsive Breakpoints

Defined in `styles/layout/nav.css` and `styles/content/*.css`:

| Breakpoint | Rules Applied |
|---|---|
| `<= 768px` | Mobile hamburger nav drawer activates; slides in from right |
| `<= 768px` | Summary grid stacks to single column; hero title scales down to `2.25rem` |
| `<= 768px` | Education grid stacks to single column |

> **Note on Windows High-DPI Scaling:** At 150% OS display scaling, a `994px` browser window maps to `~662px` CSS viewport width. All layout stacking thresholds are set at `768px` to correctly remain side-by-side on standard scaled screens.

---

## Print / CV Mode (`styles/print/print.css`)

Triggered by `window.print()`. Key behaviors:

- Hides navbar, hero, social links, filter buttons, print buttons.
- Reveals `<div class="print-only-header">` with full contact info row.
- Converts all sections to flat, A4-optimized single-column layouts.
- Removes shadows, borders, and terminal chrome frames.
- Forces black text on white paper background.
- Page-break safe with `break-inside: avoid` on cards.
