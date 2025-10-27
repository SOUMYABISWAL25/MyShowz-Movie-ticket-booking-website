// Simple authentication functions without modules
// This ensures compatibility and proper function availability

console.log('Loading auth-simple.js');

// Mock Auth object for development
const MockAuth = {
    currentAuthenticatedUser: async () => {
        throw new Error('Not authenticated');
    },
    signIn: async (email, password) => {
        console.log('Mock signIn called with:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            username: email,
            attributes: { email, name: 'Test User' }
        };
    },
    signUp: async ({ username, password, attributes }) => {
        console.log('Mock signUp called with:', username);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            user: {
                username,
                attributes
            }
        };
    },
    confirmSignUp: async (email, code) => {
        console.log('Mock confirmSignUp called with:', email, code);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (code === '123456') {
            return { success: true };
        } else {
            throw new Error('Invalid verification code');
        }
    },
    forgotPassword: async (email) => {
        console.log('Mock forgotPassword called with:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    },
    forgotPasswordSubmit: async (email, code, newPassword) => {
        console.log('Mock forgotPasswordSubmit called');
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (code === '123456') {
            return { success: true };
        } else {
            throw new Error('Invalid verification code');
        }
    },
    resendSignUpCode: async (email) => {
        console.log('Mock resendSignUpCode called with:', email);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    },
    signOut: async () => {
        return { success: true };
    }
};

// Use mock Auth for development
const Auth = MockAuth;

// Global variables
let currentUser = null;
let verificationEmail = '';

// Helper functions
function showAlert(type, title, message) {
    console.log(`Alert [${type}]: ${title} - ${message}`);
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
        alert(`${title}: ${message}`);
    }
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Authentication functions
async function signIn(email, password) {
    try {
        showLoading(true);
        console.log('SignIn function called with:', email);
        const user = await Auth.signIn(email, password);
        console.log('Sign in success:', user);
        
        showAlert('success', 'Success!', 'Successfully signed in!');
        currentUser = user;
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Error signing in:', error);
        showAlert('error', 'Sign In Error', error.message || 'Error signing in');
    } finally {
        showLoading(false);
    }
}

async function signUp(email, password, name) {
    try {
        showLoading(true);
        console.log('SignUp function called with:', email, name);
        
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
        
        showAlert('success', 'Account Created!', 'Please check your email for verification code. Use code: 123456 for testing.');
        
        setTimeout(() => {
            showEmailVerificationModal();
        }, 1000);
        
    } catch (error) {
        console.error('Error signing up:', error);
        showAlert('error', 'Sign Up Error', error.message || 'Error creating account');
    } finally {
        showLoading(false);
    }
}

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
        
        const signinTab = document.getElementById('signin-tab');
        if (signinTab) {
            signinTab.click();
        }
        
    } catch (error) {
        console.error('Error confirming sign up:', error);
        showAlert('error', 'Verification Error', error.message || 'Error verifying email');
    } finally {
        showLoading(false);
    }
}

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
        
        document.getElementById('forgotPasswordStep1').style.display = 'none';
        document.getElementById('forgotPasswordStep2').style.display = 'block';
        document.getElementById('forgotPasswordBtn').innerHTML = 'Reset Password';
        document.getElementById('forgotPasswordBtn').setAttribute('onclick', 'resetPassword()');
        
    } catch (error) {
        console.error('Error initiating forgot password:', error);
        showAlert('error', 'Reset Error', error.message || 'Error sending reset code');
    } finally {
        showLoading(false);
    }
}

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
        
        const signinTab = document.getElementById('signin-tab');
        if (signinTab) {
            signinTab.click();
        }
        
    } catch (error) {
        console.error('Error resetting password:', error);
        showAlert('error', 'Reset Error', error.message || 'Error resetting password');
    } finally {
        showLoading(false);
    }
}

// UI Helper Functions
function showEmailVerificationModal() {
    console.log('Showing email verification modal for:', verificationEmail);
    
    const emailField = document.getElementById('verificationEmail');
    if (emailField) {
        emailField.value = verificationEmail;
    }
    
    const codeField = document.getElementById('verificationCode');
    if (codeField) {
        codeField.value = '';
    }
    
    const modal = document.getElementById('verificationModal');
    if (modal) {
        if (typeof $ !== 'undefined' && $.fn.modal) {
            $('#verificationModal').modal('show');
        } else {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    } else {
        console.error('Verification modal not found');
    }
}

function showForgotPasswordModal() {
    console.log('Showing forgot password modal');
    
    const step1 = document.getElementById('forgotPasswordStep1');
    const step2 = document.getElementById('forgotPasswordStep2');
    const btn = document.getElementById('forgotPasswordBtn');
    
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
    if (btn) {
        btn.innerHTML = 'Send Reset Code';
        btn.setAttribute('onclick', 'initiatePasswordReset()');
    }
    
    const signinEmail = document.getElementById('signin-email').value;
    const resetEmailField = document.getElementById('resetEmail');
    if (signinEmail && resetEmailField) {
        resetEmailField.value = signinEmail;
    }
    
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        if (typeof $ !== 'undefined' && $.fn.modal) {
            $('#forgotPasswordModal').modal('show');
        } else {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }
}

// Form validation functions
function signInValidateForm() {
    console.log('signInValidateForm called');
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
    return false;
}

function signUpValidateForm() {
    console.log('signUpValidateForm called');
    
    const name = document.forms["sign-up-form"]["sign-up-name"].value;
    const email = document.forms["sign-up-form"]["sign-up-email"].value;
    const password = document.forms["sign-up-form"]["sign-up-passwd"].value;
    const confirmPassword = document.forms["sign-up-form"]["confirm-password"].value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    
    console.log('Form values:', { name, email, password: '***', confirmPassword: '***', agreeTerms });
    
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
    
    console.log('All validations passed, calling signUp function');
    signUp(email, password, name);
    return false;
}

// Social login functions
function signInWithGoogle() {
    showAlert('info', 'Google Sign In', 'Google sign-in requires additional OAuth configuration in AWS Cognito');
}

function signInWithFacebook() {
    showAlert('info', 'Facebook Sign In', 'Facebook sign-in requires additional OAuth configuration in AWS Cognito');
}

// Export functions to global scope
window.signIn = signIn;
window.signUp = signUp;
window.confirmEmailVerification = confirmEmailVerification;
window.resendVerificationCode = resendVerificationCode;
window.initiatePasswordReset = initiatePasswordReset;
window.resetPassword = resetPassword;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.showForgotPasswordModal = showForgotPasswordModal;
window.showEmailVerificationModal = showEmailVerificationModal;
window.signInValidateForm = signInValidateForm;
window.signUpValidateForm = signUpValidateForm;

console.log('Auth functions exported to global scope:', {
    signIn: typeof window.signIn,
    signUp: typeof window.signUp,
    signUpValidateForm: typeof window.signUpValidateForm
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, auth functions ready');
    
    // Test if functions are available
    console.log('Function availability test:', {
        signUpValidateForm: typeof window.signUpValidateForm,
        signInValidateForm: typeof window.signInValidateForm,
        signUp: typeof window.signUp
    });
});

