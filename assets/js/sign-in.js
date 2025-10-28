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
    
    // Form submission is handled by amplify-auth-standalone.js
    // This file only handles UI interactions
});

// Form validation and submission are handled by amplify-auth-standalone.js
// This file only handles UI interactions like password visibility toggle and tab switching

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
