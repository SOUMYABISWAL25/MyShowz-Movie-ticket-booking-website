// Sign In Page JavaScript

// Password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility for sign in form
    const toggleSigninPassword = document.getElementById('toggleSigninPassword');
    const signinPasswordInput = document.getElementById('signin-password');
    
    if (toggleSigninPassword && signinPasswordInput) {
        toggleSigninPassword.addEventListener('click', function() {
            const type = signinPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            signinPasswordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Toggle password visibility for sign up form
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    const signupPasswordInput = document.getElementById('signup-password');
    
    if (toggleSignupPassword && signupPasswordInput) {
        toggleSignupPassword.addEventListener('click', function() {
            const type = signupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            signupPasswordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('confirm-password');
    const signupPassword = document.getElementById('signup-password');
    
    if (confirmPasswordInput && signupPassword) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== signupPassword.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
        
        signupPassword.addEventListener('input', function() {
            if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
                confirmPasswordInput.setCustomValidity('Passwords do not match');
            } else {
                confirmPasswordInput.setCustomValidity('');
            }
        });
    }
    
    // Form submission loading states
    const signinForm = document.querySelector('form[name="sign-in-form"]');
    const signupForm = document.querySelector('form[name="sign-up-form"]');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('.signin-btn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function() {
            const submitBtn = this.querySelector('.signin-btn');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    }
});

// Form validation functions - these now call the Amplify auth functions
function signInValidateForm() {
    const email = document.forms["sign-in-form"]["sign-in-email"].value;
    const password = document.forms["sign-in-form"]["sign-in-passwd"].value;
    
    if (email === "") {
        showAlert("error", "Empty Field", "Email address is required!");
        return false;
    }
    
    if (!isValidEmail(email)) {
        showAlert("error", "Invalid Email", "Please enter a valid email address!");
        return false;
    }
    
    if (password === "") {
        showAlert("error", "Empty Field", "Password is required!");
        return false;
    }
    
    if (password.length < 6) {
        showAlert("error", "Invalid Password", "Password must be at least 6 characters long!");
        return false;
    }
    
    // Call the Amplify sign in function
    if (typeof signIn === 'function') {
        signIn(email, password);
    } else {
        showAlert("error", "Error", "Authentication service not available");
    }
    
    return false; // Prevent form submission
}

function signUpValidateForm() {
    const name = document.forms["sign-up-form"]["sign-up-name"].value;
    const email = document.forms["sign-up-form"]["sign-up-email"].value;
    const password = document.forms["sign-up-form"]["sign-up-passwd"].value;
    const confirmPassword = document.forms["sign-up-form"]["confirm-password"].value;
    const agreeTerms = document.getElementById("agreeTerms").checked;
    
    if (name === "") {
        showAlert("error", "Empty Field", "Full name is required!");
        return false;
    }
    
    if (name.length < 2) {
        showAlert("error", "Invalid Name", "Name must be at least 2 characters long!");
        return false;
    }
    
    if (email === "") {
        showAlert("error", "Empty Field", "Email address is required!");
        return false;
    }
    
    if (!isValidEmail(email)) {
        showAlert("error", "Invalid Email", "Please enter a valid email address!");
        return false;
    }
    
    if (password === "") {
        showAlert("error", "Empty Field", "Password is required!");
        return false;
    }
    
    if (password.length < 8) {
        showAlert("error", "Invalid Password", "Password must be at least 8 characters long!");
        return false;
    }
    
    if (confirmPassword === "") {
        showAlert("error", "Empty Field", "Please confirm your password!");
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert("error", "Password Mismatch", "Passwords do not match!");
        return false;
    }
    
    if (!agreeTerms) {
        showAlert("error", "Terms Required", "You must agree to the Terms and Conditions!");
        return false;
    }
    
    // Call the Amplify sign up function
    if (typeof signUp === 'function') {
        signUp(email, password, name);
    } else {
        showAlert("error", "Error", "Authentication service not available");
    }
    
    return false; // Prevent form submission
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Alert message function
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
        // Fallback alert if asAlertMsg is not available
        alert(`${title}: ${message}`);
    }
}

// Social login handlers are now handled by the auth.js file
// The buttons call signInWithGoogle() and signInWithFacebook() functions

// Forgot password handler is now handled by the auth.js file
// The link calls showForgotPasswordModal() function

// Form field animations
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.signin-form .form-group');
    
    // Add animation delay to form groups
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });
});

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('#signinTabs .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and panes
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding tab pane
            const targetId = this.getAttribute('href').substring(1);
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
            
            // Add fade effect to form containers
            const formContainers = document.querySelectorAll('.signin-form-container');
            formContainers.forEach(container => {
                container.style.opacity = '0';
                container.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    container.style.opacity = '1';
                    container.style.transform = 'translateY(0)';
                }, 150);
            });
        });
    });
    
    // Initialize Bootstrap tabs if available
    if (typeof $ !== 'undefined' && $.fn.tab) {
        $('#signinTabs a').on('click', function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    }
});
