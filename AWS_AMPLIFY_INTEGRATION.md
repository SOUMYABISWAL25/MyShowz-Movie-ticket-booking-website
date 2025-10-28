# AWS Amplify Authentication Integration Guide

## Overview

Your MyShowz website now has a fully integrated AWS Amplify authentication system. This guide will help you set up and deploy the backend.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **AWS Account** - [Sign up here](https://aws.amazon.com/)
3. **AWS CLI** - [Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

### Step 1: Install Node.js

If you don't have Node.js installed:

1. Download from https://nodejs.org/
2. Install the LTS version
3. Restart your terminal/IDE
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Configure AWS Credentials

```bash
# Install AWS CLI (if not already installed)
# Then configure your credentials
aws configure
```

Enter:
- **AWS Access Key ID**: Your AWS access key
- **AWS Secret Access Key**: Your AWS secret key
- **Default region**: `ap-south-1` (or your preferred region)
- **Default output format**: `json`

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Deploy Amplify Backend

```bash
npx ampx sandbox
```

This command will:
- Create a Cognito User Pool
- Set up authentication resources
- Generate configuration values
- Deploy to AWS

**Important:** Keep this terminal running! The sandbox needs to stay active during development.

### Step 5: Update Configuration

After deployment, you'll see output like:

```
✅ Sandbox deployed successfully!

User Pool ID: ap-south-1_ABC123XYZ
User Pool Client ID: 1a2b3c4d5e6f7g8h9i0j
Region: ap-south-1
```

Update `assets/js/amplify-auth.js` with these values:

```javascript
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_ABC123XYZ', // Replace with your actual ID
            userPoolClientId: '1a2b3c4d5e6f7g8h9i0j', // Replace with your actual ID
            // ... rest stays the same
        }
    }
};
```

### Step 6: Test Your Application

1. Open `sign_in.html` in your browser
2. Try creating a new account
3. Check your email for verification code
4. Sign in with your credentials

## 📁 File Structure

```
MyShowz-Movie-ticket-booking-website/
├── sign_in.html                    # New AWS Amplify integrated sign-in page
├── sign_in_old.html                # Backup of old sign-in page
├── assets/
│   └── js/
│       ├── amplify-auth.js         # NEW: AWS Amplify authentication logic
│       ├── aws-config.js           # Old config (can be removed)
│       ├── auth.js                 # Old auth (can be removed)
│       └── sign-in.js              # Old sign-in (can be removed)
├── amplify/
│   ├── auth/
│   │   └── resource.ts             # UPDATED: Enhanced auth configuration
│   ├── backend.ts                  # Backend definition
│   └── data/
│       └── resource.ts             # Data resources
└── AWS_AMPLIFY_INTEGRATION.md      # This guide
```

## 🎯 Features Implemented

### ✅ Authentication Features

1. **User Registration (Sign Up)**
   - Email-based registration
   - Password validation (8+ characters, uppercase, lowercase, numbers)
   - Automatic email verification
   - User attributes: name, email

2. **User Sign In**
   - Email and password authentication
   - Session management
   - Remember me functionality
   - Automatic redirect after successful login

3. **Email Verification**
   - 6-digit verification code
   - Resend code functionality
   - Modal-based verification UI

4. **Password Reset**
   - Forgot password flow
   - Email-based verification
   - Two-step reset process
   - New password validation

5. **Security**
   - Password strength requirements
   - Secure session storage
   - AWS Cognito security features

### 🎨 UI Features

- Modern, responsive design
- Dark/light theme support
- Loading states and feedback
- Error handling with user-friendly messages
- Password visibility toggle
- Smooth animations and transitions

## 🔧 Development Mode

The application includes a **development mode** that allows you to test without AWS backend:

- Set `DEVELOPMENT_MODE = true` in `amplify-auth.js`
- All authentication is simulated locally
- No AWS charges incurred
- Perfect for frontend development

**To switch to production:**
1. Deploy your Amplify backend
2. Update configuration in `amplify-auth.js`
3. The app will automatically detect real credentials

## 🌐 Deployment Options

### Option 1: Amplify Hosting (Recommended)

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

### Option 2: Manual Deployment

1. Build your application
2. Upload to S3 or any static hosting
3. Ensure CORS is configured in Cognito
4. Update allowed callback URLs

## 📝 Configuration Reference

### Password Policy

Current settings in `amplify/auth/resource.ts`:

```typescript
passwordPolicy: {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: false,
}
```

### User Attributes

```typescript
userAttributes: {
  email: {
    required: true,
    mutable: false,  // Email cannot be changed
  },
  name: {
    required: true,
    mutable: true,   // Name can be updated
  },
}
```

## 🔐 Security Best Practices

1. **Never commit AWS credentials** to version control
2. **Use environment variables** for sensitive data
3. **Enable MFA** on your AWS root account
4. **Regularly rotate** access keys
5. **Monitor CloudWatch** logs for suspicious activity
6. **Set up billing alerts** to avoid unexpected charges

## 🐛 Troubleshooting

### Issue: "npm is not recognized"

**Solution:** Install Node.js from https://nodejs.org/ and restart your terminal.

### Issue: "AWS credentials not configured"

**Solution:** Run `aws configure` and enter your AWS credentials.

### Issue: "User Pool ID contains XXXXXXXXX"

**Solution:** You're in development mode. Deploy your backend with `npx ampx sandbox` and update the configuration.

### Issue: Email not received

**Solutions:**
- Check spam folder
- Verify email address is correct
- In AWS Console, check SES (Simple Email Service) settings
- For production, verify your domain in SES

### Issue: CORS errors

**Solutions:**
- Add your domain to allowed origins in Cognito
- Check browser console for specific errors
- Ensure your app is served over HTTPS in production

### Issue: "Module not found" errors

**Solution:** Run `npm install` to install all dependencies.

## 📊 Testing Checklist

- [ ] User can sign up with email and password
- [ ] Verification email is received
- [ ] User can verify email with code
- [ ] User can sign in after verification
- [ ] User can reset forgotten password
- [ ] User stays signed in after page refresh
- [ ] Error messages display correctly
- [ ] Loading states work properly
- [ ] Password visibility toggle works
- [ ] Responsive design works on mobile

## 🚀 Next Steps

After authentication is working:

1. **Add User Profile Page**
   - Display user information
   - Allow profile updates
   - Show booking history

2. **Protect Routes**
   - Add authentication checks to booking pages
   - Redirect unauthenticated users to sign-in
   - Store user preferences

3. **Integrate with Booking System**
   - Link user ID to bookings
   - Store booking history in database
   - Send confirmation emails

4. **Add Social Login** (Optional)
   - Google Sign-In
   - Facebook Login
   - Configure OAuth providers

5. **Analytics and Monitoring**
   - Track user signups
   - Monitor authentication errors
   - Set up CloudWatch dashboards

## 💰 AWS Costs

### Free Tier (First 12 months)
- **Cognito**: 50,000 MAUs (Monthly Active Users) free
- **Lambda**: 1M requests/month free
- **CloudWatch**: Basic monitoring free

### After Free Tier
- **Cognito**: $0.0055 per MAU after 50,000
- Very cost-effective for small to medium applications

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amplify Gen 2 Guide](https://docs.amplify.aws/gen2/)
- [AWS Free Tier Details](https://aws.amazon.com/free/)

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Review AWS CloudWatch logs
3. Verify your AWS credentials and permissions
4. Check the Amplify documentation
5. Review this guide's troubleshooting section

## 📄 License

This integration is part of the MyShowz project. Refer to the main project license.

---

**Happy Coding! 🎬🍿**

For questions or issues, check the AWS Amplify documentation or AWS support forums.
