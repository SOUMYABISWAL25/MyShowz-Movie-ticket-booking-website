import { Amplify } from 'aws-amplify';

// AWS Amplify configuration
// This will be automatically configured when you deploy your Amplify backend
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_XXXXXXXXX', // This will be replaced by Amplify CLI
            userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // This will be replaced by Amplify CLI
            loginWith: {
                email: true
            }
        }
    }
});

// For development, you can use these placeholder values
// After running 'npx ampx sandbox', the actual values will be provided
const awsconfig = {
    "aws_project_region": "ap-south-1",
    "aws_cognito_region": "ap-south-1",
    "aws_user_pools_id": "ap-south-1_XXXXXXXXX",
    "aws_user_pools_web_client_id": "XXXXXXXXXXXXXXXXXXXXXXXXXX",
    "oauth": {},
    "aws_cognito_username_attributes": ["EMAIL"],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": ["EMAIL"],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"]
};

// Apply the configuration
Amplify.configure(awsconfig);