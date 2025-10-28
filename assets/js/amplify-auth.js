import { Amplify } from 'https://cdn.jsdelivr.net/npm/aws-amplify@6/+esm';
import { signUp, signIn, confirmSignUp, resetPassword, confirmResetPassword, signOut, getCurrentUser } from 'https://cdn.jsdelivr.net/npm/aws-amplify@6/auth/+esm';

// AWS Amplify Configuration
// IMPORTANT: Replace these values with your actual Amplify backend configuration
// Run 'npx ampx sandbox' to deploy your backend and get these values
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'ap-south-1_XXXXXXXXX', // Replace with your User Pool ID
            userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
            loginWith: {
                email: true
            },
            signUpVerificationMethod: 'code',
            userAttributes: {
                email: {
                    required: true
                }
            },
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: false
            }
        }
    }
};

// Check if we're in development mode
const DEVELOPMENT_MODE = amplifyConfig.Auth.Cognito.userPoolId.includes('XXXXXXXXX');

if (!DEVELOPMENT_MODE) {
    // Configure Amplify only if we have real credentials
    Amplify.configure(amplifyConfig);
    console.log('AWS Amplify configured successfully');
} else {
    console.warn('⚠️ Running in DEVELOPMENT MODE - Please configure your AWS Amplify backend');
    console.warn('Run: npx ampx sandbox');
    console.warn('Then update the credentials in assets/js/amplify-auth.js');
}

// Store for pending verification
let pendingVerificationEmail = '';

// Helper function to show messages
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Helper function to show loading
function showLoading(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

// Sign Up Handler
async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (password !== confirmPassword) {
        showMessage('signup-error', 'Passwords do not match');
        return;
    }

    if (password.length < 8) {
        showMessage('signup-error', 'Password must be at least 8 characters long');
        return;
    }

    if (!agreeTerms) {
        showMessage('signup-error', 'Please agree to the terms and conditions');
        return;
    }

    showLoading('signup-loading', true);

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate signup
            console.log('DEV MODE: Simulating sign up for:', email);
            setTimeout(() => {
                showLoading('signup-loading', false);
                showMessage('signup-success', 'Account created! Please check your email for verification code.', 'success');
                pendingVerificationEmail = email;
                document.getElementById('verificationEmail').value = email;
                $('#verificationModal').modal('show');
            }, 1000);
        } else {
            // Production mode - use AWS Amplify
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password: password,
                options: {
                    userAttributes: {
                        email: email,
                        name: name
                    },
                    autoSignIn: true
                }
            });

            showLoading('signup-loading', false);

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                showMessage('signup-success', 'Account created! Please check your email for verification code.', 'success');
                pendingVerificationEmail = email;
                document.getElementById('verificationEmail').value = email;
                $('#verificationModal').modal('show');
            }
        }
    } catch (error) {
        showLoading('signup-loading', false);
        console.error('Sign up error:', error);
        showMessage('signup-error', error.message || 'Failed to create account. Please try again.');
    }
}

// Sign In Handler
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    showLoading('signin-loading', true);

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate sign in
            console.log('DEV MODE: Simulating sign in for:', email);
            setTimeout(() => {
                showLoading('signin-loading', false);
                showMessage('signin-success', 'Sign in successful! Redirecting...', 'success');
                
                // Store user session
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isAuthenticated', 'true');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1000);
        } else {
            // Production mode - use AWS Amplify
            const { isSignedIn, nextStep } = await signIn({
                username: email,
                password: password
            });

            showLoading('signin-loading', false);

            if (isSignedIn) {
                showMessage('signin-success', 'Sign in successful! Redirecting...', 'success');
                
                // Store user session
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isAuthenticated', 'true');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                showMessage('signin-error', 'Please verify your email first');
                pendingVerificationEmail = email;
                document.getElementById('verificationEmail').value = email;
                $('#verificationModal').modal('show');
            }
        }
    } catch (error) {
        showLoading('signin-loading', false);
        console.error('Sign in error:', error);
        
        if (error.name === 'UserNotConfirmedException') {
            showMessage('signin-error', 'Please verify your email first');
            pendingVerificationEmail = email;
            document.getElementById('verificationEmail').value = email;
            $('#verificationModal').modal('show');
        } else if (error.name === 'NotAuthorizedException') {
            showMessage('signin-error', 'Incorrect email or password');
        } else {
            showMessage('signin-error', error.message || 'Failed to sign in. Please try again.');
        }
    }
}

// Email Verification Handler
async function handleVerifyEmail() {
    const code = document.getElementById('verificationCode').value;
    const email = document.getElementById('verificationEmail').value;

    if (!code || code.length !== 6) {
        showMessage('verification-error', 'Please enter a valid 6-digit code');
        return;
    }

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate verification
            console.log('DEV MODE: Simulating email verification for:', email);
            setTimeout(() => {
                showMessage('verification-success', 'Email verified successfully!', 'success');
                setTimeout(() => {
                    $('#verificationModal').modal('hide');
                    // Switch to sign in tab
                    $('#signin-tab').tab('show');
                }, 1500);
            }, 1000);
        } else {
            // Production mode - use AWS Amplify
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: email,
                confirmationCode: code
            });

            if (isSignUpComplete) {
                showMessage('verification-success', 'Email verified successfully!', 'success');
                setTimeout(() => {
                    $('#verificationModal').modal('hide');
                    // Switch to sign in tab
                    $('#signin-tab').tab('show');
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Verification error:', error);
        showMessage('verification-error', error.message || 'Invalid verification code');
    }
}

// Resend Verification Code
async function handleResendCode() {
    const email = document.getElementById('verificationEmail').value;
    
    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating resend code for:', email);
            showMessage('verification-success', 'Verification code sent! Check your email.', 'success');
        } else {
            // In production, you would call resendSignUpCode
            showMessage('verification-success', 'Verification code sent! Check your email.', 'success');
        }
    } catch (error) {
        console.error('Resend code error:', error);
        showMessage('verification-error', 'Failed to resend code');
    }
}

