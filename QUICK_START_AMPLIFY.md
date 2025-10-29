# ⚡ Quick Start - AWS Amplify Authentication

## 🎯 Goal
Connect your MyShowz sign-in page to AWS Amplify backend for real authentication.

---

## 📦 What's Already Done

✅ **Backend Configuration** (`amplify/` folder)
- Email/password authentication configured
- Password policy set (8+ chars, uppercase, lowercase, number)
- User attributes: email, name

✅ **Frontend UI** (`sign_in.html`)
- Beautiful sign-in/sign-up forms
- Email verification flow
- Password reset functionality
- All forms ready to use

✅ **Integration Code** (`assets/js/amplify-auth.js`)
- Complete authentication logic
- Handles sign-up, sign-in, verification, password reset
- Currently in DEVELOPMENT MODE (works without AWS)

---

## 🚀 3-Step Setup

### Step 1: Configure AWS Credentials

```bash
aws configure
```

Enter:
- AWS Access Key ID
- AWS Secret Access Key
- Region (e.g., `ap-south-1`)

### Step 2: Deploy Backend

**Option A: Using npm script (Recommended)**
```bash
npm run amplify:setup
```
This will:
1. Install dependencies
2. Deploy backend
3. Run configuration helper

**Option B: Manual**
```bash
npm install
npm run amplify:deploy
```

### Step 3: Update Configuration

After deployment, copy the credentials shown in terminal:
```bash
npm run amplify:config
```

Enter when prompted:
- User Pool ID (e.g., `ap-south-1_AbCdEfGhI`)
- App Client ID (e.g., `1a2b3c4d5e6f7g8h9i0j1k2l3m`)

---

## ✅ Done! Test It

1. Open `sign_in.html` in browser
2. Click "Create New Account"
3. Fill form and submit
4. Check email for verification code
5. Enter code and complete signup
6. Sign in with credentials

---

## 🔍 Verification

**Development Mode (Current):**
```
Console shows: "⚠️ Running in DEVELOPMENT MODE"
```

**Production Mode (After Setup):**
```
Console shows: "✅ AWS Amplify configured successfully"
```

---

## 📋 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Deploy** | `npm run amplify:deploy` | Deploy backend only |
| **Configure** | `npm run amplify:config` | Update frontend config |
| **Full Setup** | `npm run amplify:setup` | Do everything |
| **Dev Server** | `npm run dev` | Start local server |

---

## 🐛 Troubleshooting

### "AWS credentials not configured"
```bash
aws configure
# Enter your AWS credentials
```

### "Node.js not found"
Install Node.js from https://nodejs.org/ (v18+)

### "Permission denied" (Mac/Linux)
```bash
chmod +x deploy-amplify.sh
./deploy-amplify.sh
```

### Still Not Working?
See detailed guide: `AMPLIFY_SETUP_GUIDE.md`

---

## 💰 Cost

**FREE** for up to 50,000 monthly active users (AWS Free Tier)

---

## 📁 Files Overview

```
MyShowz/
├── amplify/                      # Backend configuration
│   ├── auth/resource.ts         # Auth settings
│   └── backend.ts               # Main config
│
├── assets/js/
│   ├── amplify-auth.js          # ⭐ Authentication logic
│   └── aws-config.js            # AWS config
│
├── sign_in.html                 # ⭐ Sign-in/Sign-up UI
│
├── deploy-amplify.ps1           # Deployment script (Windows)
├── deploy-amplify.sh            # Deployment script (Mac/Linux)
├── update-amplify-config.js     # Config helper
│
└── AMPLIFY_SETUP_GUIDE.md       # Detailed guide
```

---

## 🎉 Features You Get

✅ User Registration with Email Verification  
✅ Sign In / Sign Out  
✅ Password Reset Flow  
✅ Remember Me  
✅ Secure Password Storage (AWS Cognito)  
✅ Automatic Session Management  
✅ Production-Ready Security  

---

## 🔐 Security Features

- Passwords hashed by AWS Cognito
- Email verification required
- Rate limiting built-in
- HTTPS in production
- Password policy enforced
- Session tokens auto-expire

---

## 📞 Need Help?

1. **Check Console**: Open browser DevTools (F12)
2. **Review Logs**: See detailed error messages
3. **AWS Console**: Check Cognito User Pools
4. **Documentation**: See `AMPLIFY_SETUP_GUIDE.md`

---

**Time to Set Up**: ~10 minutes  
**Difficulty**: Easy (all automated)  
**Cost**: FREE (within AWS Free Tier)

---

Ready? Run:
```bash
npm run amplify:setup
```
