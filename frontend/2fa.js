document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');
    const verifyBtn = document.getElementById('verifyBtn');
    const resendBtn = document.getElementById('resendBtn');
    const countdown = document.getElementById('countdown');
    const codeError = document.getElementById('codeError');
    const verificationForm = document.getElementById('verificationForm');
    const emailDisplay = document.getElementById('emailDisplay');
    
    let resendTimer = null;
    let resendCooldown = 60; // 60 seconds cooldown
    
    // Auto-focus first input
    codeInputs[0].focus();
    
    // Handle input navigation and validation
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Clear error styling
            clearError();
            
            // Move to next input if filled
            if (value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Check if all inputs are filled
            checkAllInputsFilled();
        });
        
        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace') {
                if (!input.value && index > 0) {
                    codeInputs[index - 1].focus();
                    codeInputs[index - 1].value = '';
                }
            }
            
            // Handle arrow keys
            if (e.key === 'ArrowLeft' && index > 0) {
                codeInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Handle paste
            if (e.key === 'Enter') {
                e.preventDefault();
                if (isAllInputsFilled()) {
                    verificationForm.dispatchEvent(new Event('submit'));
                }
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = e.clipboardData.getData('text');
            const numbers = paste.replace(/\D/g, '').slice(0, 6);
            
            if (numbers.length === 6) {
                codeInputs.forEach((inp, idx) => {
                    inp.value = numbers[idx] || '';
                });
                checkAllInputsFilled();
                codeInputs[5].focus();
            }
        });
    });
    
    // Form submission
    verificationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isAllInputsFilled()) {
            showError('Please enter the complete 6-digit code');
            return;
        }
        
        const code = getCodeValue();
        verifyCode(code);
    });
    
    // Resend code functionality
    resendBtn.addEventListener('click', function() {
        if (resendBtn.disabled) return;
        
        resendCode();
        startResendCooldown();
    });
    
    function checkAllInputsFilled() {
        const allFilled = isAllInputsFilled();
        verifyBtn.disabled = !allFilled;
        
        if (allFilled) {
            codeInputs.forEach(input => {
                input.classList.remove('error');
                input.classList.add('success');
            });
        } else {
            codeInputs.forEach(input => {
                input.classList.remove('success');
            });
        }
    }
    
    function isAllInputsFilled() {
        return Array.from(codeInputs).every(input => input.value.length === 1);
    }
    
    function getCodeValue() {
        return Array.from(codeInputs).map(input => input.value).join('');
    }
    
    function showError(message) {
        codeError.textContent = message;
        codeInputs.forEach(input => {
            input.classList.add('error');
            input.classList.remove('success');
        });
    }
    
    function clearError() {
        codeError.textContent = '';
        codeInputs.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    function verifyCode(code) {
        // Show loading state
        verifyBtn.classList.add('loading');
        verifyBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, accept any 6-digit code except 000000
            if (code === '000000') {
                showError('Invalid verification code. Please try again.');
                verifyBtn.classList.remove('loading');
                verifyBtn.disabled = false;
            } else if (code === '123456') {
                // Simulate correct code
                showSuccess();
                setTimeout(() => {
                    // Redirect to dashboard or next page
                    alert('Verification successful! Redirecting to dashboard...');
                    // window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showError('Invalid verification code. Please try again.');
                verifyBtn.classList.remove('loading');
                checkAllInputsFilled();
            }
        }, 2000); // Simulate network delay
    }
    
    function showSuccess() {
        codeInputs.forEach(input => {
            input.classList.remove('error');
            input.classList.add('success');
        });
        
        verifyBtn.classList.remove('loading');
        verifyBtn.textContent = 'Verified ✓';
        verifyBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        
        // Add success message
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Verification successful! Redirecting...';
        verificationForm.appendChild(successMsg);
    }
    
    function resendCode() {
        // Simulate sending new code
        const newCode = Math.floor(100000 + Math.random() * 900000);
        console.log('New verification code sent:', newCode); // For demo
        
        // Clear current inputs
        codeInputs.forEach(input => {
            input.value = '';
            input.classList.remove('error', 'success');
        });
        
        codeInputs[0].focus();
        clearError();
        
        // Show feedback
        const resendText = document.querySelector('.resend-text');
        const originalText = resendText.textContent;
        resendText.textContent = 'New code sent to your email!';
        resendText.style.color = '#27ae60';
        
        setTimeout(() => {
            resendText.textContent = originalText;
            resendText.style.color = '#666';
        }, 3000);
    }
    
    function startResendCooldown() {
        resendBtn.disabled = true;
        let timeLeft = resendCooldown;
        
        const updateCountdown = () => {
            countdown.textContent = `Resend available in ${timeLeft}s`;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                countdown.textContent = '';
            }
        };
        
        updateCountdown();
        resendTimer = setInterval(updateCountdown, 1000);
    }
    
    // Get email from URL params or localStorage (from login)
    function displayUserEmail() {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email') || localStorage.getItem('verificationEmail') || 'user@example.com';
        
        // Mask email for privacy
        const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');
        emailDisplay.textContent = `Code sent to: ${maskedEmail}`;
    }
    
    // Initialize
    displayUserEmail();
    startResendCooldown(); // Start initial cooldown
});