# AWS Amplify Authentication Setup Guide

This guide will help you set up AWS Amplify authentication for your MyShowz movie ticket booking website.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **Node.js**: Install Node.js (version 16 or higher)
3. **AWS CLI**: Install and configure AWS CLI
4. **Amplify CLI**: Install the Amplify CLI

## Installation Steps

### 1. Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### 2. Configure AWS CLI

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, region (ap-south-1), and output format (json).

### 3. Initialize Amplify Backend

Navigate to your project directory and run:

```bash
npx ampx sandbox
```

This will:
- Deploy your authentication backend
- Generate the necessary configuration files
- Provide you with the actual User Pool ID and Client ID

### 4. Update Configuration

After running `npx ampx sandbox`, you'll get output similar to:

```
✅ Sandbox deployed successfully!

Your backend is ready! Here are the details:

User Pool ID: ap-south-1_XXXXXXXXX
User Pool Client ID: XXXXXXXXXXXXXXXXXXXXXXXXXX
Region: ap-south-1
```

Update the `assets/js/aws-config.js` file with these actual values:

```javascript
const awsconfig = {
    "aws_project_region": "ap-south-1",
    "aws_cognito_region": "ap-south-1",
    "aws_user_pools_id": "ap-south-1_XXXXXXXXX", // Replace with actual ID
    "aws_user_pools_web_client_id": "XXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with actual ID
    // ... rest of configuration
};
```

## Features Included

### ✅ Authentication Features

1. **User Registration**
   - Email-based registration
   - Password validation (minimum 8 characters)
   - Email verification required

2. **User Sign In**
   - Email and password authentication
   - Session management
   - Automatic redirect to home page

3. **Email Verification**
   - Automatic email verification after signup
   - Verification code input modal
   - Resend verification code functionality

4. **Password Reset**
   - Forgot password functionality
   - Two-step password reset process
   - Email-based verification codes

5. **Security Features**
   - Password strength validation
   - Account lockout protection
   - Secure session management

### ✅ UI Features

1. **Modern Design**
   - Responsive design for all devices
   - Dark/light theme support
   - Smooth animations and transitions

2. **User Experience**
   - Real-time form validation
   - Loading states and feedback
   - Error handling with helpful messages

3. **Accessibility**
   - Keyboard navigation support
   - Screen reader friendly
   - High contrast support

## File Structure

```
├── sign_in.html              # Main sign-in page
├── assets/
│   ├── css/
│   │   └── sign-in.css      # Sign-in page styles
│   └── js/
│       ├── aws-config.js    # AWS Amplify configuration
│       ├── auth.js          # Authentication functions
│       └── sign-in.js       # UI interactions
├── amplify/
│   ├── backend.ts           # Backend configuration
│   ├── auth/
│   │   └── resource.ts      # Auth resource definition
│   └── data/
│       └── resource.ts      # Data resource definition
└── AMPLIFY_SETUP.md         # This setup guide
```

## Testing the Authentication

### 1. Test User Registration

1. Open `sign_in.html` in your browser
2. Click on the "Sign Up" tab
3. Fill in the registration form
4. Check your email for verification code
5. Enter the verification code in the modal

### 2. Test User Sign In

1. Use the "Sign In" tab
2. Enter your verified email and password
3. You should be redirected to `index.html`

### 3. Test Password Reset

1. Click "Forgot Password?" link
2. Enter your email address
3. Check email for reset code
4. Enter code and new password

## Customization Options

### 1. Password Policy

Edit `amplify/auth/resource.ts` to customize password requirements:

```typescript
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
    name: {
      required: true,
    },
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
});
```

### 2. Social Login (Optional)

To add Google or Facebook login, update your auth configuration:

```typescript
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: 'your-google-client-id',
        clientSecret: 'your-google-client-secret',
      },
      facebook: {
        clientId: 'your-facebook-app-id',
        clientSecret: 'your-facebook-app-secret',
      },
    },
  },
});
```

### 3. Custom Styling

Modify `assets/css/sign-in.css` to customize:
- Colors and themes
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

## Troubleshooting

### Common Issues

1. **Configuration Error**
   - Ensure AWS credentials are properly configured
   - Verify the User Pool ID and Client ID are correct

2. **Email Not Received**
   - Check spam folder
   - Verify email address is correct
   - Ensure SES is properly configured in your AWS account

3. **CORS Issues**
   - Make sure your domain is added to the allowed origins in Cognito
   - Check browser console for specific CORS errors

4. **Module Import Errors**
   - Ensure all JavaScript files are properly linked
   - Check that AWS Amplify is loaded before other scripts

### Getting Help

1. Check the AWS Amplify documentation
2. Review the browser console for error messages
3. Verify your AWS account permissions
4. Test with a simple email/password combination

## Security Best Practices

1. **Never commit AWS credentials** to version control
2. **Use environment variables** for sensitive configuration
3. **Enable MFA** on your AWS account
4. **Regularly rotate** AWS access keys
5. **Monitor** authentication logs in AWS CloudWatch

## Next Steps

After setting up authentication, you can:

1. **Add user profiles** and preferences
2. **Implement role-based access** control
3. **Add social login** providers
4. **Integrate with your movie booking** system
5. **Add user analytics** and tracking

## Support

For issues specific to this implementation, check:
- AWS Amplify documentation
- AWS Cognito documentation
- Browser developer console for errors

Remember to keep your AWS credentials secure and never share them publicly!
