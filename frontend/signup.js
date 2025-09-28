document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const successMessage = document.getElementById('successMessage');
    
    // Form fields
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    
    // Error message elements
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');
    
    // Password strength indicator
    const passwordStrength = document.getElementById('passwordStrength');
    
    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // Real-time validation functions
    function showError(field, errorElement, message) {
        field.parentElement.classList.add('error');
        field.parentElement.classList.remove('success');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function showSuccess(field, errorElement) {
        field.parentElement.classList.remove('error');
        field.parentElement.classList.add('success');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    function validateName(field, errorElement, fieldName) {
        const value = field.value.trim();
        if (value === '') {
            showError(field, errorElement, `${fieldName} is required`);
            return false;
        } else if (value.length < 2) {
            showError(field, errorElement, `${fieldName} must be at least 2 characters`);
            return false;
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
            showError(field, errorElement, `${fieldName} should only contain letters`);
            return false;
        } else {
            showSuccess(field, errorElement);
            return true;
        }
    }
    
    function validateEmail() {
        const value = email.value.trim();
        if (value === '') {
            showError(email, emailError, 'Email is required');
            return false;
        } else if (!emailPattern.test(value)) {
            showError(email, emailError, 'Please enter a valid email address');
            return false;
        } else {
            showSuccess(email, emailError);
            return true;
        }
    }
    
    function validatePhone() {
        const value = phone.value.trim();
        if (value !== '' && !phonePattern.test(value)) {
            showError(phone, phoneError, 'Please enter a valid phone number');
            return false;
        } else {
            showSuccess(phone, phoneError);
            return true;
        }
    }
    
    function validatePassword() {
        const value = password.value;
        
        if (value === '') {
            showError(password, passwordError, 'Password is required');
            passwordStrength.className = 'password-strength';
            return false;
        }
        
        let strength = 0;
        let messages = [];
        
        if (value.length < 8) {
            messages.push('at least 8 characters');
        } else {
            strength++;
        }
        
        if (!/(?=.*[a-z])/.test(value)) {
            messages.push('one lowercase letter');
        } else {
            strength++;
        }
        
        if (!/(?=.*[A-Z])/.test(value)) {
            messages.push('one uppercase letter');
        } else {
            strength++;
        }
        
        if (!/(?=.*\d)/.test(value)) {
            messages.push('one number');
        } else {
            strength++;
        }
        
        if (!/(?=.*[@$!%*?&])/.test(value)) {
            messages.push('one special character (@$!%*?&)');
        } else {
            strength++;
        }
        
        // Update password strength indicator
        if (strength < 3) {
            passwordStrength.className = 'password-strength weak';
        } else if (strength < 5) {
            passwordStrength.className = 'password-strength medium';
        } else {
            passwordStrength.className = 'password-strength strong';
        }
        
        if (messages.length > 0) {
            showError(password, passwordError, `Password must include: ${messages.join(', ')}`);
            return false;
        } else {
            showSuccess(password, passwordError);
            return true;
        }
    }
    
    function validateConfirmPassword() {
        const value = confirmPassword.value;
        const passwordValue = password.value;
        
        if (value === '') {
            showError(confirmPassword, confirmPasswordError, 'Please confirm your password');
            return false;
        } else if (value !== passwordValue) {
            showError(confirmPassword, confirmPasswordError, 'Passwords do not match');
            return false;
        } else {
            showSuccess(confirmPassword, confirmPasswordError);
            return true;
        }
    }
    
    function validateTerms() {
        if (!terms.checked) {
            showError(terms, termsError, 'You must agree to the Terms of Service and Privacy Policy');
            return false;
        } else {
            showSuccess(terms, termsError);
            return true;
        }
    }
    
    // Real-time validation event listeners
    firstName.addEventListener('blur', () => validateName(firstName, firstNameError, 'First name'));
    firstName.addEventListener('input', () => {
        if (firstName.parentElement.classList.contains('error')) {
            validateName(firstName, firstNameError, 'First name');
        }
    });
    
    lastName.addEventListener('blur', () => validateName(lastName, lastNameError, 'Last name'));
    lastName.addEventListener('input', () => {
        if (lastName.parentElement.classList.contains('error')) {
            validateName(lastName, lastNameError, 'Last name');
        }
    });
    
    email.addEventListener('blur', validateEmail);
    email.addEventListener('input', () => {
        if (email.parentElement.classList.contains('error')) {
            validateEmail();
        }
    });
    
    phone.addEventListener('blur', validatePhone);
    phone.addEventListener('input', () => {
        if (phone.parentElement.classList.contains('error')) {
            validatePhone();
        }
    });
    
    password.addEventListener('input', validatePassword);
    
    confirmPassword.addEventListener('blur', validateConfirmPassword);
    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.parentElement.classList.contains('error')) {
            validateConfirmPassword();
        }
    });
    
    terms.addEventListener('change', validateTerms);
    
    // Form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFirstNameValid = validateName(firstName, firstNameError, 'First name');
        const isLastNameValid = validateName(lastName, lastNameError, 'Last name');
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();
        
        // Check if all validations pass
        const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && 
                           isPhoneValid && isPasswordValid && isConfirmPasswordValid && isTermsValid;
        
        if (!isFormValid) {
            // Scroll to first error
            const firstError = signupForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.querySelector('input, textarea, select').focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline-flex';
        
        try {
            // Simulate API call
            await simulateSignup();
            
            // Show success message
            successMessage.style.display = 'block';
            signupForm.style.display = 'none';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred during signup. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        }
    });
    
    // Simulate signup API call
    async function simulateSignup() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    resolve({ message: 'Account created successfully' });
                } else {
                    reject(new Error('Signup failed'));
                }
            }, 2000); // 2 second delay to show loading state
        });
    }
    
    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
    
    // Form field focus animations
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Phone number formatting
    phone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('1')) {
            value = value.substring(1);
        }
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d+)/, '($1) $2');
        }
        
        if (value.length > 0) {
            value = '+1 ' + value;
        }
        
        e.target.value = value;
    });
    
    // Add smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.style.transform = 'scale(0.95)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 150);
        });
    });
});