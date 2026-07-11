# UI/UX Style Guide

**JunMystery.github.io** — Clean Developer / IDE Aesthetic  
Design philosophy: an interface that feels like a high-end code editor or GitHub's UI. Every visual decision reinforces the developer identity.

---

## Design Philosophy

> **"Developer as Product"** — The portfolio _is_ the proof of work.  
> The UI speaks developer fluency through syntax color, monospace type, terminal chrome, and structural precision.

Core principles:
1. **OLED-first dark mode** — near-black backgrounds for modern screens.
2. **Terminal framing** — sections wrapped in macOS-style mock terminal containers.
3. **Syntax coloring** — section titles, tags, and labels use code-editor accent colors.
4. **Compact content** — tag clouds, single-line lists, terminal session output replace heavy cards.
5. **No decorative noise** — no gradients on content, no rounded pills on layout elements.
6. **Apple-style scroll animations** — fade + translateY reveal with stagger delays.

---

## Color System

All colors are defined as CSS custom properties in [`styles/base/tokens.css`](../styles/base/tokens.css).

### Dark Mode (Default — OLED Black)

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#05070a` | Page background |
| `--bg-secondary` | `#0c1017` | Cards, panels, navbar |
| `--bg-tertiary` | `#161b22` | Terminal header bar, tag backgrounds |
| `--border-color` | `#21262d` | All borders and dividers |
| `--text-primary` | `#c9d1d9` | Main readable text |
| `--text-secondary` | `#8b949e` | Subtitles, descriptions, nav links |
| `--text-muted` | `#484f58` | Timestamps, meta info, `##` prefix on titles |

### Syntax Accent Colors

| Token | Value | Role |
|---|---|---|
| `--accent-primary` | `#58a6ff` | Links, skill tags, hero title accent span, active borders |
| `--accent-secondary` | `#3fb950` | String syntax tokens, availability badge |
| `--accent-orange` | `#f0883e` | Hero subtitle, project type label, education period |
| `--accent-purple` | `#bc8cff` | Section titles (`##` headings), keyword tokens |
| `--accent-gradient` | `135deg #58a6ff → #bc8cff` | Reserved for hero/badge gradients |

### Light Mode (`data-theme="light"` — GitHub Light Style)

| Token | Value |
|---|---|
| `--bg-primary` | `#ffffff` |
| `--bg-secondary` | `#f6f8fa` |
| `--text-primary` | `#24292f` |
| `--accent-primary` | `#0969da` |
| `--accent-purple` | `#8250df` |

> Light mode mirrors **GitHub's exact palette** for instant developer familiarity.

---

## Typography

Two typefaces are imported from Google Fonts:

| Font | Variable | Usage |
|---|---|---|
| **Inter** | `--font-sans` | All body copy, descriptions, card text |
| **Fira Code** | `--font-mono` | Section titles, nav links, hero subtitle, terminal labels, skill names, buttons |

**Fira Code** is used deliberately for any UI element that conveys developer semantics (navigation items, labels, titles, tags). This blurs the boundary between "portfolio site" and "code editor."

### Type Scale

| Element | Size | Weight | Font |
|---|---|---|---|
| Hero Name | `3rem` | 800 | Inter |
| Hero Name (mobile) | `2.25rem` | 800 | Inter |
| Section Title | `1.5rem` | 700 | Fira Code |
| Project Title | `1.1rem` | 700 | Fira Code |
| Skill Group Title | `0.85rem` | 700 | Fira Code |
| Body / Description | `0.9rem` | 400 | Inter |
| Nav Links | `0.85rem` | 400 | Fira Code |
| Tags / Metadata | `0.7–0.75rem` | 400 | Fira Code |
| Terminal label | `0.75rem` | 400 | Fira Code |
| Footer | `0.75rem` | 400 | Fira Code |

---

## Spacing & Sizing

| Token | Value | Usage |
|---|---|---|
| `--container-max` | `1100px` | Max page width |
| `--border-radius-sm` | `4px` | Buttons, tags |
| `--border-radius-md` | `6px` | Cards, terminal frames |
| `--border-radius-lg` | `8px` | Larger modals (reserved) |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.12)` | Light elevation |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.2)` | Cards, terminal windows |
| `--transition` | `all 0.2s cubic-bezier(0.4,0,0.2,1)` | All hover/state transitions |

Section vertical rhythm: `padding: 2.5rem 0`.  
Container horizontal padding: `1.5rem`.

---

## Component Patterns

### Terminal Window

The primary visual container for all major sections.

```
┌────────────────────────────────────┐
│ ● ● ●         filename.ext         │  ← terminal-header (bg-tertiary)
├────────────────────────────────────┤
│                                    │
│  ## Section Title                  │  ← section-title (accent-purple)
│                                    │
│  [content inside]                  │  ← terminal-body-raw (padding only)
│                                    │
└────────────────────────────────────┘
```

