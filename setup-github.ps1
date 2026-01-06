# GitHub Setup Script for Sunshine Realtors Website
# Run this script after creating your GitHub repository

Write-Host ""
Write-Host "GitHub Setup Script" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# Get repository URL from user
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/sunshine-realtors-website.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host ""
    Write-Host "ERROR: Repository URL is required!" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Steps to complete:" -ForegroundColor Yellow
Write-Host "1. Creating GitHub repository (if not done):" -ForegroundColor White
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: sunshine-realtors-website" -ForegroundColor Gray
Write-Host "   - Choose Private or Public" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setting up remote..." -ForegroundColor Yellow
Write-Host ""

# Check if remote already exists
$remoteOutput = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "WARNING: Remote 'origin' already exists: $remoteOutput" -ForegroundColor Yellow
    $replace = Read-Host "Replace it? (y/n)"
    if ($replace -eq "y" -or $replace -eq "Y") {
        git remote remove origin
        Write-Host "Removed existing remote" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "Setup cancelled" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}

# Add remote
Write-Host "Adding remote: $repoUrl" -ForegroundColor Cyan
git remote add origin $repoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "Remote added successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to add remote" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Verify remote
Write-Host "Current remotes:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
Write-Host ""

# Ask about pushing
$push = Read-Host "Push code to GitHub now? (y/n)"
if ($push -eq "y" -or $push -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host ""
    
    # Push to master branch
    git push -u origin master
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "WARNING: Push to 'master' failed. Trying 'main'..." -ForegroundColor Yellow
        Write-Host ""
        git push -u origin master:main
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS: Code pushed to GitHub!" -ForegroundColor Green
        Write-Host "View your repository at: $repoUrl" -ForegroundColor Cyan
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "ERROR: Push failed. Common issues:" -ForegroundColor Red
        Write-Host "   - Authentication required (use Personal Access Token)" -ForegroundColor Yellow
        Write-Host "   - Repository doesn't exist yet" -ForegroundColor Yellow
        Write-Host "   - Network issues" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "You can push manually later with: git push -u origin $currentBranch" -ForegroundColor Cyan
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "Setup complete! Push manually with:" -ForegroundColor Cyan
    Write-Host "   git push -u origin $currentBranch" -ForegroundColor White
    Write-Host ""
}

Write-Host "GitHub setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   - Set up branch protection (Settings -> Branches)" -ForegroundColor White
Write-Host "   - Add collaborators if needed" -ForegroundColor White
Write-Host "   - Configure GitHub Actions (optional)" -ForegroundColor White
Write-Host ""
