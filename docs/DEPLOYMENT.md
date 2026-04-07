# DEPLOYMENT.md

## Deployment Runbook & Best Practices

This document provides step-by-step procedures for deploying portfolio updates, team responsibilities, and emergency recovery processes.

---

## 1. STANDARD DEPLOYMENT FLOW

### For Test Only (Default)

**When**: Every push to `main`, `dev`, or any pull request
**Process**:
1. GitHub Actions automatically runs
2. Validates HTML structure
3. Validates CSS syntax
4. Validates JavaScript code
5. Reports results in PR checks or Actions tab
6. No live changes made

**Check Results**:
```
GitHub → Repository → Actions tab
→ Select "Portfolio CI/CD Pipeline" workflow
→ View job logs for pass/fail details
```

---

### For Production Deployment (Test + Deploy)

#### Option A: Using Release Branch (Recommended for Releases)

```bash
# Step 1: Create release branch
git checkout -b release/v1.1

# Step 2: Make any final changes needed
# (Usually none - just code review from main)
# If needed:
#   nano src/portfolio.html
#   git add src/portfolio.html
#   git commit -m "Final v1.1 release tweaks"

# Step 3: Push release branch
git push -u origin release/v1.1

# Step 4: GitHub Actions auto-runs with full test suite
# Wait 1-2 minutes for CI to complete

# Step 5: After CI passes, manually verify
# 1. Go to prod/portfolio.html in browser
# 2. Verify layout, colors, interactions
# 3. Check prod/backups/ has new backup file

# Step 6: Merge back to main
git checkout main
git pull origin main
git merge release/v1.1
git push origin main

# Step 7: Clean up release branch
git push origin --delete release/v1.1
git branch -d release/v1.1

# Step 8: Tag the stable version
git tag -a v1.1 -m "Release v1.1 - Enhanced skill navigation"
git push origin v1.1
```

#### Option B: Using Manual Workflow Trigger (For Hotfixes)

```bash
# Step 1: Commit changes directly to main or dev
git checkout main
# ... make critical fixes ...
git add src/portfolio.html
git commit -m "Hotfix: Fix constellation rendering bug"
git push origin main

# Step 2: Go to GitHub → Actions
# 1. Click "Portfolio CI/CD Pipeline"
# 2. Click "Run workflow" dropdown
# 3. Branch: main (or dev)
# 4. Mode: test-and-deploy
# 5. Click "Run workflow"

# Step 3: Wait for workflow to complete (~2 minutes)
# 4. GitHub Actions will:
#    - Run all validations
#    - Create timestamped backup
#    - Copy src/portfolio.html → prod/portfolio.html
#    - Create deployment tag

# Step 4: Verify deployment
# 1. Check prod/portfolio.html updated timestamp
# 2. Verify in browser
# 3. Check prod/backups/ has backup
```

---

## 2. BACKUP & RECOVERY

### Auto-Created Backups

Every deployment to production automatically creates a timestamped backup:

```
prod/backups/
├── portfolio-backup-20260407_143022.html
├── portfolio-backup-20260407_094500.html
└── portfolio-backup-20260406_182100.html
```

**Location**: `prod/backups/portfolio-backup-{YYYYMMDD}_{HHMMSS}.html`
**Automatic Rotation**: Backups are never deleted, but can be manually archived
**Restore Time**: < 5 minutes

### Manual Backup (Before Risky Changes)

```bash
# Create named backup
cp prod/portfolio.html prod/backups/portfolio-backup-prelaunch-v2.0.html

# Or use current timestamp
BACKUP_TIME=$(date +%Y%m%d_%H%M%S)
cp prod/portfolio.html prod/backups/portfolio-backup-manual-${BACKUP_TIME}.html
```

---

## 3. EMERGENCY ROLLBACK

**When to Use**: Production is broken, need immediate fix

### Quick Rollback (5 Minutes)

```bash
# Step 1: Identify the backup you want to restore
ls -la prod/backups/
# Find the backup with timestamp just before the bad deploy

# Step 2: Restore it
cp prod/backups/portfolio-backup-20260407_120000.html prod/portfolio.html

# Step 3: Verify in browser (refresh portfolio page)

# Step 4: Commit the rollback
git add prod/portfolio.html
git commit -m "Rollback: Restore version from 2026-04-07 12:00"
git push origin main

# Step 5: Investigate what went wrong
# 1. Check GitHub Actions logs
# 2. Review recent commits to src/portfolio.html
# 3. Check browser console for errors
# 4. Document issue in GitHub Issues
```

### Rollback via Git (If Backup Not Available)

```bash
# View deployment history
git log --oneline | grep "Rollback\|deployed-" | head -10

# Restore previous version from git
git checkout HEAD~1 src/portfolio.html
cp src/portfolio.html prod/portfolio.html

# Commit
git add prod/portfolio.html
git commit -m "Rollback: Restored from git history"
git push origin main
```

