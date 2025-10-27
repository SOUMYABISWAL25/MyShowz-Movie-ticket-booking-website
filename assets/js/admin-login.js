// Admin Login JavaScript

console.log('Loading admin-login.js');

// Initialize admin login
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin login initialized');
    setupEventListeners();
    setupAnimations();
});

// Setup event listeners
function setupEventListeners() {
    // Password visibility toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form submission
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
    
    // Enter key on inputs
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdminLogin();
            }
        });
    });
}

// Setup animations
function setupAnimations() {
    // Add animation delay to form elements
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });
}

// Handle admin login
function handleAdminLogin() {
    console.log('Handling admin login');
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validate inputs
    if (!email || !password) {
        showAlert('error', 'Error', 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('error', 'Error', 'Please enter a valid email address');
        return;
    }
    
    // Show loading state
    showLoading(true);
    
    // Simulate admin login (in real app, this would be an API call)
    setTimeout(() => {
        // Mock admin credentials for demo
        if (email === 'admin@myshowz.com' && password === 'admin123') {
            console.log('Admin login successful');
            showAlert('success', 'Login Successful', 'Welcome to the admin panel!');
            
            // Store admin session
            if (rememberMe) {
                localStorage.setItem('adminSession', 'true');
                localStorage.setItem('adminEmail', email);
            } else {
                sessionStorage.setItem('adminSession', 'true');
                sessionStorage.setItem('adminEmail', email);
            }
            
            // Redirect to admin panel
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            console.log('Admin login failed');
            showAlert('error', 'Login Failed', 'Invalid email or password');
        }
        
        showLoading(false);
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state
function showLoading(show) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (show) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }
}

// Show alert
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
        alert(`${title}: ${message}`);
    }
}

// Check if admin is already logged in
function checkAdminSession() {
    const adminSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');
    if (adminSession === 'true') {
        // Redirect to admin panel if already logged in
        window.location.href = 'admin.html';
    }
}

// Initialize session check
checkAdminSession();

console.log('Admin login functions loaded');

