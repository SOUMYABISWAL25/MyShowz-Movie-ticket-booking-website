import { Auth } from 'aws-amplify';

// Global variables for tracking authentication state
let currentUser = null;
let verificationEmail = '';

// Initialize authentication state
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
});

// Check if user is already authenticated
async function checkAuthState() {
    try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
            currentUser = user;
            // Redirect to home page if already authenticated
            window.location.href = 'index.html';
        }
    } catch (error) {
        // User is not authenticated, stay on sign-in page
        console.log('User not authenticated');
    }
}

// Sign In function
async function signIn(email, password) {
    try {
        showLoading(true);
        const user = await Auth.signIn(email, password);
        console.log('Sign in success:', user);
        
        // Check if user needs to change password
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            showAlert('info', 'Password Change Required', 'Please set a new password.');
            // You can redirect to a password change page here
            return;
        }
        
        showAlert('success', 'Success!', 'Successfully signed in!');
        
        // Store user session
        currentUser = user;
        
        // Redirect to home page after successful login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Error signing in:', error);
        let errorMessage = 'Error signing in';
        
        if (error.code === 'NotAuthorizedException') {
            errorMessage = 'Incorrect email or password';
        } else if (error.code === 'UserNotConfirmedException') {
            errorMessage = 'Please verify your email address first';
            verificationEmail = email;
            showEmailVerificationModal();
        } else if (error.code === 'UserNotFoundException') {
            errorMessage = 'User not found. Please sign up first';
        } else if (error.code === 'TooManyRequestsException') {
            errorMessage = 'Too many failed attempts. Please try again later';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', 'Sign In Error', errorMessage);
    } finally {
        showLoading(false);
    }
}

// Sign Up function
async function signUp(email, password, name) {
    try {
        showLoading(true);
        const { user } = await Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name
            }
        });
        
        console.log('Sign up success:', user);
        verificationEmail = email;
        
        showAlert('success', 'Account Created!', 'Please check your email for verification code');
        showEmailVerificationModal();
        
    } catch (error) {
        console.error('Error signing up:', error);
        let errorMessage = 'Error creating account';
        
        if (error.code === 'UsernameExistsException') {
            errorMessage = 'An account with this email already exists';
        } else if (error.code === 'InvalidPasswordException') {
            errorMessage = 'Password does not meet requirements';
        } else if (error.code === 'InvalidParameterException') {
            errorMessage = 'Invalid email format';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', 'Sign Up Error', errorMessage);
    } finally {
        showLoading(false);
    }
}

// Confirm email verification
async function confirmEmailVerification() {
    const code = document.getElementById('verificationCode').value;
    
    if (!code) {
        showAlert('error', 'Error', 'Please enter verification code');
        return;
    }
    
    try {
        showLoading(true);
        await Auth.confirmSignUp(verificationEmail, code);
        
        showAlert('success', 'Email Verified!', 'Your email has been verified successfully!');
        $('#verificationModal').modal('hide');
        
        // Switch to sign in tab
        const signinTab = document.getElementById('signin-tab');
        if (signinTab) {
            signinTab.click();
        }
        
    } catch (error) {
        console.error('Error confirming sign up:', error);
        let errorMessage = 'Error verifying email';
        
        if (error.code === 'CodeMismatchException') {
            errorMessage = 'Invalid verification code';
        } else if (error.code === 'ExpiredCodeException') {
            errorMessage = 'Verification code has expired';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', 'Verification Error', errorMessage);
    } finally {
        showLoading(false);
    }
}

// Resend verification code
async function resendVerificationCode() {
    try {
        showLoading(true);
        await Auth.resendSignUpCode(verificationEmail);
        showAlert('success', 'Code Sent!', 'Verification code has been resent to your email');
    } catch (error) {
        console.error('Error resending code:', error);
        showAlert('error', 'Error', 'Failed to resend verification code');
    } finally {
        showLoading(false);
    }
}

// Forgot Password - Step 1: Send reset code
async function initiatePasswordReset() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showAlert('error', 'Error', 'Please enter your email address');
        return;
    }
    
    try {
        showLoading(true);
        await Auth.forgotPassword(email);
        
        showAlert('success', 'Reset Code Sent!', 'Password reset code sent to your email');
        
        // Show step 2
        document.getElementById('forgotPasswordStep1').style.display = 'none';
        document.getElementById('forgotPasswordStep2').style.display = 'block';
        document.getElementById('forgotPasswordBtn').innerHTML = 'Reset Password';
        document.getElementById('forgotPasswordBtn').setAttribute('onclick', 'resetPassword()');
        
    } catch (error) {
        console.error('Error initiating forgot password:', error);
        let errorMessage = 'Error sending reset code';
        
        if (error.code === 'UserNotFoundException') {
            errorMessage = 'No account found with this email address';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', 'Reset Error', errorMessage);
    } finally {
        showLoading(false);
    }
}

