# 🔐 AWS Amplify Authentication Setup Guide

## Current Status
✅ **Backend Configuration**: Your Amplify backend is already configured with email/password authentication  
✅ **Frontend UI**: Sign-in page is ready with complete UI  
⏳ **Connection**: Need to deploy backend and update frontend configuration

---

## 📋 Prerequisites

1. **AWS Account**: You need an AWS account ([Sign up here](https://aws.amazon.com/))
2. **AWS CLI**: Install and configure AWS CLI ([Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
3. **Node.js**: Version 18+ installed

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# You'll be prompted for:
# - AWS Access Key ID
# - AWS Secret Access Key  
# - Default region (e.g., ap-south-1)
# - Default output format (json)
```

### Step 3: Deploy Amplify Backend

```bash
# Deploy your backend to AWS (this creates the Cognito User Pool)
npx ampx sandbox
```

**What happens:**
- Creates AWS Cognito User Pool for authentication
- Sets up user attributes (email, name)
- Configures password policy
- Generates configuration file

**Expected Output:**
```
✅ Amplify Sandbox deployed successfully
📝 User Pool ID: ap-south-1_XXXXXXXXX
📝 App Client ID: XXXXXXXXXXXXXXXXXXXXXXXXXX
🌐 Sandbox URL: https://XXXXX.amplifyapp.com
```

### Step 4: Update Frontend Configuration

After deployment, you'll see the configuration output. Copy the values:

**Option A: Use the helper script (Recommended)**
```bash
node update-amplify-config.js
```
The script will prompt you for:
- User Pool ID
- App Client ID

**Option B: Manual update**
Edit `assets/js/amplify-auth.js` and replace:
```javascript
userPoolId: 'ap-south-1_XXXXXXXXX',  // Replace with your User Pool ID
userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',  // Replace with your App Client ID
```

### Step 5: Test Authentication

1. Open `sign_in.html` in your browser
2. Click "Create New Account"
3. Fill in the form and submit
4. Check your email for verification code
5. Enter the code to verify
6. Sign in with your credentials

---

## 🔍 Configuration Files

### Backend Configuration
- **`amplify/auth/resource.ts`**: Auth settings (email login, password policy)
- **`amplify/backend.ts`**: Main backend configuration

### Frontend Configuration
- **`assets/js/amplify-auth.js`**: Authentication logic
- **`sign_in.html`**: Sign-in/Sign-up UI

---

## 🧪 Development Mode

The system currently runs in **Development Mode** with mock authentication:
- Sign-in/Sign-up works locally without AWS
- No actual AWS calls are made
- User data stored in localStorage

To switch to **Production Mode**:
1. Deploy backend (Step 3)
2. Update configuration (Step 4)
3. The system will automatically detect real credentials

---

## 📊 Features Enabled

✅ **Email/Password Authentication**
- User registration with email verification
- Sign-in with email and password
- Password reset flow
- Remember me functionality

✅ **User Attributes**
- Email (required, immutable)
- Name (required, mutable)

✅ **Password Policy**
- Minimum 8 characters
- Requires lowercase letter
- Requires uppercase letter
- Requires number
- No special characters required

---

## 🔧 Troubleshooting

### Issue: "Amplify is not configured"
**Solution**: Make sure you've updated the configuration in `assets/js/amplify-auth.js` with your actual User Pool ID and Client ID.

### Issue: "User Pool not found"
**Solution**: Verify your AWS credentials are correct and the backend is deployed:
```bash
aws cognito-idp list-user-pools --max-results 10
```

### Issue: Email verification not received
**Solution**: 
1. Check your spam folder
2. Verify SES (Simple Email Service) is configured in AWS Console
3. For development, AWS Cognito sends emails from a verified domain

### Issue: "Invalid password format"
**Solution**: Password must meet the policy:
- At least 8 characters
- Contains uppercase letter
- Contains lowercase letter
- Contains number

---

## 💰 Cost Considerations

AWS Cognito Pricing (as of 2024):
- **Free Tier**: 50,000 Monthly Active Users (MAU)
- **Beyond Free Tier**: $0.0055 per MAU

**Estimated Cost for Small App**: FREE (under 50k users)

---

## 🔒 Security Best Practices

1. **Never commit credentials**: Keep `userPoolId` and `clientId` in environment variables for production
2. **Enable MFA**: Consider enabling Multi-Factor Authentication for production
3. **Use HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Cognito has built-in rate limiting
5. **Password Policy**: Current policy is secure for most applications

---

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [AWS Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [Amplify Gen2 Auth](https://docs.amplify.aws/gen2/build-a-backend/auth/)

---

## 🎯 Next Steps After Setup

1. **Customize Email Templates**: In AWS Cognito Console
2. **Add Social Login**: Google, Facebook, etc. (optional)
3. **Set Up Custom Domain**: For email verification
4. **Enable MFA**: For additional security
5. **Configure Password Recovery**: SMS or Email

---

## 📞 Support

If you encounter issues:
1. Check AWS CloudWatch logs
2. Review browser console for errors
3. Verify AWS credentials are correct
4. Ensure region is consistent across configuration

---

**Last Updated**: October 29, 2025  
**Amplify Version**: 6.15.7  
**Backend CLI Version**: 1.8.0
