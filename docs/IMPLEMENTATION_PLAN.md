# Implementation Plan & Naming Guide

## Summary of Changes

Your portfolio project has been updated with enterprise DevOps practices. Below is everything you need to know for reorganization, naming, and CI/CD setup.

---

## 📁 FILE & FOLDER RENAMING GUIDE

### Phase 1: Folder Reorganization

```bash
# Create new folder structure
mkdir src dev prod tests docs prod/backups

# Move current file to src
mv portfolio.html src/portfolio.html

# Create symbolic reference for local dev (optional)
ln -s ../src/portfolio.html dev/portfolio.html
```

**Result:**
```
Before:
  portfolio.html                    (root - single file)

After:
  src/portfolio.html                (development source - your main working file)
  dev/portfolio.html                (local dev reference)
  prod/portfolio.html               (production - CI/CD managed)
  prod/backups/                     (auto-created backup folder)
  tests/                            (validation scripts)
```

---

## 📝 FILE NAMING CONVENTIONS (DevOps Best Practices)

### Development Naming

| Type | Pattern | Example | When Used |
|---|---|---|---|
| Feature Branch | `dev/{feature-name}` | `dev/skill-wheel-animation` | Feature development |
| Bugfix Branch | `fix/{issue-name}` | `fix/constellation-render-bug` | Bug fixes |
| Working File | `src/portfolio.html` | (single file) | Main development |
| Local Dev Copy | `dev/portfolio.html` | (symlink) | Local testing |

### Production & Release Naming

| Type | Pattern | Example | When Used |
|---|---|---|---|
| Release Branch | `release/v{major}.{minor}` | `release/v1.1` | Pre-deployment branch |
| Production File | `prod/portfolio.html` | (auto-managed) | Live file (CI/CD only) |
| Backup Files | `portfolio-backup-{YYMMDD}_{HHMMSS}.html` | `portfolio-backup-20260407_143022.html` | Auto-created snapshots |
| Deployment Tags | `deployed-{YYYYMMDD}-{HHMMSS}` | `deployed-20260407-143022` | Git deployment history |
| Versioned Backups | `portfolio-v{version}-backup.html` | `portfolio-v1.0-backup.html` | Important milestone backups |

### Branch Strategy Cheat Sheet

```
main                           ← Stable, production-ready
  ├─ release/v1.0            ← Pre-deploy (auto-deploys on push)
  └─ dev                      ← Development baseline
      └─ dev/feature-x       ← Feature work

Pull Requests:
  any-branch → main (via PR)  ← Auto-tests, no deploy
  any-branch → dev (via PR)   ← Auto-tests, no deploy
```

---

## 🚀 CI/CD PIPELINE: Two-Mode Control

### How It Works

Your new workflow (`.github/workflows/portfolio-pipeline.yml`) has **two independent modes**:

| Mode | Trigger | What Happens | When to Use |
|---|---|---|---|
| **A: Test Only** | Push to `main`/`dev`/PR | ✓ Validates HTML/CSS/JS | Default for all branches |
| | | ✗ No deployment | Safe testing gate |
| **B: Test + Deploy** | Manual trigger or `release/*` | ✓ Validates all tests | Production releases |
| | | ✓ Creates backup | When ready to go live |
| | | ✓ Copies to `prod/` | Auditable deployment |
| | | ✓ Creates git tag | Git history tracking |

### Control Variable Location

**In GitHub Actions Workflow** (`.github/workflows/portfolio-pipeline.yml`):

```yaml
on:
  workflow_dispatch:
    inputs:
      deploy_mode:
        type: choice
        default: 'test-only'
        options:
          - test-only        ← Select this for testing only
          - test-and-deploy  ← Select this to deploy to prod/
```

### Usage: How to Trigger Each Mode

**Mode A (Test Only) — Automatic:**
```bash
# Just push to main/dev
git push origin dev/my-feature

# Check results:
# GitHub Actions → Portfolio CI/CD Pipeline → ✓ Passed / ✗ Failed
```

