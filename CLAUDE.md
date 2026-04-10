# Portfolio Development Guide

## Quick Start

**Edit**: Files in `project/dev/` (modular ES modules)
**Test**: Use `/preview-start` for dev server (ES modules require HTTP, not file://)
**Deploy**: Push to `develop` → GitHub Actions deploys `project/dev/` → `/docs/` → GitHub Pages at https://ryuustark.github.io/universeportfolio/

---

## File Structure

```
project/dev/
├── index.html               ← HTML shell (entry point)
├── css/styles.css           ← All styles
├── js/
│   ├── data.js              ← Skill tree data model (pure data, no coords)
│   ├── svg-utils.js         ← SVG createElementNS helpers
│   ├── layout.js            ← Dynamic constellation positioning algorithm
│   ├── tree-renderer.js     ← Renders constellation SVG + info panel
│   ├── wheel.js             ← 3D skill wheel controller + state
│   ├── events.js            ← DOM event wiring
│   └── main.js              ← App bootstrap (entry)
docs/                        ← GitHub Pages deployment (auto-synced from project/dev/ by CI/CD)
├── index.html
├── css/
└── js/
.github/workflows/deploy.yaml
Documentation/skill_tree_daniel.mmd ← Mermaid constellation overview
Obsidian/                    ← Project memory vault (templates, skill trees, logs)
```

---

## Development Workflow

1. **Edit** files in `project/dev/`
2. **Test** with `/preview-start` — ES modules need HTTP
3. **Commit & Push** to `develop` branch:
   ```bash
   git add project/dev/
   git commit -m "Brief description"
   git push origin develop
   ```
4. **Automatic Deployment**: GitHub Actions copies `project/dev/` → `/docs/` → GitHub Pages publishes at https://ryuustark.github.io/universeportfolio/

---

## Module Responsibilities (OOP mapping)

| File | "Class" | Responsibility |
|------|---------|----------------|
| `data.js` | Model | Pure data — `trees` + `WHEEL_ITEMS`. No coordinates. |
| `svg-utils.js` | Utility | Static SVG element helpers (`svgEl`, `starPts`) |
| `layout.js` | LayoutEngine | Computes node positions dynamically (seeded radial growth) |
| `tree-renderer.js` | TreeRenderer | Renders constellation SVG + info panel |
| `wheel.js` | WheelController | 3D wheel state + navigation |
| `events.js` | EventManager | Wires up DOM event listeners |
| `main.js` | App | Bootstrap — imports + init calls |

**State** lives in `wheel.js` as module-scoped variables with exported getters.

---

## Dynamic Constellation (`layout.js`)

Nodes have NO hardcoded x/y — positions computed on every render by `computeLayout(nodes)`:

1. Root node → bottom-center
2. BFS places each child near parent centroid
3. Seeded PRNG (hash of node id) → stable + organic positions
4. Collision detection (min distance 36–50px based on density)
5. Master node → top-center
6. Density-aware spacing: 1–5 nodes → 90px, 6–10 → 70px, 11–15 → 55px
7. Supports 1–15 nodes per tree

**To add a skill:** Add a new entry to `trees.<category>.nodes` in `data.js` with `id`, `label`, `size`, `unlocked`, `desc`, `rank`, `parents[]`. The constellation re-layouts automatically.

---

## Code Style

- **ES Modules**: `import`/`export` — no bundler, native browser support
- **Pure vanilla**: No frameworks, no npm dependencies
- **SVG**: `createElementNS("http://www.w3.org/2000/svg", ...)` — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS)
- **3D Wheel**: CSS `rotateY()` + `translateZ()`, scroll debounce 650ms
- **Responsive**: CSS custom properties (`--color-*`, `--ease`). Mobile breakpoint: 768px.
- **Comments**: Reference MDN docs for non-obvious techniques

Reference docs:
- [MDN: SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [MDN: CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [MDN: ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

---

## CI/CD Pipeline

**Trigger**: Push to `develop` branch
**Actions**: 
- Copy `project/dev/` (index.html + css/ + js/) → `/docs/`
- Commit changes to `/docs/`
- GitHub Pages automatically publishes from `/docs/`

**Live at**: https://ryuustark.github.io/universeportfolio/

**Rollback**: Revert the commit that touched `/docs/` — GitHub Pages redeploys from previous commit.

See `.github/workflows/deploy.yaml` for workflow details.

---

## Obsidian Vault (`Obsidian/`)

Project memory and skill tree documentation. Free-tier Obsidian only:
- `Templates/` — Skill Node + Dev Log templates
- `Skill Trees/<Category>/` — one folder per wheel category; `_<Title>.md` is the overview
- `Project/Roadmap.md`, `Project/Architecture.md` — planning docs
- `Dev Logs/` — daily notes

See `Obsidian/README.md` for conventions.

---

## When You're Stuck

- **Code behavior**: Read module JSDoc headers
- **Styling**: Check CSS custom properties in `:root` block of `css/styles.css`
- **Browser issues**: Use `/preview-start` — ES modules won't load from `file://`
- **Layout weirdness**: Seeded PRNG is deterministic; if positions look wrong, check `layout.js` collision logic
