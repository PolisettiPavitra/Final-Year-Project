// DOM elements
const roleBtns = document.querySelectorAll('.role-btn');
const switchIndicator = document.querySelector('.switch-indicator');
const loginTitle = document.getElementById('loginTitle');
const loginForms = document.querySelectorAll('.login-form');
const signupLink = document.querySelector('.sign-up');

// Current active role
let currentRole = 'user';

// Role configurations
const roleConfig = {
    user: {
        title: 'User Login',
        form: document.getElementById('userForm')
    },
    staff: {
        title: 'Staff Login',
        form: document.getElementById('staffForm')
    },
    admin: {
        title: 'Admin Login',
        form: document.getElementById('adminForm')
    }
};

// Initialize the page
function init() {
    setupRoleSwitcher();
    setupFormValidation();
    setupEventListeners();
}

// Setup role switcher functionality
function setupRoleSwitcher() {
    roleBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            switchRole(role, index);
        });
    });
}

// Switch between roles
function switchRole(role, index) {
    if (role === currentRole) return;
    
    // Update button states
    roleBtns.forEach(btn => btn.classList.remove('active'));
    roleBtns[index].classList.add('active');
    
    // Move indicator
    switchIndicator.className = `switch-indicator ${role === 'user' ? '' : role}`;
    
    // Update title
    loginTitle.textContent = roleConfig[role].title;
    
    // Switch forms
    loginForms.forEach(form => {
        form.classList.remove('active');
        // Clear any existing errors when switching
        clearFormErrors(form);
    });
    
    setTimeout(() => {
        roleConfig[role].form.classList.add('active');
    }, 150);
    
    currentRole = role;
}

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateStaffId(staffId) {
    const staffIdRegex = /^ST-\d{4}$/;
    return staffIdRegex.test(staffId);
}

function validateAuthCode(code) {
    const authCodeRegex = /^\d{6}$/;
    return authCodeRegex.test(code);
}

function showError(input, message) {
    removeError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.classList.add('error');
    input.parentNode.appendChild(errorDiv);
}

function removeError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    input.classList.remove('error');
}

function clearFormErrors(form) {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => removeError(input));
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup form validation
function setupFormValidation() {
    // User form validation
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', handleUserLogin);
    
    // Staff form validation
    const staffForm = document.getElementById('staffForm');
    staffForm.addEventListener('submit', handleStaffLogin);
    
    // Admin form validation
    const adminForm = document.getElementById('adminForm');
    adminForm.addEventListener('submit', handleAdminLogin);
    
    // Real-time validation
    setupRealTimeValidation();
}

function handleUserLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (validateUserForm(email, password)) {
        performLogin('user', { email, password, rememberMe });
    }
}

function handleStaffLogin(e) {
    e.preventDefault();
    
    const staffId = document.getElementById('staffId').value.trim();
    const email = document.getElementById('staffEmail').value.trim();
    const password = document.getElementById('staffPassword').value.trim();
    const department = document.getElementById('department').value;
    
    if (validateStaffForm(staffId, email, password, department)) {
        performLogin('staff', { staffId, email, password, department });
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const authCode = document.getElementById('authCode').value.trim();
    const secureSession = document.getElementById('secureSession').checked;
    
    if (validateAdminForm(username, password, authCode)) {
        performLogin('admin', { username, password, authCode, secureSession });
    }
}

function validateUserForm(email, password) {
    let isValid = true;
    
    if (!email) {
        showError(document.getElementById('userEmail'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(document.getElementById('userEmail'), 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError(document.getElementById('userPassword'), 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(document.getElementById('userPassword'), 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateStaffForm(staffId, email, password, department) {
    let isValid = true;
    
    if (!staffId) {
        showError(document.getElementById('staffId'), 'Staff ID is required');
        isValid = false;
    } else if (!validateStaffId(staffId)) {
        showError(document.getElementById('staffId'), 'Staff ID must be in format ST-XXXX');
        isValid = false;
    }
    
    if (!email) {
        showError(document.getElementById('staffEmail'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(document.getElementById('staffEmail'), 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError(document.getElementById('staffPassword'), 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(document.getElementById('staffPassword'), 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!department) {
        showError(document.getElementById('department'), 'Please select a department');
        isValid = false;
    }
    
    return isValid;
}

function validateAdminForm(username, password, authCode) {
    let isValid = true;
    
    if (!username) {
        showError(document.getElementById('adminUsername'), 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError(document.getElementById('adminUsername'), 'Username must be at least 3 characters');
        isValid = false;
    }
    
    if (!password) {
        showError(document.getElementById('adminPassword'), 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(document.getElementById('adminPassword'), 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!authCode) {
        showError(document.getElementById('authCode'), 'Authentication code is required');
        isValid = false;
    } else if (!validateAuthCode(authCode)) {
        showError(document.getElementById('authCode'), 'Authentication code must be 6 digits');
        isValid = false;
    }
    
    return isValid;
}

function performLogin(role, credentials) {
    const activeForm = roleConfig[role].form;
    const loginBtn = activeForm.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    loginBtn.style.opacity = '0.7';
    
    // Simulate different loading times for different roles
    const loadingTime = role === 'admin' ? 2000 : 1500;
    
    setTimeout(() => {
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
        
        showNotification(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful! Redirecting...`);
        
        console.log(`${role} login successful:`, { 
            ...credentials, 
            password: '***',
            authCode: credentials.authCode ? '***' : undefined 
        });
        
        // Here you would redirect based on role
        setTimeout(() => {
            console.log(`Redirecting to ${role} dashboard...`);
        }, 1000);
        
    }, loadingTime);
}

function setupRealTimeValidation() {
    // User form real-time validation
    document.getElementById('userEmail').addEventListener('input', function() {
        if (this.value.trim() && validateEmail(this.value.trim())) {
            removeError(this);
        }
    });
    
    document.getElementById('userPassword').addEventListener('input', function() {
        if (this.value.trim() && validatePassword(this.value.trim())) {
            removeError(this);
        }
    });
    
    // Staff form real-time validation
    document.getElementById('staffId').addEventListener('input', function() {
        if (this.value.trim() && validateStaffId(this.value.trim())) {
            removeError(this);
        }
    });
    
    document.getElementById('staffEmail').addEventListener('input', function() {
        if (this.value.trim() && validateEmail(this.value.trim())) {
            removeError(this);
        }
    });
    
    document.getElementById('staffPassword').addEventListener('input', function() {
        if (this.value.trim() && validatePassword(this.value.trim())) {
            removeError(this);
        }
    });
    
    // Admin form real-time validation
    document.getElementById('adminUsername').addEventListener('input', function() {
        if (this.value.trim() && this.value.trim().length >= 3) {
            removeError(this);
        }
    });
    
    document.getElementById('adminPassword').addEventListener('input', function() {
        if (this.value.trim() && validatePassword(this.value.trim())) {
            removeError(this);
        }
    });
    
    document.getElementById('authCode').addEventListener('input', function() {
        if (this.value.trim() && validateAuthCode(this.value.trim())) {
            removeError(this);
        }
    });
}

function setupEventListeners() {
    // Sign up link
    signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Redirecting to sign up page...', 'info');
        console.log('Redirecting to sign up page');
    });
    
    // Help links
    const helpLinks = document.querySelectorAll('.help-link');
    helpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Contacting IT Support...', 'info');
            console.log('Opening IT support contact');
        });
    });
    
    // Sign up links in forms
    const signupFormLinks = document.querySelectorAll('.signup-link-btn');
    signupFormLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirecting to sign up page...', 'info');
            console.log('Redirecting to sign up page');
        });
    });
}

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
init();