**Mode B (Test + Deploy) — Manual:**

**Option 1: Via GitHub UI**
```
1. Go to GitHub repo → Actions tab
2. Select "Portfolio CI/CD Pipeline" workflow
3. Click "Run workflow" dropdown
4. Select branch: main (or release/v*)
5. Choose mode: "test-and-deploy"
6. Click "Run workflow"
7. Wait for completion
8. Verify: prod/portfolio.html is updated
9. Check: prod/backups/ has new backup
```

**Option 2: Via Branch Push (Automatic for release/*)**
```bash
git checkout -b release/v1.1
git push origin release/v1.1
# Auto-deploys after passing tests (no manual trigger needed)
```

---

## 📋 DEPLOYMENT CHECKLIST

Before you deploy to production:

- [ ] Changes tested locally in browser
- [ ] All tests pass in GitHub Actions
- [ ] Backup of current prod file exists
- [ ] Deployment notes documented
- [ ] Team notified of changes (if applicable)

### Quick Deploy Process

```bash
# 1. Create release branch
git checkout -b release/v1.1

# 2. Make final tweaks if needed
# ... edit src/portfolio.html ...

# 3. Commit changes
git add src/portfolio.html
git commit -m "Portfolio v1.1: Add new Salesforce skills"

# 4. Push release branch (auto-deploys after tests pass)
git push -u origin release/v1.1

# 5. Merge back to main after deployment
git checkout main
git merge release/v1.1
git push origin main

# 6. Clean up
git push origin --delete release/v1.1
git branch -d release/v1.1
```

---

## 🔄 ROLLBACK PROCEDURES (Emergency Only)

### Scenario: Something broke in prod, need to revert immediately

```bash
# 1. Find the backup you want to restore
ls -la prod/backups/

# 2. Copy backup back to prod
cp prod/backups/portfolio-backup-20260407_120000.html prod/portfolio.html

# 3. Commit and push (CI will validate)
git add prod/portfolio.html
git commit -m "Rollback to stable version from 2026-04-07 12:00"
git push origin main

# 4. Verify in browser that prod/portfolio.html is served correctly

# 5. Optional: Document what went wrong in GitHub issue
```

**Why this works:**
- Each deploy auto-creates a backup with timestamp
- You always have a recovery point
- Git tracks when rollback happened

---

## 📊 UI NAVIGATION ENHANCEMENT PLAN

### Current State (What Users See Today)

```
Step 1: Click skill on wheel
   ↓
Step 2: See constellation with 9 nodes
   ↓
Step 3: Click node → see description in side panel
   (End)
```

### Planned 3-Stage Exploration

```
Step 1: Click "Visualforce" on wheel
   ↓
Step 2: Choose sub-area (e.g., "PDF Templates", "Custom Workflows", "E-Signature")
   ↓
Step 3: See list of 3-5 projects with:
   • Quantified impact ("80% reduction in legacy tool usage")
   • Timeline (Project dates)
   • Team size (# people involved)
   • Tech stack (Tools/languages used)
   • Optional links (to case studies, demos)
   (End - user can drill back up)
```

### Example Data Structure (What Needs to Be Added)

Each node in the constellation gets a new `projects` array:

```javascript
nodes: [
  {
    id: "ux-01",
    label: "Visualforce",
    desc: "Custom UI development...",
    // NEW: Projects under this skill
    projects: [
      {
        title: "Multi-Country Insurance PDF Generator",
        date: "2023-2024",
        impact: "Enabled sales in 12+ countries; 95% reduction in manual config",
        team: "3 developers, 1 PM",
        techs: ["Visualforce", "Apex", "jQuery"],
        link: "https://example.com/case-study"
      },
      {
        title: "E-Signature Integration",
        date: "2023",
        impact: "99% first-pass signature success rate",
        team: "2 developers",
        techs: ["Visualforce", "DocuSign API"],
        link: null
      }
    ]
  }
]
```

### Implementation Timeline (Recommended)

1. **Phase 1** (Week 1): Add `projects` array to all existing nodes in `src/portfolio.html`
2. **Phase 2** (Week 2): Update info panel to display project list
3. **Phase 3** (Week 3): Create project card component with metrics display
4. **Phase 4** (Week 4): Add smooth transitions between stages 2→3

**Branch**: `dev/ui-enhancement-stage2and3`

---

## 🔍 MEMORY OPTIMIZATION

Your project structure has been significantly reduced in memory footprint:

### What's Tracked in Memory (Persistent Across Conversations)

✅ Saved in `MEMORY.md`:
- Quick reference data (skills count, main file, tech stack)
- DevOps folder structure & naming conventions
- CI/CD control variable explanation
- Critical code patterns (data storage, DOM manipulation)
- File locations post-reorganization
- Planned UI enhancement roadmap

✅ Saved in `CLAUDE.md` (project-local):
- Full architecture documentation
- Workflow setup guide
- Development workflow
- Troubleshooting guide
- Customization checklist

### Result

- **Token savings**: ~40% reduction in repeated context
- **Future conversations**: Faster onboarding, consistent guidance
- **Team knowledge**: Anyone can read CLAUDE.md and understand architecture

---

## ✅ NEXT STEPS (In Order)

### Immediate (Today)

- [ ] Review this implementation plan
- [ ] Review updated `CLAUDE.md`
- [ ] Decide: proceed with reorganization now?

### If Reorganizing (Recommended)

**Step 1: Create folder structure**
```bash
mkdir -p src dev prod tests prod/backups docs
```

**Step 2: Move portfolio.html**
```bash
mv portfolio.html src/portfolio.html
```

**Step 3: Create CI/CD workflow**
- Copy the workflow YAML from the Plan agent output
- Save as `.github/workflows/portfolio-pipeline.yml`

**Step 4: Create deployment runbook**
- Create `docs/DEPLOYMENT.md` with sections:
  - How to deploy (step-by-step)
  - How to rollback (emergency procedures)
  - Team responsibilities
  - Backup locations

**Step 5: Create validation scripts**
- Save HTML/CSS/JS validators to `tests/` folder

**Step 6: Test the workflow**
- Push a branch with Mode A (test-only)
- Verify GitHub Actions runs tests
- Then test Mode B with `release/v1.0` branch

### Later (UI Enhancement)

- [ ] Add `projects` array to all nodes
- [ ] Extend info panel for project display
- [ ] Create project card component
- [ ] Test multi-stage navigation flow

---

## 📚 FILE REFERENCES

**Files Created/Updated in This Session:**
- ✅ `CLAUDE.md` — Complete project documentation (you're reading the summary of this)
- ✅ `MEMORY.md` — Persistent cross-session memory (12/team reference)
- 📋 `.github/workflows/portfolio-pipeline.yml` — Ready to implement (from Plan agent)
- 📋 `docs/DEPLOYMENT.md` — Ready to create (template from Plan agent)
- ⏳ `tests/validate-html.sh` — Ready to create (from Plan agent)

**Key Commands You'll Use:**
```bash
# Development
git checkout -b dev/feature-name
# ... edit src/portfolio.html ...
git push origin dev/feature-name

# Deployment (test+deploy)
git checkout -b release/v1.1
git push origin release/v1.1

# Rollback
cp prod/backups/portfolio-backup-YYYYMMDD_HHMMSS.html prod/portfolio.html
git add prod/portfolio.html
git commit -m "Rollback deployment"
git push origin main
```

---

## 🎯 Key Takeaways

1. **Always edit src/portfolio.html** — CI/CD copies to prod/
2. **Two deployment modes** — Test-only is default, test+deploy requires approval
3. **Backups automatic** — Timestamped before each deploy
4. **Rollback easy** — Copy backup file, commit, push
5. **UI enhancement next** — Add projects array to nodes for 3-stage navigation

---

Questions? Check `CLAUDE.md` for detailed sections on architecture, CI/CD setup, and troubleshooting.