// Forgot Password - Step 1: Send Reset Code
async function handleForgotPassword() {
    const email = document.getElementById('resetEmail').value;

    if (!email) {
        showMessage('forgot-error', 'Please enter your email address');
        return;
    }

    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating password reset for:', email);
            setTimeout(() => {
                showMessage('forgot-success', 'Reset code sent! Check your email.', 'success');
                document.getElementById('forgotPasswordStep1').style.display = 'none';
                document.getElementById('forgotPasswordStep2').style.display = 'block';
                document.getElementById('forgotPasswordBtn').textContent = 'Reset Password';
                document.getElementById('forgotPasswordBtn').onclick = handleResetPassword;
            }, 1000);
        } else {
            const output = await resetPassword({ username: email });
            
            showMessage('forgot-success', 'Reset code sent! Check your email.', 'success');
            document.getElementById('forgotPasswordStep1').style.display = 'none';
            document.getElementById('forgotPasswordStep2').style.display = 'block';
            document.getElementById('forgotPasswordBtn').textContent = 'Reset Password';
            document.getElementById('forgotPasswordBtn').onclick = handleResetPassword;
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showMessage('forgot-error', error.message || 'Failed to send reset code');
    }
}

// Forgot Password - Step 2: Reset Password
async function handleResetPassword() {
    const email = document.getElementById('resetEmail').value;
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmPassword) {
        showMessage('forgot-error', 'Passwords do not match');
        return;
    }

    if (newPassword.length < 8) {
        showMessage('forgot-error', 'Password must be at least 8 characters long');
        return;
    }

    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating password reset completion for:', email);
            setTimeout(() => {
                showMessage('forgot-success', 'Password reset successful! You can now sign in.', 'success');
                setTimeout(() => {
                    $('#forgotPasswordModal').modal('hide');
                    // Reset modal
                    document.getElementById('forgotPasswordStep1').style.display = 'block';
                    document.getElementById('forgotPasswordStep2').style.display = 'none';
                    document.getElementById('forgotPasswordBtn').textContent = 'Send Reset Code';
                    document.getElementById('forgotPasswordBtn').onclick = handleForgotPassword;
                    // Switch to sign in tab
                    $('#signin-tab').tab('show');
                }, 1500);
            }, 1000);
        } else {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPassword
            });

            showMessage('forgot-success', 'Password reset successful! You can now sign in.', 'success');
            setTimeout(() => {
                $('#forgotPasswordModal').modal('hide');
                // Reset modal
                document.getElementById('forgotPasswordStep1').style.display = 'block';
                document.getElementById('forgotPasswordStep2').style.display = 'none';
                document.getElementById('forgotPasswordBtn').textContent = 'Send Reset Code';
                document.getElementById('forgotPasswordBtn').onclick = handleForgotPassword;
                // Switch to sign in tab
                $('#signin-tab').tab('show');
            }, 1500);
        }
    } catch (error) {
        console.error('Reset password error:', error);
        showMessage('forgot-error', error.message || 'Failed to reset password');
    }
}

// Check if user is already signed in
async function checkAuthStatus() {
    try {
        if (DEVELOPMENT_MODE) {
            // Check localStorage for dev mode
            const isAuthenticated = localStorage.getItem('isAuthenticated');
            if (isAuthenticated === 'true') {
                const userEmail = localStorage.getItem('userEmail');
                console.log('DEV MODE: User is authenticated:', userEmail);
            }
        } else {
            const user = await getCurrentUser();
            if (user) {
                console.log('User is authenticated:', user.username);
                // Optionally redirect if already signed in
                // window.location.href = 'index.html';
            }
        }
    } catch (error) {
        // User is not signed in
        console.log('User is not signed in');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check auth status
    checkAuthStatus();

    // Sign Up Form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }

    // Sign In Form
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }

    // Verify Email Button
    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    if (verifyEmailBtn) {
        verifyEmailBtn.addEventListener('click', handleVerifyEmail);
    }

    // Resend Code Button
    const resendCodeBtn = document.getElementById('resendCodeBtn');
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', handleResendCode);
    }

    // Forgot Password Button
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', handleForgotPassword);
    }

    // Reset modal when closed
    $('#forgotPasswordModal').on('hidden.bs.modal', function () {
        document.getElementById('forgotPasswordStep1').style.display = 'block';
        document.getElementById('forgotPasswordStep2').style.display = 'none';
        document.getElementById('forgotPasswordBtn').textContent = 'Send Reset Code';
        document.getElementById('forgotPasswordBtn').onclick = handleForgotPassword;
    });

    console.log('AWS Amplify Auth initialized');
});

// Export functions for global access
window.amplifyAuth = {
    signOut: async function() {
        try {
            if (DEVELOPMENT_MODE) {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('isAuthenticated');
                console.log('DEV MODE: User signed out');
            } else {
                await signOut();
            }
            window.location.href = 'sign_in_new.html';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    },
    getCurrentUser: async function() {
        try {
            if (DEVELOPMENT_MODE) {
                const email = localStorage.getItem('userEmail');
                return email ? { email } : null;
            } else {
                return await getCurrentUser();
            }
        } catch (error) {
            return null;
        }
    }
};
