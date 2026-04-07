# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Portfolio Website** — A single-file, Skyrim-themed portfolio showcasing professional skills through an interactive skill tree system with 7 categories (~63 skills/experiences total) visualized as SVG constellations.

**Tech Stack**: Pure vanilla HTML/CSS/JavaScript (no frameworks)
**File Size**: ~35KB (portfolio.html)
**Architecture**: Self-contained single file deployment

---

## Quick Start

**To View Locally:**
- Open `src/portfolio.html` in any modern browser

**To Edit:**
- Edit `src/portfolio.html` directly (all CSS and JS embedded)
- After changes, commit to `src/portfolio.html`
- CI/CD pipeline propagates to `prod/portfolio.html` on approval

**To Deploy:**
- Test Only: Push to `main` branch (auto-validates)
- Test + Deploy: Create `release/v*` branch and push, or manually trigger workflow with "test-and-deploy" mode

---

## Architecture

### Folder Structure (DevOps Compliant)

```
Webpage_presentation/
├── src/portfolio.html              ← Development source (main working file)
├── dev/portfolio.html              ← Local dev reference (optional symlink)
├── prod/portfolio.html             ← Production deployment (CI/CD-managed)
├── prod/backups/                   ← Timestamped backups (auto-created on deploy)
├── tests/                          ← Validation scripts
│   ├── validate-html.sh
│   ├── validate-css.js
│   └── validate-js.js
├── .github/workflows/
│   ├── jekyll-docker.yml           (Keep if needed for Jekyll builds)
│   └── portfolio-pipeline.yml      ← NEW: Two-mode CI/CD workflow
├── docs/
│   └── DEPLOYMENT.md               ← Runbook & rollback procedures
├── CLAUDE.md                       (This file)
└── README.md
```

### File Naming Convention

| Environment | Pattern | Example | Usage |
|---|---|---|---|
| **Development** | `dev/feature-name` branch | `dev/skill-wheel-animation` | Feature branches |
| **Feature Branches** | Any | `bugfix/constellation-links` | PRs and testing |
| **Release** | `release/v*` branch | `release/v1.1` | Pre-deployment branch (triggers auto-deploy) |
| **Production** | `portfolio.html` (in `prod/` folder) | `prod/portfolio.html` | Live file (never edit directly) |
| **Backups** | `portfolio-backup-YYMMDD_HHMMSS.html` | `portfolio-backup-20260407_143022.html` | Auto-created snapshots |
| **Deployment Tags** | `deployed-YYYYMMDD-HHMMSS` | `deployed-20260407-143022` | Git history of deployments |

---

## CI/CD Pipeline (DevOps Practices)

### Two-Mode Deployment System

**Mode A: Test Only** (Automatic)
- Triggers on: Push to `main`, `dev`, or any PR
- Validates: HTML structure, CSS syntax, JavaScript integrity
- Output: Pass/fail report in GitHub Actions
- Deployment: ❌ None (testing gate only)

**Mode B: Test + Deploy** (Manual Approval)
- Triggers on: Manual workflow dispatch or push to `release/*` branches
- Validates: All tests from Mode A
- Creates: Timestamped backup of current `prod/portfolio.html`
- Deploys: Copies `src/portfolio.html` → `prod/portfolio.html`
- After: Creates git deployment tag with timestamp
- Deployment: ✅ Live

### Branch Strategy

| Branch Pattern | Default Mode | Manual Override | Use Case |
|---|---|---|---|
| `main` | Test Only | Via workflow_dispatch | Stable, reviewed code |
| `dev` | Test Only | Via workflow_dispatch | Development baseline |
| `release/v*` | Auto-Deploy | N/A | Pre-production releases |
| `dev/feature-*` | Test Only | Via workflow_dispatch | Feature development |
| Feature PRs | Test Only | N/A | Quality gate before merge |

### Workflow Control Variables

The workflow file (`.github/workflows/portfolio-pipeline.yml`) uses:

```yaml
workflow_dispatch:
  inputs:
    deploy_mode:
      type: choice
      options:
        - test-only        ← Validates without deployment
        - test-and-deploy  ← Validates + copies to prod + creates backup
```

**Usage**:
1. Go to GitHub repo → Actions tab
2. Select "Portfolio CI/CD Pipeline"
3. Click "Run workflow" dropdown
4. Choose mode and branch
5. Click "Run workflow"

### Critical DevOps Patterns

