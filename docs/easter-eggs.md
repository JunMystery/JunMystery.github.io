# Portfolio Easter Eggs

> Hidden surprises in JunMystery.github.io — developer-themed, discovery-driven.

---

## 1. Console Greeting + Reboot Glitch (`_easter_egg()`)

**Status**: ✅ SHIPPED

**Trigger**: Open DevTools (F12) on the portfolio homepage.

**Behavior**:

A branded ASCII art console.log fires on page load:

```
> try window._easter_egg() to unlock a surprise.
```

Calling `window._easter_egg()` triggers a **3-phase full-screen glitch**:

1. **Screen shake** (0–2500ms): Page scrambles with hue-rotate/brightness pulses, `glitching` CSS class.

2. **Matrix rain** (2500–5500ms): Canvas overlay with katakana characters falling, shifts from green to cyan at 4000ms.

3. **Boot messages** (5500–7000ms+): Lines type out one character at a time:
   - `> ALL SYSTEMS NOMINAL.`
   - `> MEMORY: 0xDEADBEEF bytes free.`
   - `> PORTFOLIO KERNEL v1.0 ready.`
   - `> Press any key to continue...`

Then canvas fades out, page recovers. Safe timeout at 12s.

**Files**: `src/bundle/controllers/easter-egg.js` (177 lines), `styles/components/glitch.css`

---

## 2. Konami Code — CRT Mode (desktop) / Triple-tap Hero Title (mobile)

**Status**: ✅ SHIPPED

**Trigger**:
- **Desktop**: Type `↑ ↑ ↓ ↓ ← → ← →` (Konami code) anywhere on the page.
- **Mobile**: Triple-tap the hero title (your name) within 2 seconds.

**Behavior**:

Toggles `crt-mode` class on `<html>`. This activates authentic CRT emulation:

- **Warm phosphor filter**: Slight green tint and glow via CSS filter chain.
- **Scanlines + Aperture grille**: Horizontal scanlines combined with vertical aperture slots for a classic Trinitron look.
- **Vignette + Curvature**: Radial gradient darkens corners; elliptical mask creates screen curvature.
- **CRT bezel**: Inset box-shadow around the viewport.
- **Warm-up animation (2s)**: Gradual brightness ramp on activation (flyback transformer effect).
- **Flicker (6s period)**: Imperceptible brightness pulse every 6 seconds.
- **Jitter (4s period)**: Sub-pixel horizontal oscillation mimicking analog sync drift.
- **Phosphor glow**: `text-shadow: 0 0 10px #0f0` on headings.

**Files**: `src/bundle/controllers/konami.js` (56 lines), `styles/components/crt.css`

---

## 3. Orb Particle Burst — (Proposal)

**Status**: ⏳ PENDING — Not yet implemented.

**Trigger**: Click either gradient orb in the hero section.

**Behavior**:

Orb explodes into ~25 colored particles that scatter and fade out over 1.5s. Orb dims, then recharges after 1s.

**Effort**: Low (~25 lines JS).

---

## 4. 404 Runner Game (`_404()`)

**Status**: ✅ SHIPPED

**Canonical URL**: `game/404-runner-game.html`

**Summary**: A Chrome-dino-style side-scrolling runner built with the game boy layout (same shell as flappy-bird / pacman games). Player is a green `_` cursor jumping over HTTP error codes scrolling from the right.

### Triggers (from the main portfolio page)

| # | Trigger | How |
|---|---|---|
| A | **Broken URL** | Any 404 on the site → `404.html` → auto-redirect to game after 2.5s |
| B | **`?game=404` URL param** | `index.html?game=404` — linkable, bookmarkable |
| C | **`#404` hash fragment** | `index.html#404` — same-page navigation |
| D | **Type `exit`** | Sequence `e→x→i→t` anywhere on the portfolio page |
| E | **Idle 30s prompt** | `[404?]` floating link fades in bottom-right after 30s inactivity |
| F | **Console** | `window._404()` — DevTools console |

### Game mechanics

- **Canvas**: 380×200, dark terminal grid background, scrolling dashed ground line.
- **Player**: `_` cursor at x=60, green (`#7ee787`), jump with gravity physics.
- **Obstacles**: HTTP error codes `403`, `404`, `500`, `502`, `503` in red (`#ff7b72`) with bracket-styled bodies — scroll from right edge.
- **Score**: "lines compiled" ticks up every 3 frames.
- **Speed**: Accelerates at 0.005/frame from 2.5→5.5 max — tightens quickly.
- **Controls**: Space / ↑ / W / R, tap canvas, or the big round green **JUMP** button (mobile).
- **Game over**: Semi-transparent overlay with `STATUS: PAGE_NOT_FOUND` + final score. Press R or tap to retry.
- **Failure messages**: Random syntax error reasons based on the HTTP code hit (e.g. `"SYNTAX_ERROR: Unhandled status code 503 at 142px"`).

**Files**: `game/404-runner-game.html`, `src/404-runner-game.js` (217 lines), `styles/pages/404-runner-game.css` (71 lines), `src/bundle/controllers/404-trigger.js`

---

## 5. `:wq` Trap

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Type `:wq` anywhere on the portfolio page.

**Behavior**:

A Vim-style bottom bar slides up:
```
:E98: Cannot exit: buffer has unsaved changes. Use :q! to force.
```

Typing `:q!` triggers a 1-second fake "window shrink" animation — the page scales down to 10% and fades into a single dot, then snaps back with:
```
> Just kidding. You can't quit vim.
```

**Effort**: Very low (~15 lines JS + 5 lines CSS).

---

## 6. `sudo` Mode

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Type `sudo` anywhere on the page (as a standalone word or prefix).

