#!/usr/bin/env node

/**
 * Amplify Configuration Update Script
 * 
 * This script helps you update the Amplify configuration in your frontend
 * after deploying your backend.
 * 
 * Usage:
 *   node update-amplify-config.js
 * 
 * Or with parameters:
 *   node update-amplify-config.js --userPoolId=YOUR_POOL_ID --clientId=YOUR_CLIENT_ID
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// File paths
const AMPLIFY_AUTH_FILE = path.join(__dirname, 'assets', 'js', 'amplify-auth.js');
const AWS_CONFIG_FILE = path.join(__dirname, 'assets', 'js', 'aws-config.js');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
    console.log(colorize(message, color));
}

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

// Parse command line arguments
function parseArgs() {
    const args = {};
    process.argv.slice(2).forEach(arg => {
        const [key, value] = arg.replace('--', '').split('=');
        args[key] = value;
    });
    return args;
}

async function getUserPoolId(args) {
    if (args.userPoolId) return args.userPoolId;
    
    log('\n🔑 Enter your AWS Cognito User Pool ID', 'blue');
    log('   (e.g., ap-south-1_AbCdEfGhI)', 'yellow');
    log('   Find it in AWS Console > Cognito > User Pools\n', 'yellow');
    
    const poolId = await prompt('User Pool ID: ');
    
    if (!poolId || poolId === '') {
        log('❌ User Pool ID is required!', 'red');
        process.exit(1);
    }
    
    return poolId;
}

async function getClientId(args) {
    if (args.clientId) return args.clientId;
    
    log('\n🔑 Enter your App Client ID', 'blue');
    log('   (e.g., 1a2b3c4d5e6f7g8h9i0j1k2l3m)', 'yellow');
    log('   Find it in AWS Console > Cognito > User Pools > App Integration\n', 'yellow');
    
    const clientId = await prompt('App Client ID: ');
    
    if (!clientId || clientId === '') {
        log('❌ App Client ID is required!', 'red');
        process.exit(1);
    }
    
    return clientId;
}

function updateAmplifyAuthFile(userPoolId, clientId) {
    try {
        let content = fs.readFileSync(AMPLIFY_AUTH_FILE, 'utf8');
        
        // Update userPoolId
        content = content.replace(
            /userPoolId:\s*['"].*?['"]/,
            `userPoolId: '${userPoolId}'`
        );
        
        // Update userPoolClientId
        content = content.replace(
            /userPoolClientId:\s*['"].*?['"]/,
            `userPoolClientId: '${clientId}'`
        );
        
        fs.writeFileSync(AMPLIFY_AUTH_FILE, content, 'utf8');
        log('✅ Updated assets/js/amplify-auth.js', 'green');
        
        return true;
    } catch (error) {
        log(`❌ Failed to update amplify-auth.js: ${error.message}`, 'red');
        return false;
    }
}

function updateAwsConfigFile(userPoolId, clientId) {
    try {
        let content = fs.readFileSync(AWS_CONFIG_FILE, 'utf8');
        
        // Extract region from userPoolId
        const region = userPoolId.split('_')[0];
        
        // Update configurations
        content = content.replace(
            /aws_user_pools_id:\s*['"].*?['"]/,
            `aws_user_pools_id: '${userPoolId}'`
        );
        
        content = content.replace(
            /aws_user_pools_web_client_id:\s*['"].*?['"]/,
            `aws_user_pools_web_client_id: '${clientId}'`
        );
        
        content = content.replace(
            /aws_cognito_region:\s*['"].*?['"]/g,
            `aws_cognito_region: '${region}'`
        );
        
        content = content.replace(
            /aws_project_region:\s*['"].*?['"]/,
            `aws_project_region: '${region}'`
        );
        
        // Set development mode to false
        content = content.replace(
            /const DEVELOPMENT_MODE\s*=\s*true/,
            'const DEVELOPMENT_MODE = false'
        );
        
        fs.writeFileSync(AWS_CONFIG_FILE, content, 'utf8');
        log('✅ Updated assets/js/aws-config.js', 'green');
        
        return true;
    } catch (error) {
        log(`❌ Failed to update aws-config.js: ${error.message}`, 'red');
        return false;
    }
}

function validatePoolId(poolId) {
    // Format: region_randomString (e.g., ap-south-1_AbCdEfGhI)
    const regex = /^[a-z]{2}-[a-z]+-\d+_[a-zA-Z0-9]+$/;
    return regex.test(poolId);
}

function validateClientId(clientId) {
    // Format: alphanumeric string (typically 26 characters)
    return /^[a-zA-Z0-9]{20,}$/.test(clientId);
}

async function main() {
    log('\n' + '='.repeat(60), 'bright');
    log('🚀 AWS Amplify Configuration Updater', 'bright');
    log('='.repeat(60) + '\n', 'bright');
    
    log('This script will update your Amplify configuration with', 'blue');
    log('your AWS Cognito User Pool credentials.\n', 'blue');
    
    const args = parseArgs();
    
    // Get User Pool ID
    const userPoolId = await getUserPoolId(args);
    if (!validatePoolId(userPoolId)) {
        log('⚠️  Warning: User Pool ID format looks incorrect', 'yellow');
        log('   Expected format: region_randomString (e.g., ap-south-1_AbCdEfGhI)\n', 'yellow');
        
        const confirm = await prompt('Continue anyway? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            log('❌ Configuration cancelled', 'red');
            process.exit(1);
        }
    }
    
    // Get Client ID
    const clientId = await getClientId(args);
    if (!validateClientId(clientId)) {
        log('⚠️  Warning: Client ID format looks incorrect', 'yellow');
        log('   Expected: alphanumeric string (typically 26 characters)\n', 'yellow');
        
        const confirm = await prompt('Continue anyway? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            log('❌ Configuration cancelled', 'red');
            process.exit(1);
        }
    }
    
    // Extract region
    const region = userPoolId.split('_')[0];
    
    // Summary
    log('\n' + '-'.repeat(60), 'bright');
    log('📋 Configuration Summary', 'bright');
    log('-'.repeat(60), 'bright');
    log(`Region:        ${region}`, 'blue');
    log(`User Pool ID:  ${userPoolId}`, 'blue');
    log(`Client ID:     ${clientId}`, 'blue');
    log('-'.repeat(60) + '\n', 'bright');
    
    const confirm = await prompt('Update configuration files? (y/n): ');
    
    if (confirm.toLowerCase() !== 'y') {
        log('❌ Configuration cancelled', 'red');
        rl.close();
        process.exit(0);
    }
    
    log('\n📝 Updating configuration files...\n', 'bright');
    
    // Update files
    const success1 = updateAmplifyAuthFile(userPoolId, clientId);
    const success2 = updateAwsConfigFile(userPoolId, clientId);
    
    if (success1 && success2) {
        log('\n' + '='.repeat(60), 'green');
        log('✅ Configuration Updated Successfully!', 'green');
        log('='.repeat(60) + '\n', 'green');
        
        log('📌 Next Steps:', 'bright');
        log('   1. Open sign_in.html in your browser', 'blue');
        log('   2. Try creating a new account', 'blue');
        log('   3. Check your email for verification code', 'blue');
        log('   4. Complete the sign-up process\n', 'blue');
        
        log('🔍 To verify configuration:', 'yellow');
        log('   - Check browser console for "AWS Amplify configured successfully"', 'yellow');
        log('   - No "DEVELOPMENT MODE" warnings should appear\n', 'yellow');
    } else {
        log('\n❌ Configuration update failed!', 'red');
        log('Please check the error messages above and try again.\n', 'red');
    }
    
    rl.close();
}

// Run the script
main().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
});
