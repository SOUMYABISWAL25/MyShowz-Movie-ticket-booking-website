import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'ap-south-1',
        userPoolId: 'YOUR_USER_POOL_ID', // Replace with your User Pool ID
        userPoolWebClientId: 'YOUR_CLIENT_ID', // Replace with your App Client ID
        mandatorySignIn: true,
        authenticationFlowType: 'USER_SRP_AUTH'
    }
});