---

## 4. BACKUP RETENTION POLICY

### Recommended Retention

- **Keep**: Everyone backup forever (disk is cheap)
- **Archive**: Backups older than 1 year → separate archive folder
- **Document**: Major versions → move to `prod/backups/archive/`

### Annual Archive Process

```bash
# Create archive folder
mkdir -p prod/backups/archive

# Move old backups
find prod/backups -name "*.html" -mtime +365 -exec mv {} prod/backups/archive/ \;

# Git commit archive
git add prod/backups/archive/
git commit -m "Annual archive: Move backups older than 1 year"
git push origin main
```

---

## 5. DEPLOYMENT VALIDATION CHECKLIST

**Before Deploying to Production**

- [ ] Code reviewed and merged to `main` branch
- [ ] All GitHub Actions tests passed (green checkmarks)
- [ ] Changes tested locally in browser (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness verified (if UI changes)
- [ ] All links functional (if adding new contact info)
- [ ] Spell-check on descriptions and content
- [ ] No console errors in browser DevTools

**After Deploying to Production**

- [ ] `prod/portfolio.html` file size reasonable (< 50KB)
- [ ] Page loads in < 2 seconds
- [ ] Skill wheel rotates smoothly
- [ ] Constellation panels open/close correctly
- [ ] Info panel displays correct descriptions
- [ ] Contact links open correct URLs
- [ ] Responsive layout works on mobile
- [ ] Back up the deployment URL/timestamp in team notes

---

## 6. COMMON DEPLOYMENT SCENARIOS

### Scenario A: Regular Monthly Update (New Skills)

```bash
# Create feature branch
git checkout -b dev/skills-update-april2026

# Edit src/portfolio.html
# Add new nodes to trees object

# Test locally
open src/portfolio.html  # or just click it in file explorer

# Commit changes
git add src/portfolio.html
git commit -m "Add new Salesforce LWC skills"

# Push for testing
git push origin dev/skills-update-april2026

# Create PR, get reviews, merge to main
# Then deploy:
git checkout -b release/v1.2
git push origin release/v1.2
# Auto-deploys after tests pass
```

### Scenario B: Urgent Hotfix (Constellation Bug)

```bash
# Work directly on main
git checkout main
git pull origin main

# Fix the bug in src/portfolio.html
nano src/portfolio.html
# ... fix JavaScript bug ...

# Test locally
open src/portfolio.html

# Commit
git add src/portfolio.html
git commit -m "Fix constellation rendering on mobile Safari"

# Push
git push origin main

# Manually trigger deployment
# GitHub → Actions → Portfolio CI/CD Pipeline
# → Run workflow → Select "test-and-deploy"

# Verify in browser
# Check prod/backups/ has new backup
```

### Scenario C: Rollback After Bad Deploy

```bash
# Someone deployed a breaking change
# You notice prod is broken

# Step 1: Roll back immediately
ls -la prod/backups/
# Find the last good backup (check timestamp)

cp prod/backups/portfolio-backup-20260407_094500.html prod/portfolio.html

# Step 2: Verify it works
open prod/portfolio.html  # or refresh in browser

# Step 3: Document the rollback
git add prod/portfolio.html
git commit -m "Rollback: Revert breaking changes from v1.2 deploy"
git push origin main

# Step 4: Create GitHub Issue
# Title: "Investigate v1.2 deployment failure"
# Description: What broke, when rollback happened, root cause TBD

# Step 5: Contact the developer by Slack/email
# "Hey, rolled back v1.2, can you investigate the issue?"
```

---

## 7. DEPLOYMENT METRICS & MONITORING

### What to Track After Each Deploy

```markdown
## Deployment Log Entry

**Date**: 2026-04-07 14:30 UTC
**Version**: v1.1
**Deployed By**: daniel-cortes (GitHub username)
**Branch**: release/v1.1
**Changes**: Added 5 new Salesforce LWC skills, fixed constellation SVG rendering
**Validation Time**: 1m 23s
**Backup Created**: portfolio-backup-20260407_143022.html
**Live URL**: https://example.com/portfolio.html (if applicable)
**Browsers Tested**: Chrome 130, Firefox 129, Safari 18
**Issues Reported**: None
**Rollback Plan**: Use portfolio-backup-20260407_134500.html if needed
```

### Health Check Post-Deployment

```bash
# Automated health check script (create as tests/health-check.sh)
#!/bin/bash

echo "Portfolio Health Check"
echo "===================="

# 1. File size check
FILE_SIZE=$(stat -f%z "prod/portfolio.html" 2>/dev/null || stat -c%s "prod/portfolio.html" 2>/dev/null)
echo "✓ File size: ${FILE_SIZE} bytes (should be 30-50KB)"

# 2. HTML validation
echo "✓ HTML structure validated by CI/CD"

# 3. Backup created
BACKUP_COUNT=$(ls prod/backups/ | wc -l)
echo "✓ Backups on file: ${BACKUP_COUNT}"

# 4. Git log
echo "✓ Latest deployment tags:"
git log --oneline --grep="deployed-" | head -3

echo "===================="
echo "Health check complete"
```

---

## 8. TEAM RESPONSIBILITIES

### Portfolio Owner (Main Deployment Decision Maker)
- Reviews changes before production deploy
- Approves release branches
- Owns deployment timing decisions
- First contact for rollback decisions

### Developer (Code Changes)
- Edits `src/portfolio.html` only
- Tests changes locally before pushing
- Branches from `main` or `dev`
- Requests review before merge to `main`

### CI/CD Operator (Deploy Management)
- Monitors GitHub Actions
- Triggers "test-and-deploy" mode when approved
- Verifies deployment succeeded
- Handles emergency rollbacks

### All Team Members
- Report bugs in #general Slack channel
- Document deployment issues in GitHub Issues
- Keep this runbook updated
- Never manually edit `prod/portfolio.html` (let CI/CD manage it)

---

## 9. TROUBLESHOOTING DEPLOYMENTS

### Deployment Failed During Validation

**Symptom**: GitHub Actions workflow fails with validation error
**Solution**:
```bash
# 1. Check the error message in Actions logs
# 2. Find the problematic line in src/portfolio.html
# 3. Fix it locally
git checkout dev
nano src/portfolio.html
# 4. Test validation locally
npm run validate  # if you set this up in package.json
# 5. Commit and push
git add src/portfolio.html
git commit -m "Fix validation error in skill nodes"
git push origin dev
```

### Deployment Succeeded but Prod Upload Failed

**Symptom**: Tests pass, but `prod/portfolio.html` timestamp doesn't change
**Solution**:
```bash
# 1. Check GitHub Actions logs for error details
# 2. Manual deployment:
cp src/portfolio.html prod/portfolio.html
git add prod/portfolio.html
git commit -m "Manual deploy: Fix failed automated deployment"
git push origin main
# 3. Investigate why automation failed in GitHub Actions settings
```

### Backup Not Created Before Deploy

**Symptom**: Rolled back, but can't find backup from error time
**Solution**:
```bash
# 1. Check if backup exists
ls prod/backups/

# 2. If not, check git history
git log --all --source --full-history -- prod/portfolio.html

# 3. Restore from git if needed
git show HEAD~1:prod/portfolio.html > prod/portfolio.html

# 4. Add a step to workflow to verify backup creation
# (Contact DevOps team to investigate)
```

---

## 10. DEPLOYMENT SCHEDULE (Optional)

If your team prefers scheduled deployments:

```
Monday 10:00 AM UTC   - Weekly review & test
Tuesday 2:00 PM UTC   - Production deploy window
Friday 3:00 PM UTC    - Hotfix window (if needed)
```

**Communication**:
1. Announce deployment in Slack 24h before
2. Notify on Slack when deployment starts
3. Confirm successful deployment with screenshot
4. Send post-deployment summary

---

## 11. DISASTER RECOVERY

### Scenario: File Corruption or Major Issue

**Step 1: Immediate Actions (< 5 min)**
```bash
# Restore to last known good
cp prod/backups/portfolio-backup-20260407_094500.html prod/portfolio.html
git add prod/portfolio.html
git commit -m "Emergency rollback: File corruption recovery"
git push origin main
```

**Step 2: Investigation (Next 30 min)**
- Check what caused corruption
- Review recent commits
- Check browser console errors
- Notify team via Slack

**Step 3: Documentation**
- Create GitHub Issue with "disaster-recovery" label
- Document root cause
- Implement prevention (if automation failed)

---

## Quick Reference Card (Print or Save)

```
DEPLOYMENT COMMANDS
═════════════════════════════════════════

Test Only (Automatic):
  git push origin main
  → GitHub Actions auto-runs tests

Deploy to Production:
  git checkout -b release/v1.1
  git push origin release/v1.1
  → Auto-deploys after passing tests

Manual Deploy:
  → GitHub Actions → Run workflow
  → Select "test-and-deploy" mode

Quick Rollback:
  cp prod/backups/portfolio-backup-TIMESTAMP.html prod/portfolio.html
  git add prod/portfolio.html
  git commit -m "Rollback deployment"
  git push origin main

Check Backups:
  ls -la prod/backups/

View Deployment History:
  git log --oneline | grep deployed-
```

---

**Last Updated**: 2026-04-07
**Maintained By**: Daniel Cortés (Portfolio Owner)
