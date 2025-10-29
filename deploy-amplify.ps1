# AWS Amplify Backend Deployment Script
# PowerShell script for Windows

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  AWS Amplify Backend Deployment" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green

# Check if AWS CLI is installed
$awsVersion = aws --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS CLI is not installed!" -ForegroundColor Red
    Write-Host "   Please install AWS CLI from https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ AWS CLI installed" -ForegroundColor Green

# Check if AWS credentials are configured
Write-Host "`nChecking AWS credentials..." -ForegroundColor Yellow
$awsIdentity = aws sts get-caller-identity 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AWS credentials not configured!" -ForegroundColor Red
    Write-Host "`nPlease run: aws configure" -ForegroundColor Yellow
    Write-Host "You'll need:" -ForegroundColor Yellow
    Write-Host "  - AWS Access Key ID" -ForegroundColor Cyan
    Write-Host "  - AWS Secret Access Key" -ForegroundColor Cyan
    Write-Host "  - Default region (e.g., ap-south-1)" -ForegroundColor Cyan
    exit 1
}
Write-Host "✅ AWS credentials configured" -ForegroundColor Green

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Deploy Amplify backend
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Deploying Amplify Backend..." -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

Write-Host "⏳ This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host "`n"

npx ampx sandbox

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "  ✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "==========================================`n" -ForegroundColor Green
    
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Copy the User Pool ID and Client ID from above" -ForegroundColor Yellow
    Write-Host "   2. Run: node update-amplify-config.js" -ForegroundColor Yellow
    Write-Host "   3. Enter your credentials when prompted" -ForegroundColor Yellow
    Write-Host "   4. Test your authentication at sign_in.html`n" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above.`n" -ForegroundColor Yellow
}
