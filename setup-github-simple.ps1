# Simple GitHub Setup - Just provide your repository URL
# Usage: .\setup-github-simple.ps1 -RepoUrl "https://github.com/username/repo.git"

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host ""
Write-Host "GitHub Setup" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host ""

# Check if remote already exists
$remoteCheck = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "WARNING: Remote 'origin' already exists: $remoteCheck" -ForegroundColor Yellow
    $replace = Read-Host "Replace it? (y/n)"
    if ($replace -eq "y" -or $replace -eq "Y") {
        git remote remove origin
        Write-Host "Removed existing remote" -ForegroundColor Green
    } else {
        Write-Host "Setup cancelled" -ForegroundColor Red
        exit 1
    }
}

# Add remote
Write-Host ""
Write-Host "Adding remote: $RepoUrl" -ForegroundColor Cyan
git remote add origin $RepoUrl

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS: Remote added!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to add remote" -ForegroundColor Red
    exit 1
}

# Verify
Write-Host ""
Write-Host "Current remotes:" -ForegroundColor Yellow
git remote -v

# Get current branch
$branch = git branch --show-current
Write-Host ""
Write-Host "Current branch: $branch" -ForegroundColor Cyan
Write-Host ""
Write-Host "To push your code, run:" -ForegroundColor Yellow
Write-Host "  git push -u origin $branch" -ForegroundColor White
Write-Host ""
Write-Host "Or use the interactive script: .\setup-github.ps1" -ForegroundColor Gray
Write-Host ""