// Forgot Password - Step 2: Reset password
async function resetPassword() {
    const email = document.getElementById('resetEmail').value;
    const code = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!code || !newPassword || !confirmPassword) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showAlert('error', 'Error', 'Passwords do not match');
        return;
    }
    
    if (newPassword.length < 8) {
        showAlert('error', 'Error', 'Password must be at least 8 characters long');
        return;
    }
    
    try {
        showLoading(true);
        await Auth.forgotPasswordSubmit(email, code, newPassword);
        
        showAlert('success', 'Password Reset!', 'Your password has been reset successfully!');
        $('#forgotPasswordModal').modal('hide');
        
        // Switch to sign in tab
        const signinTab = document.getElementById('signin-tab');
        if (signinTab) {
            signinTab.click();
        }
        
    } catch (error) {
        console.error('Error resetting password:', error);
        let errorMessage = 'Error resetting password';
        
        if (error.code === 'CodeMismatchException') {
            errorMessage = 'Invalid verification code';
        } else if (error.code === 'ExpiredCodeException') {
            errorMessage = 'Verification code has expired';
        } else if (error.code === 'InvalidPasswordException') {
            errorMessage = 'Password does not meet requirements';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', 'Reset Error', errorMessage);
    } finally {
        showLoading(false);
    }
}

// Sign Out function
async function signOut() {
    try {
        await Auth.signOut();
        currentUser = null;
        showAlert('success', 'Signed Out', 'You have been signed out successfully');
        window.location.href = 'sign_in.html';
    } catch (error) {
        console.error('Error signing out:', error);
        showAlert('error', 'Error', 'Error signing out');
    }
}

// Social Sign In functions (placeholder - requires additional configuration)
async function signInWithGoogle() {
    showAlert('info', 'Google Sign In', 'Google sign-in requires additional OAuth configuration in AWS Cognito');
}

async function signInWithFacebook() {
    showAlert('info', 'Facebook Sign In', 'Facebook sign-in requires additional OAuth configuration in AWS Cognito');
}

// UI Helper Functions
function showEmailVerificationModal() {
    document.getElementById('verificationEmail').value = verificationEmail;
    $('#verificationModal').modal('show');
}

function showForgotPasswordModal() {
    // Reset the modal to step 1
    document.getElementById('forgotPasswordStep1').style.display = 'block';
    document.getElementById('forgotPasswordStep2').style.display = 'none';
    document.getElementById('forgotPasswordBtn').innerHTML = 'Send Reset Code';
    document.getElementById('forgotPasswordBtn').setAttribute('onclick', 'initiatePasswordReset()');
    
    // Pre-fill email if user is on sign-in tab
    const signinEmail = document.getElementById('signin-email').value;
    if (signinEmail) {
        document.getElementById('resetEmail').value = signinEmail;
    }
    
    $('#forgotPasswordModal').modal('show');
}

function showLoading(show) {
    const buttons = document.querySelectorAll('.signin-btn');
    buttons.forEach(button => {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    });
}

function showAlert(type, title, message) {
    if (typeof asAlertMsg === 'function') {
        asAlertMsg({
            type: type,
            title: title,
            message: message,
            button: {
                title: "Close",
                bg: "Close Button"
            }
        });
    } else {
        // Fallback alert
        alert(`${title}: ${message}`);
    }
}

// Form validation functions (called from HTML)
window.signInValidateForm = function() {
    const email = document.forms["sign-in-form"]["sign-in-email"].value;
    const password = document.forms["sign-in-form"]["sign-in-passwd"].value;
    
    if (!email || !password) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showAlert('error', 'Error', 'Please enter a valid email address');
        return false;
    }
    
    signIn(email, password);
    return false; // Prevent form submission
};

window.signUpValidateForm = function() {
    const name = document.forms["sign-up-form"]["sign-up-name"].value;
    const email = document.forms["sign-up-form"]["sign-up-email"].value;
    const password = document.forms["sign-up-form"]["sign-up-passwd"].value;
    const confirmPassword = document.forms["sign-up-form"]["confirm-password"].value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    
    if (!name || !email || !password || !confirmPassword) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showAlert('error', 'Error', 'Please enter a valid email address');
        return false;
    }
    
    if (password.length < 8) {
        showAlert('error', 'Error', 'Password must be at least 8 characters long');
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert('error', 'Error', 'Passwords do not match');
        return false;
    }
    
    if (!agreeTerms) {
        showAlert('error', 'Error', 'You must agree to the Terms and Conditions');
        return false;
    }
    
    signUp(email, password, name);
    return false; // Prevent form submission
};

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export functions for global access
window.signIn = signIn;
window.signUp = signUp;
window.confirmEmailVerification = confirmEmailVerification;
window.resendVerificationCode = resendVerificationCode;
window.initiatePasswordReset = initiatePasswordReset;
window.resetPassword = resetPassword;
window.signOut = signOut;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.showForgotPasswordModal = showForgotPasswordModal;
window.showEmailVerificationModal = showEmailVerificationModal;