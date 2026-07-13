# Portfolio Easter Eggs

> Proposals for JunMystery.github.io — developer-themed hidden surprises
> that showcase personality and delight technical visitors.

---

## 1. `__init__.js` — Console Greeting

**Trigger**: Open DevTools (F12) on the portfolio homepage.

**Behavior**:

A branded console.log with ASCII art fires on page load:

```
> Initializing portfolio session...

   ██╗░░░██╗██╗███████╗██╗░█████╗░███╗░░██╗
   ╚██╗░██╔╝██║██╔════╝██║██╔══██╗████╗░██║
   ░╚████╔╝░██║█████╗░░██║██║░░██║██╔██╗██║
   ░░╚██╔╝░░██║██╔════╝██║██║░░██║██║╚████║
   ░░░██║░░░██║██║░░░░░██║╚█████╔╝██║░╚███║
   ░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝

> try window._easter_egg() to unlock a surprise.
```

A global `window._easter_egg()` function is exposed. Calling it triggers a full-page **terminal reboot glitch**:

- Page content scrambles like falling matrix characters for ~1 second.
- A fake boot sequence prints in the console:

```
> REBOOTING PORTFOLIO KERNEL...
> [████████████░░░░░░] 67% — recompiling skills module...
> [████████████████░░] 85% — optimizing career trajectory...
> [██████████████████] 100% — done.
```

- Then the page smoothly returns to normal.

**Implementation estimate**: ~30 lines JS in `src/bundle/main.js`.

---

## 2. Konami Code — CRT Theme

**Trigger**: Type `↑ ↑ ↓ ↓ ← → ← →` anywhere on the portfolio page.

**Behavior**:

A CSS class `crt-mode` toggles on `<html>`. This activates a retro terminal aesthetic:

- **Scanlines**: A repeating CSS gradient overlay (`repeating-linear-gradient`) creates horizontal lines across the screen.
- **Green monochrome tint**: `filter: sepia(1) hue-rotate(90deg)` shifts everything to phosphor-green.
- **Flicker animation**: A subtle `@keyframes crt-flicker` makes the screen pulse imperceptibly every few seconds.
- **Cursor**: The blinking cursor becomes a thick green block (`caret-shape: block`).
- **Font**: Body text shifts to a monospaced font (Cascadia Code / JetBrains Mono).

Typing Konami again removes `crt-mode` and returns to normal.

**Bonus**: A tiny "CRT: ON" badge fades into the bottom-right corner when active.

**Implementation estimate**: ~20 lines CSS in `styles/base/tokens.css` or a new `styles/components/crt.css`, ~15 lines JS in `src/bundle/controllers/`.

---

## 3. Floating Orb Click — Particle Burst

**Trigger**: Click either gradient orb in the hero section (`hero-orb--blue` or `hero-orb--purple`).

**Behavior**:

On click, the orb explodes into a burst of 20–30 small floating particles:

- Each particle is a `<div>` with `position: fixed`, a small `width`/`height` (~6–12px), and `border-radius: 50%`.
- Particles inherit the orb's color (`var(--accent-primary)` for blue, `var(--accent-purple)` for purple).
- Each gets a random velocity vector (dx, dy) and fades out over ~1.5 seconds.
- The orb fades to 30% opacity for 1 second, then smoothly returns to full (recharges).

The effect reuses the same particle animation patterns already present in `src/pacman-game.js` (particle array + update loop), so no new rendering infrastructure is needed.

**Implementation estimate**: ~25 lines JS, no CSS changes (particles are inline-styled).

---

## 4. Secret 404 Runner Game

**Trigger**: Navigate to any non-existent page (`/foo`, `/whatever`) — hits `404.html`.

**Behavior**:

Instead of a boring error message, `404.html` becomes a playable **side-scrolling runner**:

- The player character is a terminal cursor `_` (drawn with CSS, or an inline SVG).
- Obstacles are HTTP error codes floating in from the right: `403`, `500`, `502`, `503`.
- The player presses `Space` or `Up` to jump. Score ticks up over time.
- Colliding with an error code shows "STATUS: PAGE_NOT_FOUND" with a retry button.
- The background is a dark terminal green with a subtle grid.

**Key constraint**: `404.html` must be self-contained (single HTML file with inline CSS/JS) since it's a GitHub Pages static error page — no external scripts.

**Implementation estimate**: ~80 lines HTML + CSS + JS inline in `404.html`.

---

## Priority Recommendation

| # | Egg | Effort | Wow Factor | Target |
|---|---|---|---|---|
| 1 | Console greeting | Very low | High | Devs (your audience) |
| 3 | Orb particle burst | Low | Medium | All visitors |
| 2 | Konami CRT theme | Low–Medium | High | Retro/game dev fans |
| 4 | 404 runner game | Medium | Very high | Everyone who hits a broken link |

**Start with #1** — it's the cheapest, most targeted, and immediately impresses the
people most likely to inspect your code.
