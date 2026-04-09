#!/usr/bin/env python3
"""
Local deployment script for portfolio
Usage: python deploy.py [--deploy]
"""

import shutil
import subprocess
from pathlib import Path
from datetime import datetime
import argparse
import sys

def deploy(dry_run=False):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    dev_file = Path("project/dev/dev_portfolio.html")
    prod_file = Path("project/prod/portfolio.html")
    backup_dir = Path("project/prod/backups")
    backup_file = backup_dir / f"portfolio-backup-{timestamp}.html"

    # Verify dev file exists
    if not dev_file.exists():
        print(f"❌ Dev file not found: {dev_file}")
        return False

    # Create backup directory
    backup_dir.mkdir(parents=True, exist_ok=True)

    # Create backup of current prod
    if prod_file.exists():
        shutil.copy2(prod_file, backup_file)
        print(f"📦 Backup created: {backup_file}")
    else:
        print(f"⚠️  No existing prod file to backup")

    # Deploy
    shutil.copy2(dev_file, prod_file)
    print(f"✅ Deployment complete: {dev_file} → {prod_file}")

    if dry_run:
        print("🔍 DRY RUN - skipping git operations")
        return True

    # Git operations
    try:
        subprocess.run(["git", "config", "--local", "user.email", "deploy@local"], check=True, capture_output=True)
        subprocess.run(["git", "config", "--local", "user.name", "Local Deploy"], check=True, capture_output=True)
        subprocess.run(["git", "add", str(prod_file)], check=True, capture_output=True)
        subprocess.run(["git", "commit", "-m", "Deploy: update prod portfolio from dev [skip ci]"], capture_output=True)
        subprocess.run(["git", "push"], check=True, capture_output=True)

        tag_name = f"deployed-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        subprocess.run(["git", "tag", tag_name], check=True, capture_output=True)
        subprocess.run(["git", "push", "origin", "--tags"], check=True, capture_output=True)

        print("✅ Git deployment tagged and pushed")
        return True

    except subprocess.CalledProcessError as e:
        print(f"❌ Git operation failed: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deploy portfolio from dev to prod")
    parser.add_argument("--deploy", action="store_true", help="Execute deployment (default is dry-run)")
    parser.add_argument("--dry-run", action="store_true", help="Perform deployment but skip git push")

    args = parser.parse_args()

    success = deploy(dry_run=args.dry_run or not args.deploy)
    sys.exit(0 if success else 1)
