<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->

<!-- headroom:8-core-rules -->
# 8 Core Development Rules — Strict Enforcement

**Checklist format.** Before every tool call or code change, verify each rule. If any fails, STOP and fix.

- [ ] **0. Agent-Guidance-MCP First** — Call `guidance(operation="search", query="<task>")` BEFORE any other tool. This is the mandatory first call on every turn \u2014 before `task_pipeline`, before `project_context`, before file reads, before anything. The result surfaces standards, skills, and the **Plan \u2192 Deploy** workflow for multi-file tasks (2+ files/modules/locales). Follow what it returns.
- [ ] **1. Context First** — Call `task_pipeline` or `project_context(operation="tree"|"search")` BEFORE any file read or edit.
- [ ] **2. Standards Check** — Call `guidance(operation="search", query="<task>")` BEFORE implementing features or answering design queries. The search result will surface the **Plan \u2192 Deploy** workflow for multi-file tasks (2+ files/modules/locales). If it does, follow that sequence \u2014 do NOT skip to direct editing.
- [ ] **3. Token Budget** — Prefer `project_context read`/`search` over raw `read`/`grep`. Max 300 lines per read.
- [ ] **4. No Direct FS** — Never use `bash`/`glob`/`grep` for file listing or content search if `project_context` can do it.
- [ ] **5. Ground & Plan** — Verify every file path, function name, and symbol via search BEFORE writing code. Never assume.
- [ ] **6. 300 LOC Cap** — If a file exceeds 300 lines, split immediately before making any other changes.
- [ ] **7. DRY & Reusability** — Search existing code for a match before creating new CSS classes, components, or configs. Reuse or extend.
- [ ] **8. Surgical Changes** — Edit only lines the request requires. No adjacent refactoring, reformatting, or cleanup beyond your own orphans.

## Violation Protocol

If any checklist item fails mid-action:
1. **STOP** the current operation.
2. Fix the violation (e.g., run `task_pipeline`, split the file, remove duplication).
3. Only then resume the original task.

## Project-Specific Rules

### Build
- **`src/bundle.js` is a generated artifact** — DO NOT edit directly. Edit source modules in `src/bundle/` then rebuild:
  ```
  powershell.exe -ExecutionPolicy Bypass -File src/bundle/build.ps1
  ```
- **Source modules** (all <300 lines): `src/bundle/locales-en.js`, `locales-vi.js`, `utils.js`, `models.js`, `i18n-service.js`, `controllers/*.js`, `main.js`
- **Concatenation order** (strict dependency): locales → utils → models → i18n-service → controllers → main

### Offline-First
- All paths must be relative (`index.html`, not `/index.html`; `src/bundle.js`, not `/src/bundle.js`)
- No CDN dependencies. Font Awesome uses local CSS at `styles/vendor/fontawesome.css`
- Works from `file://` protocol without a server
- Uses ES5 globals (`var`, `function`) — no `import`/`export` in the bundle

### i18n System
- Locale data uses **flat dotted keys** (e.g., `"nav.about": "About"`), not nested objects
- `i18n.t(key)` does **direct flat lookup**: `this.locale[key]`, not `key.split('.').reduce(...)`
- Elements with HTML content use `data-i18n-html` (not `data-i18n`) to preserve inner elements
<!-- /headroom:8-core-rules -->