- Traffic light dots: hardcoded macOS colors (`#ff5f56`, `#ffbd2e`, `#27c93f`).
- Filename label centered in header, Fira Code `0.75rem`, `text-secondary`.
- Terminal file labels match content type: `skills.yaml`, `projects.py`, `certifications.json`, `education.sh`.

### Section Titles

```css
.section-title {
  font-family: Fira Code;
  color: --accent-purple;
}
.section-title::before {
  content: '##';   /* Markdown heading pseudo-syntax */
  color: --text-muted;
}
```

Renders as: `## Technical Expertise` — mimicking a Markdown H2 inside a code file.

### About — Terminal Session

The About section uses a **terminal session** format instead of cards:

```
> cat about.tu
function NguyenHoangThanhTu() {
    let title = "IT Systems Engineer";
    let status = "Available";
    let focus = ["Infrastructure", "AI-Augmented Dev"];
    let langs = "Vietnamese (native) | English (working)";
}
```

- Each line starts with a `>` prompt (`accent-secondary` green).
- Syntax-colored tokens: keywords (`accent-purple`), functions (`accent-blue`), strings (`accent-green`).
- Inline tag pills for languages/domains with colored borders.

### Skills — Tag Cloud by Category

No card boxes. Skills are grouped by category with a **tag cloud** layout:

```
### AI-Ops             ### Infrastructure      ### Dev
[OpenAI API]           [Docker]               [TypeScript]
[LangChain]            [K8s]                  [Python]
[Vector DB]            [CI/CD]                [Kotlin]
```

- Group titles: Fira Code `0.85rem` bold, `accent-primary` with `###` prefix.
- Tags: monospace pills, `accent-primary` text on `bg-tertiary`.
- Filter tabs above the grid toggle visibility by `data-category`.

### Projects — Single Column with Flow Diagram

Each `.project-card` is a single column layout containing:
- **Title row**: project name (Fira Code, bold) + optional GitHub link icon.
- **Type label**: uppercase monospace label in `accent-orange`.
- **Description**: paragraph in `text-secondary`.
- **Metadata**: bordered left-accent panel with key-value rows.
- **Tech stack**: monospace tags in `accent-secondary`.
- **Flow diagram**: horizontal `[node] → [node] → [node]` chain representing architecture.

### Certifications — Compact Terminal List

No card boxes. Each cert is a single monospace line:

```
> IT Automation with Python · Google Career Certification (2025) · Verify →
```

- `>` prompt (`accent-primary`).
- `·` separator dots (`text-muted`).
- Inline Verify link.
- Flex-wrap: collapses to multiple lines on narrow viewports.

### Education — Flat Cards

Two-column grid (`1fr 1fr`), stacks on mobile:

- **Header**: institution name + period badge (`accent-orange`).
- **Degree**: monospace label in `text-secondary`.
- **Bullets**: `-` prefixed list items with `accent-purple` dash.

---

## Interactive States

| Element | Hover / Active State |
|---|---|
| Nav links | `text-primary` (brighter) |
| Social icons | `accent-primary` (blue) |
| Theme / Print buttons | `text-primary` + `accent-primary` border |
| Skill filter buttons | Active: `accent-primary` border + `bg-tertiary` fill; Hover: slight brighten |
| Skill tags | Static (no hover needed) |
| Cert links | `accent-primary` hover |
| Buttons (primary) | `opacity: 0.95` |
| Buttons (secondary) | `bg-tertiary` fill + `text-secondary` border |

All transitions use `--transition` (`0.2s cubic-bezier(0.4, 0, 0.2, 1)`).

---

## Theme Switching

Light/dark mode is toggled via a button in the navbar. State is:
- Stored in `localStorage` under key `theme`.
- Falls back to OS `prefers-color-scheme` on first visit.
- Applied as `data-theme="light"` or `data-theme="dark"` on `<html>`.
- Controlled by `src/controllers/theme.controller.js`.

The sun/moon icon swaps on toggle.

---

## Scroll Reveal Animations

Defined in [`styles/components/reveal.css`](../styles/components/reveal.css):

- **`.reveal`**: fade + translateY(24px) → visible on intersect.
- **`.reveal-hero`**: hero section delayed fade-in (0.5s delay).
- **`.reveal-stagger`**: child elements fade in sequentially with 0.05s stagger delays (up to 6 children).

Controlled by `src/controllers/scroll.controller.js` via `IntersectionObserver` (threshold 0.12, rootMargin -40px).

- `prefers-reduced-motion` disables all reveal animations.

---

## Responsive Design

| Viewport | Behavior |
|---|---|
| Desktop (`> 768px`) | Full horizontal navbar, all grids side-by-side |
| Mobile (`<= 768px`) | Hamburger nav drawer (slides from right), stacks grids |

The navbar drawer is `260px` wide, positioned fixed from the right, hidden at `right: -100%` and shown at `right: 0` via `.active` class.

> **High-DPI note:** At Windows 150% display scaling, a 994px physical window = ~662px CSS viewport. All breakpoints are calibrated to `768px` to keep layouts correct at standard Windows scaling.
