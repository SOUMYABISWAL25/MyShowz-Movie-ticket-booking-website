import { Auth } from 'aws-amplify';

async function signIn(email, password) {
    try {
        const user = await Auth.signIn(email, password);
        console.log('Sign in success:', user);
        asAlert({
            type: 'success',
            title: 'Success!',
            message: 'Successfully signed in!'
        });
        // Redirect to home page after successful login
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing in:', error);
        asAlert({
            type: 'error',
            title: 'Error!',
            message: error.message || 'Error signing in'
        });
    }
}

async function signUp(email, password, name) {
    try {
        const { user } = await Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                name
            }
        });
        console.log('Sign up success:', user);
        asAlert({
            type: 'success',
            title: 'Success!',
            message: 'Please check your email for verification code'
        });
        // You might want to show a verification code input form here
    } catch (error) {
        console.error('Error signing up:', error);
        asAlert({
            type: 'error',
            title: 'Error!',
            message: error.message || 'Error signing up'
        });
    }
}

async function confirmSignUp(email, code) {
    try {
        await Auth.confirmSignUp(email, code);
        asAlert({
            type: 'success',
            title: 'Success!',
            message: 'Email verified successfully!'
        });
        // Redirect to sign in
        const container = document.getElementById('container_signup_signin');
        container.classList.remove('right-panel-active');
    } catch (error) {
        console.error('Error confirming sign up:', error);
        asAlert({
            type: 'error',
            title: 'Error!',
            message: error.message || 'Error confirming signup'
        });
    }
}

async function forgotPassword(email) {
    try {
        await Auth.forgotPassword(email);
        asAlert({
            type: 'success',
            title: 'Success!',
            message: 'Password reset code sent to your email'
        });
    } catch (error) {
        console.error('Error initiating forgot password:', error);
        asAlert({
            type: 'error',
            title: 'Error!',
            message: error.message || 'Error initiating password reset'
        });
    }
}

window.signInValidateForm = function() {
    const email = document.forms["sign-in-form"]["sign-in-email"].value;
    const password = document.forms["sign-in-form"]["sign-in-passwd"].value;
    
    if (email === "" || password === "") {
        asAlert({
            type: 'error',
            title: 'Error!',
            message: 'All fields must be filled out'
        });
        return false;
    }
    
    signIn(email, password);
    return false; // Prevent form submission
};

window.signUpValidateForm = function() {
    const name = document.forms["sign-up-form"]["sign-up-name"].value;
    const email = document.forms["sign-up-form"]["sign-up-email"].value;
    const password = document.forms["sign-up-form"]["sign-up-passwd"].value;
    
    if (name === "" || email === "" || password === "") {
        asAlert({
            type: 'error',
            title: 'Error!',
            message: 'All fields must be filled out'
        });
        return false;
    }
    
    signUp(email, password, name);
    return false; // Prevent form submission
};