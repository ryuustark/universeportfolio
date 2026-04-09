# Portfolio Development Guide

## Quick Start

**Edit**: `project/dev/dev_portfolio.html` (all HTML/CSS/JS in one file)  
**Test**: Open in browser or use `/preview-start` for dev server  
**Deploy**: Push to `develop` → GitHub Actions validates and deploys to `project/prod/portfolio.html`

---

## Development Workflow

1. **Edit** `project/dev/dev_portfolio.html`
2. **Test** locally (browser or `/preview-start`)
3. **Commit & Push**:
   ```bash
   git add project/dev/dev_portfolio.html
   git commit -m "Brief description of change"
   git push origin develop
   ```
4. **Deployment**: GitHub Actions auto-validates. On success, `develop` deploys to production.

---

## File Structure

```
project/
├── dev/dev_portfolio.html      ← Active development (edit this)
└── prod/portfolio.html         ← Live production (auto-updated by CI/CD)
.github/workflows/
└── deploy.yaml                 ← CI/CD pipeline (test + auto-deploy on develop push)
```

---

## Code Style

- **Pure vanilla**: No frameworks. HTML/CSS/JS all embedded in single file.
- **Data structure**: `trees` object holds skill categories + nodes (id, label, x, y, desc, parents, unlocked)
- **SVG constellations**: Dynamically generated from node coordinates. Connections = red lines between parent/child skills.
- **Responsiveness**: CSS custom properties (`--color-*`, `--ease`) for theming. Mobile breakpoint: 768px.
- **Comments**: Add references to MDN or docs when using non-obvious methods (e.g., `createElementNS()`, `cubic-bezier()`)

---

## Key Techniques in This Project

- **3D Wheel**: CSS `rotateY()` + scroll debounce (650ms)
- **SVG Rendering**: `createElementNS('http://www.w3.org/2000/svg', 'svg')` for dynamic stars + lines
- **Responsive Units**: `clamp()` for fluid scaling; `%` and `rem` for layouts
- **State Management**: Plain JS objects. No external state library.

Reference docs when adding complexity:
- [MDN: SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [MDN: CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

---

## CI/CD Pipeline

**Trigger**: Push to `develop` branch  
**Actions**: Validate HTML/CSS/JS → Copy `dev_portfolio.html` to `prod/portfolio.html` → Create timestamped backup  
**Rollback**: Restore from `project/prod/backups/` if needed

See `.github/workflows/deploy.yaml` for full workflow details.

---

## When You're Stuck

- **Code behavior**: Read inline comments and check the `trees` data structure
- **Styling**: Check CSS custom properties in `:root` block
- **Browser issues**: Use `/preview-start` to test in Claude's dev environment
- **Best practices**: Use `/code-review` to understand what "clean code" looks like
