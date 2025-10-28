// AWS Amplify Authentication - Standalone Version (No Build Required)
// This version works directly in the browser without npm or build tools

// Development mode flag - set to false when you have AWS backend configured
const DEVELOPMENT_MODE = true;

// AWS Amplify Configuration (Update these after deploying your backend)
const amplifyConfig = {
    userPoolId: 'ap-south-1_XXXXXXXXX', // Replace with your User Pool ID
    userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
    region: 'ap-south-1'
};

// Store for pending verification
let pendingVerificationEmail = '';

// Helper function to show messages
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = `alert alert-${type === 'error' ? 'danger' : 'success'}`;
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

// Helper function to hide all messages
function hideAllMessages(prefix) {
    ['loading', 'error', 'success'].forEach(type => {
        const element = document.getElementById(`${prefix}-${type}`);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Sign Up Handler
function handleSignUp(event) {
    event.preventDefault();
    
    hideAllMessages('signup');
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validation
    if (!name) {
        showMessage('signup-error', 'Please enter your full name');
        return;
    }

    if (!email) {
        showMessage('signup-error', 'Please enter your email address');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('signup-error', 'Passwords do not match');
        return;
    }

    if (password.length < 8) {
        showMessage('signup-error', 'Password must be at least 8 characters long');
        return;
    }

    // Check password strength
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
        showMessage('signup-error', 'Password must contain uppercase, lowercase, and numbers');
        return;
    }

    if (!agreeTerms) {
        showMessage('signup-error', 'Please agree to the terms and conditions');
        return;
    }

    showLoading('signup-loading', true);

    // Simulate signup (Development mode)
    setTimeout(() => {
        showLoading('signup-loading', false);
        
        // Store user data in localStorage
        const userData = {
            name: name,
            email: email,
            password: password, // In production, this would be hashed by AWS
            verified: false,
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('pendingUser_' + email, JSON.stringify(userData));
        
        showMessage('signup-success', 'Account created! Please check your email for verification code.', 'success');
        
        // Show verification modal
        pendingVerificationEmail = email;
        document.getElementById('verificationEmail').value = email;
        
        setTimeout(() => {
            $('#verificationModal').modal('show');
        }, 1000);
        
        console.log('DEV MODE: Account created for:', email);
        console.log('DEV MODE: Use any 6-digit code to verify (e.g., 123456)');
    }, 1000);
}

// Sign In Handler
function handleSignIn(event) {
    event.preventDefault();
    
    hideAllMessages('signin');
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        showMessage('signin-error', 'Please enter email and password');
        return;
    }

    showLoading('signin-loading', true);

    // Simulate sign in (Development mode)
    setTimeout(() => {
        showLoading('signin-loading', false);
        
        // Check if user exists
        const userDataStr = localStorage.getItem('pendingUser_' + email);
        
        if (!userDataStr) {
            showMessage('signin-error', 'Account not found. Please sign up first.');
            return;
        }
        
        const userData = JSON.parse(userDataStr);
        
        // Check if verified
        if (!userData.verified) {
            showMessage('signin-error', 'Please verify your email first');
            pendingVerificationEmail = email;
            document.getElementById('verificationEmail').value = email;
            setTimeout(() => {
                $('#verificationModal').modal('show');
            }, 1500);
            return;
        }
        
        // Check password
        if (userData.password !== password) {
            showMessage('signin-error', 'Incorrect email or password');
            return;
        }
        
        // Success!
        showMessage('signin-success', 'Sign in successful! Redirecting...', 'success');
        
        // Store session
        const session = {
            email: email,
            name: userData.name,
            isAuthenticated: true,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userSession', JSON.stringify(session));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('DEV MODE: User signed in:', email);
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1000);
}

// Email Verification Handler
function handleVerifyEmail() {
    const code = document.getElementById('verificationCode').value.trim();
    const email = document.getElementById('verificationEmail').value;

    hideAllMessages('verification');

    if (!code) {
        showMessage('verification-error', 'Please enter the verification code');
        return;
    }

    if (code.length !== 6) {
        showMessage('verification-error', 'Verification code must be 6 digits');
        return;
    }

    // In development mode, accept any 6-digit code
    console.log('DEV MODE: Verifying email for:', email, 'with code:', code);
    
    // Get user data
    const userDataStr = localStorage.getItem('pendingUser_' + email);
    if (!userDataStr) {
        showMessage('verification-error', 'User not found');
        return;
    }
    
    const userData = JSON.parse(userDataStr);
    userData.verified = true;
    userData.verifiedAt = new Date().toISOString();
    
    // Save verified user
    localStorage.setItem('pendingUser_' + email, JSON.stringify(userData));
    
    showMessage('verification-success', 'Email verified successfully!', 'success');
    
    console.log('DEV MODE: Email verified for:', email);
    
    setTimeout(() => {
        $('#verificationModal').modal('hide');
        // Clear form
        document.getElementById('verificationCode').value = '';
        // Switch to sign in tab
        $('#signin-tab').tab('show');
        // Pre-fill email
        document.getElementById('signin-email').value = email;
    }, 1500);
}

// Resend Verification Code
function handleResendCode() {
    const email = document.getElementById('verificationEmail').value;
    
    hideAllMessages('verification');
    
    console.log('DEV MODE: Resending verification code to:', email);
    showMessage('verification-success', 'Verification code sent! Check your email. (DEV: Use any 6-digit code)', 'success');
}

// Forgot Password - Step 1: Send Reset Code
function handleForgotPassword() {
    const email = document.getElementById('resetEmail').value.trim();

    hideAllMessages('forgot');

    if (!email) {
        showMessage('forgot-error', 'Please enter your email address');
        return;
    }

    // Check if user exists
    const userDataStr = localStorage.getItem('pendingUser_' + email);
    if (!userDataStr) {
        showMessage('forgot-error', 'No account found with this email');
        return;
    }

    console.log('DEV MODE: Sending password reset code to:', email);
    
    showMessage('forgot-success', 'Reset code sent! Check your email. (DEV: Use any 6-digit code)', 'success');
    
    setTimeout(() => {
        document.getElementById('forgotPasswordStep1').style.display = 'none';
        document.getElementById('forgotPasswordStep2').style.display = 'block';
        document.getElementById('forgotPasswordBtn').textContent = 'Reset Password';
        document.getElementById('forgotPasswordBtn').onclick = handleResetPassword;
    }, 1000);
}

// Forgot Password - Step 2: Reset Password
function handleResetPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    const code = document.getElementById('resetCode').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    hideAllMessages('forgot');

    if (!code || code.length !== 6) {
        showMessage('forgot-error', 'Please enter a valid 6-digit code');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('forgot-error', 'Passwords do not match');
        return;
    }

    if (newPassword.length < 8) {
        showMessage('forgot-error', 'Password must be at least 8 characters long');
        return;
    }

    // Check password strength
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
        showMessage('forgot-error', 'Password must contain uppercase, lowercase, and numbers');
        return;
    }

    // Get user data
    const userDataStr = localStorage.getItem('pendingUser_' + email);
    if (!userDataStr) {
        showMessage('forgot-error', 'User not found');
        return;
    }

    const userData = JSON.parse(userDataStr);
    userData.password = newPassword;
    userData.passwordResetAt = new Date().toISOString();
    
    // Save updated user
    localStorage.setItem('pendingUser_' + email, JSON.stringify(userData));
    
    console.log('DEV MODE: Password reset successful for:', email);
    
    showMessage('forgot-success', 'Password reset successful! You can now sign in.', 'success');
    
    setTimeout(() => {
        $('#forgotPasswordModal').modal('hide');
        // Reset modal
        document.getElementById('forgotPasswordStep1').style.display = 'block';
        document.getElementById('forgotPasswordStep2').style.display = 'none';
        document.getElementById('forgotPasswordBtn').textContent = 'Send Reset Code';
        document.getElementById('forgotPasswordBtn').onclick = handleForgotPassword;
        // Clear forms
        document.getElementById('resetEmail').value = '';
        document.getElementById('resetCode').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
        // Switch to sign in tab
        $('#signin-tab').tab('show');
        // Pre-fill email
        document.getElementById('signin-email').value = email;
    }, 1500);
}

// Check if user is already signed in
function checkAuthStatus() {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
        const session = JSON.parse(sessionStr);
        console.log('User is authenticated:', session.email);
        // Optionally show a message or redirect
        // window.location.href = 'index.html';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('AWS Amplify Auth initialized (Development Mode)');
    console.log('To test: Sign up with any email, use any 6-digit code to verify');
    
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
        hideAllMessages('forgot');
    });

    // Reset verification modal when closed
    $('#verificationModal').on('hidden.bs.modal', function () {
        document.getElementById('verificationCode').value = '';
        hideAllMessages('verification');
    });
});

// Export functions for global access
window.amplifyAuth = {
    signOut: function() {
        localStorage.removeItem('userSession');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        console.log('User signed out');
        window.location.href = 'index.html';
    },
    getCurrentUser: function() {
        const sessionStr = localStorage.getItem('userSession');
        return sessionStr ? JSON.parse(sessionStr) : null;
    },
    isAuthenticated: function() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
};
