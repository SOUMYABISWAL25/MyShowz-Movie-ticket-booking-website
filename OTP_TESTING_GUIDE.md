# OTP/Email Verification Testing Guide

## 🎯 Overview
This guide will help you test the OTP (One-Time Password) email verification functionality in your MyShowz sign-in page.

## 📋 Current Setup

### Development Mode (Default)
The application is currently running in **DEVELOPMENT MODE**, which means:
- ✅ No AWS credentials required
- ✅ All authentication is simulated locally
- ✅ OTP verification works without real emails
- ✅ Perfect for testing the UI/UX flow

### How to Test OTP Flow

#### Step 1: Open Sign-In Page
1. Open `sign_in.html` in your web browser
2. You should see the sign-in form

#### Step 2: Create an Account
1. Click "Create Account" button
2. Fill in the sign-up form:
   - **Name**: Enter any name (e.g., "John Doe")
   - **Email**: Enter any email (e.g., "test@example.com")
   - **Password**: Enter a password (min 8 characters, with uppercase, lowercase, and numbers)
   - **Confirm Password**: Re-enter the same password
3. Click "Sign Up" button

#### Step 3: OTP Modal Should Appear
After clicking Sign Up, you should see:
1. ✅ Success alert: "Account created! Please check your email for verification code."
2. ✅ **OTP Verification Modal** appears on screen with:
   - Title: "Verify Your Email"
   - Input field for 6-digit code
   - "Verify Email" button
   - "Didn't receive code? Resend" link
   - Close button (×) in top-right corner

#### Step 4: Enter Verification Code
In development mode, you can enter **any 6-digit code**:
- Example: `123456`
- The code will be accepted automatically

#### Step 5: Complete Verification
1. Enter the 6-digit code
2. Click "Verify Email"
3. You should see:
   - Success alert: "Email verified successfully!"
   - Modal closes automatically
   - Redirected to sign-in form

## 🔍 Troubleshooting

### Issue: OTP Modal Not Showing

**Check Browser Console:**
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Look for these messages:
   ```
   AWS Amplify Auth initialized
   Development Mode: true
   Sign Up form listener attached
   DEV MODE: Simulating sign up for: [email]
   Opening verification modal for: [email]
   Modal element: [object HTMLDivElement]
   Modal display set to flex
   ```

**If modal doesn't appear, check:**
1. ✅ JavaScript console for errors
2. ✅ Network tab for failed script loads
3. ✅ Make sure `amplify-auth.js` is loaded
4. ✅ Verify CSS file `sign-in.css` is loaded

### Issue: Form Not Submitting

**Verify:**
1. Open browser console (F12)
2. Check for message: `Sign Up form listener attached`
3. If not present, refresh the page
4. Check if jQuery is loaded: Type `$` in console

### Issue: Modal Appears But Can't Close

**Solutions:**
1. Click the × button in top-right corner
2. Or refresh the page
3. Check console for JavaScript errors

## 🚀 Production Mode (AWS Amplify)

### When Ready to Use Real AWS Authentication:

#### Step 1: Deploy Amplify Backend
```powershell
npx ampx sandbox
```

#### Step 2: Get Your Credentials
After deployment, you'll receive:
- User Pool ID (e.g., `ap-south-1_XXXXXXXXX`)
- User Pool Client ID (e.g., `xxxxxxxxxxxxxxxxxxxxxxxxxx`)

#### Step 3: Update Configuration
Edit `assets/js/amplify-auth.js`:
```javascript
const DEVELOPMENT_MODE = false; // Change to false

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_YOUR_POOL_ID',      // Your actual Pool ID
            userPoolClientId: 'YOUR_CLIENT_ID',          // Your actual Client ID
            loginWith: {
                email: true
            }
        }
    }
});
```

#### Step 4: Test with Real Emails
1. Sign up with a **real email address**
2. Check your email inbox for verification code
3. Enter the 6-digit code from email
4. Complete verification

## 📧 Email Verification Flow

### Development Mode Flow:
```
Sign Up → Success Alert → OTP Modal → Enter Any 6-Digit Code → Verify → Success
```

### Production Mode Flow:
```
Sign Up → AWS Sends Email → OTP Modal → Enter Code from Email → AWS Verifies → Success
```

## 🎨 Modal Features

### Visual Features:
- ✅ Dark overlay background
- ✅ Centered modal with smooth animations
- ✅ Close button (×) in top-right
- ✅ Loading spinner during verification
- ✅ Success/error alerts
- ✅ Resend code functionality
- ✅ Dark/light theme support

### Keyboard Features:
- Press `Esc` to close (coming soon)
- Click outside modal to close (coming soon)

## 🔐 Security Features

### Password Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Code Requirements:
- Exactly 6 digits
- Expires after 24 hours (in production)
- Can be resent if not received

## 📱 Responsive Design

The OTP modal works on:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Modal not showing | Check browser console for errors |
| Form not submitting | Verify all fields are filled correctly |
| Code not accepting | Ensure exactly 6 digits entered |
| Can't close modal | Click × button or refresh page |
| Styles not loading | Clear browser cache (Ctrl+F5) |

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Review this guide
3. Check `AWS_AMPLIFY_INTEGRATION.md` for AWS setup
4. Verify all files are in correct locations

## ✅ Quick Test Checklist

- [ ] Open `sign_in.html` in browser
- [ ] Click "Create Account"
- [ ] Fill in all fields correctly
- [ ] Click "Sign Up"
- [ ] See success alert
- [ ] **OTP Modal appears**
- [ ] Enter 6-digit code (any code in dev mode)
- [ ] Click "Verify Email"
- [ ] See success message
- [ ] Modal closes
- [ ] Redirected to sign-in

## 🎉 Success!

If you can complete all steps above, your OTP verification is working perfectly! 🚀