**Behavior**:

- A fake sudo prompt flashes briefly: `[sudo] password for visitor:`
- After 2 seconds (no input needed), page enters **root mode** for 10s:
  - Breadcrumb `~/portfolio` → `/root/portfolio`
  - Footer `STATUS: OK` → `UID=0` in red
  - Accent colors shift from blue to crimson temporarily
  - Console: `> Privilege escalation successful. UID=0`
- Auto-reverts after 10s. Typing `exit` during root mode reverts immediately.

**Effort**: Low (~20 lines JS + 10 lines CSS).

---

## 7. Stack Trace Prank

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Triple-click the `STATUS: OK` text in the footer.

**Behavior**:

A full-screen dark overlay appears with a fake stack trace:
```
FATAL EXCEPTION: page.render()
  at Object.<anonymous> (portfolio.js:1:404)
  at __webpack_require__ (bootstrap:42:0)
  at module.exports (career.js:7:0)
  at HTMLDocument.<anonymous> (main.js:13:37)
  at EventEmitter.emit (events.js:404:7)

> Uncaught TypeError: Cannot read property 'portfolio' of undefined
```

After 2.5s, the overlay slides away with a green recovery line:
```
> Recovery successful. Just kidding 😉
```

The footer text briefly flips from `STATUS: OK` to `STATUS: PANICKED` during the effect.

**Effort**: Low (~25 lines JS, reuses overlay pattern from game pages).

---

## 8. Scroll-to-Bottom Compile Bar

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Scroll to the very bottom of the page (past all content).

**Behavior**:

A terminal-style progress bar pins to the bottom edge:
```
[████████░░░░░░░░░░░░]  37% — linking dependencies...
```

It fills to 100% over ~4 seconds with fake linker messages:
```
[████████████████░░░░]  74% — resolving symbols...
[████████████████████] 100% — page compiled successfully.
```

Then collapses into a green `> Page compiled. Have a nice day.` message for 2 seconds before disappearing. Plays once per session.

**Effort**: Low (~30 lines JS + 5 lines CSS).

---

## 9. Dynamic Build Number

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: None — passive, every page load.

**Behavior**:

The footer or breadcrumb shows a random hex build number each visit:
- `build #a3f2c1d` → `build #deadbeef` → `build #42cabba` etc.
- Always 6-7 valid hex characters from `Math.random().toString(16).slice(2, 9)`
- Adds ambient dev flavor with zero interaction needed.

**Effort**: Trivial (1 line of JS).

---

## 10. `curl` Command Copy

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Click the terminal tray text (`> curl ...`) at the bottom of any game page canvas, or the `STATUS: OK` bar on the main page.

**Behavior**:

Copies to clipboard:
```
curl -s https://junmystery.github.io | head -50
```

A tiny `📋 Copied` toast appears for 1.5 seconds.

**Effort**: Very low (~10 lines JS).

---

## 11. "This is fine" — Hidden Meme

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Hold Shift + double-click anywhere on the page background (not on links/buttons).

**Behavior**:

A small CSS-drawn scene fades in at the bottom-right corner: a simplified "This is fine" dog (round orange head, black ears, sitting in a red/orange flame room). Flames animate with CSS keyframes. Lasts 5 seconds, then fades out with scorched edges. Plays once per session.

**Effort**: Low-Medium (~40 lines CSS animation + 15 lines JS).

---

## 12. Hex Clock in Footer

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Hover over `STATUS: OK` or the right footer text.

**Behavior**:

Text temporarily shows the current time in hex:
- 10:00 → `TIME: 0xA00` (updates every second while hovered)
- Reverts to `STATUS: OK` on unhover.

**Effort**: Very low (~10 lines JS).

---

## 13. Theme Banter

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Toggle between dark and light mode.

**Behavior**:

Console logs a snarky message on each toggle:
- Dark → Light: `> Light mode activated. Hope you have sunglasses.`
- Light → Dark: `> Dark mode restored. Your eyes thank you.`
- 3rd+ toggle: `> Make up your mind!`
- 10th toggle: `> OK you win, I'll stop counting.`

**Effort**: Trivial (~5 lines in the existing theme controller).

---

## 14. 404 Game Cheat Codes

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Type during active gameplay on the 404 runner game page.

**Behavior**:

| Code | Effect |
|---|---|
| `IDDQD` | Obstacles turn green, pass through you (invincibility) — 15s |
| `IDKFA` | Speed instantly caps at 5.5 (max overclock) — 10s |
| `IDCLIP` | Player clips through next 3 obstacles automatically |

Each code prints a confirmation in the canvas bottom tray: `> CHEAT ENABLED: IDDQD`

**Effort**: Low (~20 lines in `src/404-runner-game.js`).

---

## 15. Triple-tap Dots → Matrix Rain

**Status**: 📝 PROPOSED — Not yet implemented.

**Trigger**: Triple-tap the red/yellow/green window dots in any game page header (or 404 page header).

**Behavior**:

The game canvas enters **rain mode** for 8 seconds:
- Obstacles still scroll but rendered in matrix green
- Player `_` rains katakana characters instead of jumping
- Reuses the matrix rain animation from easter egg #1

After 8s, everything smoothly returns to normal gameplay.

**Effort**: Low (~15 lines JS, reuses existing `startRain` code from egg #1).

---

## Changelog

| Date | Change |
|---|---|
| 2026-07-13 | Removed triple-tap hero title → 404 redirect trigger |
| 2026-07-13 | Updated 404 runner game to dedicated game boy layout page + JUMP button |
| 2026-07-13 | Implemented egg #4 (404 runner game) + egg #2 (CRT mode) + egg #1 (console glitch) |
