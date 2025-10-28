# Quick Start Guide - AWS Amplify Authentication

## 🚀 Get Started in 5 Minutes

### 1. Install Node.js
Download and install from: https://nodejs.org/
Choose the **LTS version** (recommended)

### 2. Install Dependencies
Open terminal in your project folder and run:
```bash
npm install
```

### 3. Configure AWS (One-time setup)
```bash
aws configure
```
Enter your AWS credentials when prompted.

### 4. Deploy Backend
```bash
npx ampx sandbox
```
**Keep this terminal running!**

### 5. Update Configuration
After deployment, copy the User Pool ID and Client ID from terminal output.

Edit `assets/js/amplify-auth.js` (lines 9-10):
```javascript
userPoolId: 'YOUR_USER_POOL_ID_HERE',
userPoolClientId: 'YOUR_CLIENT_ID_HERE',
```

### 6. Test It!
Open `sign_in.html` in your browser and try:
- Creating a new account
- Verifying your email
- Signing in

## 🎯 Current Status

✅ **What's Working:**
- Development mode (no AWS needed for testing)
- Sign up, sign in, email verification
- Password reset functionality
- Modern, responsive UI

⚠️ **What You Need to Do:**
1. Install Node.js (if not installed)
2. Run `npm install`
3. Deploy backend with `npx ampx sandbox`
4. Update configuration with your AWS credentials

## 📖 Full Documentation

See `AWS_AMPLIFY_INTEGRATION.md` for complete setup instructions.

## 🆘 Need Help?

**Problem:** npm command not found
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** AWS credentials error
**Solution:** Run `aws configure` and enter your AWS access keys

**Problem:** Want to test without AWS
**Solution:** The app is already in development mode! Just open `sign_in.html`

---

**Ready to deploy?** Follow the full guide in `AWS_AMPLIFY_INTEGRATION.md`
