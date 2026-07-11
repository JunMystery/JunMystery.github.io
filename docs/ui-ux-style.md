# UI/UX Style Guide

**JunMystery.github.io** — Clean Developer / IDE Aesthetic  
Design philosophy: an interface that feels like a high-end code editor or GitHub's UI. Every visual decision reinforces the developer identity.

---

## Design Philosophy

> **"Developer as Product"** — The portfolio _is_ the proof of work.  
> The UI speaks developer fluency through syntax color, monospace type, terminal chrome, and structural precision.

Core principles:
1. **OLED-first dark mode** — near-black backgrounds for modern screens.
2. **Bento Box layout** — content grouped in distinct bordered panels.
3. **Terminal framing** — sections wrapped in macOS-style mock terminal containers.
4. **Syntax coloring** — section titles, tags, and labels use code-editor accent colors.
5. **No decorative noise** — no gradients on content, no rounded pills on layout elements.

---

## Color System

All colors are defined as CSS custom properties in [`theme.css`](../theme.css).

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
| `--accent-secondary` | `#3fb950` | String syntax tokens |
| `--accent-orange` | `#f0883e` | Hero subtitle, skill category badge |
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
| Project Title | `1.25rem` | 700 | Fira Code |
| Skill Title | `0.9rem` | 700 | Fira Code |
| Body / Description | `0.9rem` | 400 | Inter |
| Nav Links | `0.85rem` | 400 | Fira Code |
| Tags / Metadata | `0.7–0.75rem` | 400 | Fira Code |
| Terminal label | `0.75rem` | 400 | Fira Code |
| Footer | `0.8rem` | 400 | Fira Code |

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
│  [content grid / cards inside]     │  ← terminal-body-raw (padding only)
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

### Skill Cards (Bento Grid)

Auto-fill responsive grid (`minmax(280px, 1fr)`). Each card contains:
- **Header row**: skill name (Fira Code, bold) + category badge (`accent-orange`).
- **Tag row**: monospace pills with `accent-primary` text on `bg-tertiary` background.

Filter tabs above the grid use the same monospace style as nav links.

### Project Cards

Two-column grid inside each card (`1.1fr 0.9fr`):
- **Left**: Project type label, title, description paragraph, metadata key-values, tech stack tags.
- **Right**: Architecture diagram — vertical node → arrow → node stack.

### Certification / Education Cards

Simple flat bordered cards with `bg-secondary` fill. No visual hierarchy beyond `h4` titles.

---

## Interactive States

| Element | Hover / Active State |
|---|---|
| Nav links | `text-primary` (brighter) |
| Social icons | `accent-primary` (blue) |
| Theme / Print buttons | `text-primary` + `accent-primary` border |
| Skill filter buttons | `accent-primary` border + `bg-tertiary` fill |
| Skill tags | Static (no hover needed) |
| Cert links | `accent-primary` underline on hover |
| Buttons (primary) | `opacity: 0.95` |
| Buttons (secondary) | `bg-tertiary` fill + `text-secondary` border |

All transitions use `--transition` (`0.2s cubic-bezier(0.4, 0, 0.2, 1)`).

---

## Theme Switching

Light/dark mode is toggled via a button in the navbar. State is:
- Stored in `localStorage` under key `theme`.
- Falls back to OS `prefers-color-scheme` on first visit.
- Applied as `data-theme="light"` or `data-theme="dark"` on `<html>`.

The sun/moon icon swaps on toggle.

---

## Responsive Design

| Viewport | Behavior |
|---|---|
| Desktop (`> 768px`) | Full horizontal navbar, all grids side-by-side |
| Mobile (`<= 768px`) | Hamburger nav drawer (slides from right), summary grid stacks |

The navbar drawer is `260px` wide, positioned fixed from the right, hidden at `right: -100%` and shown at `right: 0` via `.active` class.

> **High-DPI note:** At Windows 150% display scaling, a 994px physical window = ~662px CSS viewport. All breakpoints are calibrated to `768px` to keep layouts correct at standard Windows scaling.
