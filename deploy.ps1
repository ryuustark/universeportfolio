# PowerShell deployment script for Windows
param(
    [switch]$Deploy = $false
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$devFile = "project/dev/dev_portfolio.html"
$prodFile = "project/prod/portfolio.html"
$backupDir = "project/prod/backups"
$backupFile = "$backupDir/portfolio-backup-$timestamp.html"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "📁 Created backup directory: $backupDir"
}

# Verify dev file exists
if (-not (Test-Path $devFile)) {
    Write-Error "❌ Dev file not found: $devFile"
    exit 1
}

# Create backup of current prod
if (Test-Path $prodFile) {
    Copy-Item -Path $prodFile -Destination $backupFile
    Write-Host "📦 Backup created: $backupFile"
} else {
    Write-Host "⚠️  No existing prod file to backup"
}

# Deploy
Copy-Item -Path $devFile -Destination $prodFile -Force
Write-Host "✅ Deployment complete: $devFile → $prodFile"

# Git operations
git config --local user.email "deploy@local"
git config --local user.name "Local Deploy"
git add $prodFile
git commit -m "Deploy: update prod portfolio from dev [skip ci]" | Out-Null
git push
git tag "deployed-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git push origin --tags

Write-Host "✅ Git deployment tagged and pushed"
