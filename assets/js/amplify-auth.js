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

// Helper function to show alert messages
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    alertContainer.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
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
    
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    const signUpBtn = document.getElementById('signUpBtn');

    // Validation
    if (password !== confirmPassword) {
        showAlert('error', 'Passwords do not match');
        return;
    }

    if (password.length < 8) {
        showAlert('error', 'Password must be at least 8 characters long');
        return;
    }

    // Show loading state
    signUpBtn.classList.add('loading');

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate signup
            console.log('DEV MODE: Simulating sign up for:', email);
            setTimeout(() => {
                signUpBtn.classList.remove('loading');
                showAlert('success', 'Account created! Please check your email for verification code.');
                pendingVerificationEmail = email;
                const modal = document.getElementById('verificationModal');
                console.log('Opening verification modal for:', email);
                console.log('Modal element:', modal);
                modal.style.display = 'flex';
                console.log('Modal display set to flex');
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

            signUpBtn.classList.remove('loading');

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                showAlert('success', 'Account created! Please check your email for verification code.');
                pendingVerificationEmail = email;
                document.getElementById('verificationModal').style.display = 'flex';
            }
        }
    } catch (error) {
        signUpBtn.classList.remove('loading');
        console.error('Sign up error:', error);
        showAlert('error', error.message || 'Failed to create account. Please try again.');
    }
}

// Sign In Handler
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    const signInBtn = document.getElementById('signInBtn');

    signInBtn.classList.add('loading');

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate sign in
            console.log('DEV MODE: Simulating sign in for:', email);
            setTimeout(() => {
                signInBtn.classList.remove('loading');
                showAlert('success', 'Sign in successful! Redirecting...');
                
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

            signInBtn.classList.remove('loading');

            if (isSignedIn) {
                showAlert('success', 'Sign in successful! Redirecting...');
                
                // Store user session
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isAuthenticated', 'true');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                showAlert('error', 'Please verify your email first');
                pendingVerificationEmail = email;
                document.getElementById('verificationModal').style.display = 'flex';
            }
        }
    } catch (error) {
        signInBtn.classList.remove('loading');
        console.error('Sign in error:', error);
        
        if (error.name === 'UserNotConfirmedException') {
            showAlert('error', 'Please verify your email first');
            pendingVerificationEmail = email;
            document.getElementById('verificationModal').style.display = 'flex';
        } else if (error.name === 'NotAuthorizedException') {
            showAlert('error', 'Incorrect email or password');
        } else {
            showAlert('error', error.message || 'Failed to sign in. Please try again.');
        }
    }
}

// Email Verification Handler
window.verifyEmail = async function() {
    const code = document.getElementById('verificationCode').value;
    const email = pendingVerificationEmail;
    const verifyBtn = document.querySelector('#verificationModal .btn-primary');
    const btnText = verifyBtn.querySelector('.btn-text');
    const btnLoader = verifyBtn.querySelector('.btn-loader');

    if (!code || code.length !== 6) {
        showAlert('error', 'Please enter a valid 6-digit code');
        return;
    }

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    verifyBtn.disabled = true;

    try {
        if (DEVELOPMENT_MODE) {
            // Development mode - simulate verification
            console.log('DEV MODE: Simulating email verification for:', email);
            setTimeout(() => {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                verifyBtn.disabled = false;
                showAlert('success', 'Email verified successfully!');
                setTimeout(() => {
                    document.getElementById('verificationModal').style.display = 'none';
                    document.getElementById('verificationCode').value = '';
                    showSignIn();
                }, 1500);
            }, 1000);
        } else {
            // Production mode - use AWS Amplify
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: email,
                confirmationCode: code
            });

            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            verifyBtn.disabled = false;

            if (isSignUpComplete) {
                showAlert('success', 'Email verified successfully!');
                setTimeout(() => {
                    document.getElementById('verificationModal').style.display = 'none';
                    document.getElementById('verificationCode').value = '';
                    showSignIn();
                }, 1500);
            }
        }
    } catch (error) {
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        verifyBtn.disabled = false;
        console.error('Verification error:', error);
        showAlert('error', error.message || 'Invalid verification code');
    }
};

// Resend Verification Code
window.resendVerificationCode = async function() {
    const email = pendingVerificationEmail;
    
    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating resend code for:', email);
            showAlert('success', 'Verification code sent! Check your email.');
        } else {
            // In production, you would call resendSignUpCode
            showAlert('success', 'Verification code sent! Check your email.');
        }
    } catch (error) {
        console.error('Resend code error:', error);
        showAlert('error', 'Failed to resend code');
    }
};

// Forgot Password Handler
async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

    if (!email) {
        showAlert('error', 'Please enter your email address');
        return;
    }
    
    forgotPasswordBtn.classList.add('loading');

    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating password reset for:', email);
            setTimeout(() => {
                forgotPasswordBtn.classList.remove('loading');
                showAlert('success', 'Reset code sent! Check your email.');
                pendingVerificationEmail = email;
                showResetPassword();
            }, 1000);
        } else {
            const output = await resetPassword({ username: email });
            
            forgotPasswordBtn.classList.remove('loading');
            showAlert('success', 'Reset code sent! Check your email.');
            pendingVerificationEmail = email;
            showResetPassword();
        }
    } catch (error) {
        forgotPasswordBtn.classList.remove('loading');
        console.error('Forgot password error:', error);
        showAlert('error', error.message || 'Failed to send reset code');
    }
}

// Reset Password Handler
async function handleResetPassword(event) {
    event.preventDefault();
    const email = pendingVerificationEmail;
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');

    if (newPassword.length < 8) {
        showAlert('error', 'Password must be at least 8 characters long');
        return;
    }
    
    resetPasswordBtn.classList.add('loading');

    try {
        if (DEVELOPMENT_MODE) {
            console.log('DEV MODE: Simulating password reset completion for:', email);
            setTimeout(() => {
                resetPasswordBtn.classList.remove('loading');
                showAlert('success', 'Password reset successful! You can now sign in.');
                setTimeout(() => {
                    showSignIn();
                }, 1500);
            }, 1000);
        } else {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPassword
            });

            resetPasswordBtn.classList.remove('loading');
            showAlert('success', 'Password reset successful! You can now sign in.');
            setTimeout(() => {
                showSignIn();
            }, 1500);
        }
    } catch (error) {
        resetPasswordBtn.classList.remove('loading');
        console.error('Reset password error:', error);
        showAlert('error', error.message || 'Failed to reset password');
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

// Attach event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check auth status on page load
    checkAuthStatus();

    // Sign Up Form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
        console.log('Sign Up form listener attached');
    }

    // Sign In Form
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
        console.log('Sign In form listener attached');
    }

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
        console.log('Forgot Password form listener attached');
    }

    // Reset Password Form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
        console.log('Reset Password form listener attached');
    }

    console.log('AWS Amplify Auth initialized');
    console.log('Development Mode:', DEVELOPMENT_MODE);
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
            window.location.href = 'sign_in.html';
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
