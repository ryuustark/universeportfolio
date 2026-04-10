---
tags:
  - project
  - architecture
---

# Portfolio Architecture

## File Structure

```
project/dev/
  index.html          ← Entry point
  css/styles.css      ← All styles
  js/
    data.js           ← Skill tree data model (pure data)
    svg-utils.js      ← SVG element helpers (createElementNS)
    layout.js         ← Dynamic constellation positioning
    tree-renderer.js  ← Constellation SVG rendering
    wheel.js          ← 3D skill wheel controller + state
    events.js         ← DOM event management
    main.js           ← App bootstrap
```

## Module Dependency Graph

```
main.js
  ├─ wheel.js (state + wheel navigation)
  │    └─ tree-renderer.js
  │         ├─ data.js
  │         ├─ svg-utils.js
  │         └─ layout.js
  └─ events.js
       └─ wheel.js
```

## Dynamic Constellation Algorithm

**File:** `js/layout.js`
**Function:** `computeLayout(nodes)`

1. Root placed at bottom-center `(300, 430)`
2. BFS from root, following parent→child edges
3. Each child placed near parent centroid using **seeded PRNG** (seed = hash of node id) — stable positions, organic look
4. Collision detection: if within `40px` of another node, rotate angle 30° until clear
5. Master node placed at top-center `(300, 50)`
6. Boundary clamping keeps all nodes within `[50, 550] × [50, 460]`

**Why seeded random?** Pure grid looks mechanical; pure random is disorienting on re-render. Seeded = organic + stable.

**Density-aware sizing:**
- 1–5 nodes: spacing 90px
- 6–10 nodes: spacing 70px
- 11–15 nodes: spacing 55px

## Key Patterns

- **ES Modules** (native browser support, no bundler)
- **SVG namespace** via `createElementNS` — [MDN: createElementNS](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS)
- **CSS custom properties** for theming (`--color-accent`, `--ease`)
- **3D CSS transforms** for skill wheel carousel — [MDN: transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- **State management**: module-scoped variables in `wheel.js` with exported getters/setters

## CI/CD

- **Trigger:** Push to `develop` branch
- **Pipeline:** `.github/workflows/deploy.yaml`
- **Deploy:** Copies `project/dev/` → `project/prod/` (directory sync)
- **Backup:** Timestamped backup created before each deploy