**Immutable Backups**:
- Before each deploy, current `prod/portfolio.html` is copied to `prod/backups/portfolio-backup-{TIMESTAMP}.html`
- Backups are never overwritten (timestamp ensures uniqueness)
- CI/CD only reads from `src/`, writes to `prod/` and `backups/`

**Deployment Auditability**:
- Git deployment tags created on every successful deploy
- Deployment metadata logged (actor, timestamp, source, trigger type)
- Can trace every live version back through git history

**Safe Rollback Process**:
- Emergency: Manually copy any backup from `prod/backups/` to `prod/portfolio.html`
- Commit and push changes
- No manual edits to production needed (restore via CI/CD)

---

## Data Structure & Skill Tree System

### Core Data: `trees` Object

The portfolio stores all professional experience as a skill tree system:

```javascript
const trees = {
  "salesforce-core": {           // Tree ID (skill category)
    label: "Salesforce Core",
    level: 90,                   // Proficiency level (0-100)
    nodes: [
      {
        id: "sc-01",
        label: "Apex Development",
        x: 120, y: 50,          // SVG positioning (constellation)
        size: 40,               // Node star size
        master: true,           // Root/master skill
        unlocked: true,         // Skill available/completed
        desc: "6+ years across full Salesforce stack...",
        rank: "Senior",
        parents: []             // Prerequisites (connected nodes)
      },
      // ... 8 more nodes per tree
    ]
  },
  "integrations-automation": { /* ... */ },
  "devops-release-mgmt": { /* ... */ },
  "ui-frontend": { /* ... */ },
  "ai-dev-tools": { /* ... */ },
  "organization-agile": { /* ... */ },
  "creative-3d": { /* ... */ }
}
```

**Node Schema** (required fields):
- `id` — Unique identifier
- `label` — Skill/experience name
- `desc` — Full description (can include quantified impact)
- `x`, `y` — Pixel coordinates for SVG rendering
- `rank` — Proficiency level (e.g., "Senior", "Intermediate")
- `unlocked` — Boolean (affects visual styling)
- `parents` — Array of parent node IDs (for connection lines in SVG)
- `master` — Boolean (highlights as root skill)
- `size` — Star size in pixels (typically 30-50)

### How Constellations Render

1. **Wheel Selection**: User scrolls/clicks on skill category → triggers constellation panel
2. **SVG Generation**: JavaScript scans node coordinates and creates:
   - **Stars**: 5-pointed SVG stars at each node's x/y position
   - **Lines**: Red solid lines for unlocked connections, dashed for locked
3. **Interactivity**: Clicking nodes populates info panel with description and rank
4. **Animations**: CSS transitions (280ms cubic-bezier ease) for smooth state changes

**Example JS pattern**:
```javascript
// Get current tree
const curTree = trees[treeName];
// Generate SVG
const svg = createSvgConstellation(curTree.nodes);
// Render it
constellationPanel.innerHTML = '';
constellationPanel.appendChild(svg);
```

---

## Key Implementation Details

### Skill Wheel (3D Rotating Carousel)

**How It Works**:
- 7 skill categories rotate in 3D space using CSS `rotateY()` transform
- Scroll wheel on `.skill-wheel-wrap` rotates items with 650ms debounce
- Current item (index `wIdx`) is centered and highlighted
- Click wheels to select and open constellation panel

**CSS Pattern**:
```css
.wheel-rotor {
  transform: rotateY(calc(var(--angle) * 1deg));
  transition: transform 600ms ease;
}
```

**JS Pattern**:
```javascript
const wheelStep = 360 / skillCount;  // ~51.4° per item
wAngle = (wIdx * wheelStep) % 360;
wheelRotor.style.transform = `rotateY(${wAngle}deg)`;
```

### Responsive Design

**Desktop (> 768px)**:
- 2-column layout: Sidebar (220px fixed) + Main content
- Skill wheel: 140px height
- Constellation panel: Full-height flex container
- Info panel: Right sidebar (35% width)

**Mobile (≤ 768px)**:
- 1-column layout: Sidebar collapses to top bar
- Skill wheel: 110px height
- Panels stack vertically
- Text sizes reduce via `clamp()` function

