import { Amplify } from 'aws-amplify';

// Development mode flag - set to true for testing without AWS backend
const DEVELOPMENT_MODE = true;

if (DEVELOPMENT_MODE) {
    console.log('Running in development mode - AWS Amplify will be mocked');
    // Mock AWS Amplify for development
    window.AmplifyMock = true;
} else {
    // AWS Amplify configuration for production
    // This will be automatically configured when you deploy your Amplify backend
    const awsconfig = {
        "aws_project_region": "ap-south-1",
        "aws_cognito_region": "ap-south-1",
        "aws_user_pools_id": "ap-south-1_XXXXXXXXX", // Replace with actual ID after deployment
        "aws_user_pools_web_client_id": "XXXXXXXXXXXXXXXXXXXXXXXXXX", // Replace with actual ID after deployment
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
}