**CSS Custom Properties for Theming**:
```css
:root {
  --color-bg: #2d2d3c;           /* Deep purple-gray */
  --color-accent: #cc0000;       /* Red (primary brand) */
  --color-text: #e8d8f0;         /* Light purple */
  --color-text-muted: #a080b0;   /* Muted purple */
  --font-display: "Cinzel Decorative", serif;
  --ease: 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

All colors and animations can be adjusted by changing CSS custom properties at root level.

---

## Development Workflow

### Before You Edit

1. **Branch**: Create feature branch from `dev` or `main`
   ```bash
   git checkout -b dev/your-feature-name
   ```
2. **Edit**: Modify only `src/portfolio.html`
3. **Test Locally**: Open `src/portfolio.html` in browser, verify interactivity

### To Deploy Changes

**For Testing (No Live Deploy)**:
```bash
git push origin dev/your-feature-name
# Creates PR → CI runs Mode A (test-only)
# GitHub Actions reports results in PR checks
```

**For Production Deploy**:
```bash
# Option A: Via release branch
git checkout -b release/v1.1
git push origin release/v1.1
# Auto-deploys after CI passes

# Option B: Manual trigger
# Go to GitHub → Actions → Portfolio CI/CD Pipeline
# Click "Run workflow" → Select "test-and-deploy"
```

### Emergency Rollback

```bash
# 1. Find backup file
ls prod/backups/

# 2. Copy correct backup back to prod
cp prod/backups/portfolio-backup-20260407_120000.html prod/portfolio.html

# 3. Commit and push (CI will validate before accepting)
git add prod/portfolio.html
git commit -m "Rollback to backup from 2026-04-07 12:00"
git push origin main
```

---

## UI Navigation Enhancement (Planned)

### Current State
- 1 Wheel (7 skill categories) → Constellation (9 nodes) → Info panel (node detail)

### Planned 3-Stage Navigation

**Flow**: Skill Category → Skill Type/Group → Project/Experience List

**Example**:
- Stage 1: Click "Visualforce" on wheel
- Stage 2: Choose area (e.g., "PDF Templates", "Custom Workflows", "E-Signature")
- Stage 3: See list of 3-5 projects with:
  - Quantified impact (e.g., "80% reduction in legacy tool dependency")
  - Timeline (date range)
  - Team size
  - Technologies used
  - Optional links to artifacts/demos

### Data Structure Addition Required

Each node needs:
```javascript
projects: [
  {
    title: "Multi-Country Insurance Policy Workflows",
    date: "2023-2024",
    team: "3 devs, 1 PM",
    impact: "Enabled sales in 12+ countries; 95% reduction in manual config",
    techs: ["Flow", "Apex", "SOQL"],
    link: "https://example.com/case-study"
  },
  // ... more projects per node
]
```

### Implementation Priority
1. Add `projects` array to node schema (all existing nodes)
2. Extend info panel to show project list toggle
3. Create project card component
4. Add smooth transitions between stages 2 and 3

---

## Customization Checklist

To personalize this portfolio:

1. **Profile Info** (sidebar header)
   - Update `<div class="profile-title">` text
   - Update `<div class="profile-subtitle">` text
   - Update contact links in `<div class="menu-contacts">`

2. **Skill Trees**
   - Modify `trees` object keys and labels
   - Update node coordinates (x, y) if changing constellation layout
   - Change `level` values (proficiency 0-100)

3. **Node Descriptions**
   - Edit `desc` field for quantified impact language
   - Add `projects` array for multi-stage navigation (future)

4. **Color Scheme**
   - Change CSS custom properties in `:root` block
   - Primary accent: `--color-accent: #cc0000`
   - Background: `--color-bg: #2d2d3c`

5. **Contact & Social Links**
   - Update `.contact-item` href attributes for email, LinkedIn, etc.

---

## Troubleshooting

**Constellation panel not appearing?**
- Check browser console for JS errors
- Verify `curTree` object has `nodes` array with valid x/y coordinates
- Ensure SVG namespace is correct: `createElementNS('http://www.w3.org/2000/svg', 'svg')`

**Wheel not rotating smoothly?**
- Check for conflicting CSS transforms
- Verify 650ms debounce isn't preventing scroll events
- Test in different browsers (Safari may need -webkit- prefixes)

**Mobile layout broken?**
- Confirm media query breakpoint: `@media (max-width: 768px)`
- Check sidebar computed width (should be 220px on desktop)
- Verify flex layout resetting on mobile

**CI/CD tests failing?**
- Check `.github/workflows/portfolio-pipeline.yml` for correct file paths
- Ensure `src/portfolio.html` exists and is valid
- Verify validation scripts in `/tests/` are executable

---

## Related Documentation

- **DEPLOYMENT.md** — Full CI/CD runbook, backup procedures, team roles
- **README.md** — Project overview and quick-start for new contributors
- **.github/workflows/portfolio-pipeline.yml** — Workflow logic and branch rules
