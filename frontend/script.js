// Homepage JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initDropdownNavigation();
    initMobileNavigation();
    initDynamicCircles();
    initScrollAnimations();
    initTestimonialCarousel();
    initSmoothScrolling();
    initInteractiveElements();
});

// Desktop Dropdown Functionality
function initDropdownNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Prevent default click behavior for dropdown toggles
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Optional: Click to toggle on desktop (in addition to hover)
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
}

// Mobile Navigation Toggle
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Create mobile toggle if it doesn't exist
    if (!mobileToggle) {
        const navToggle = document.createElement('button');
        navToggle.classList.add('mobile-toggle');
        navToggle.innerHTML = '☰';
        
        const navContainer = document.querySelector('.nav-container');
        navContainer.appendChild(navToggle);
    }
    
    const toggle = document.querySelector('.mobile-toggle');
    
    // Mobile menu toggle
    toggle.addEventListener('click', function() {
        navMenu.classList.toggle('nav-menu-active');
        
        // Reset all dropdowns when opening/closing mobile menu
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Mobile dropdown functionality
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                
                // On mobile, toggle the dropdown
                if (window.innerWidth <= 768) {
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close mobile menu when clicking on a dropdown link
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('nav-menu-active');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
            navMenu.classList.remove('nav-menu-active');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('nav-menu-active');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// Dynamic Progress Circles for Money Usage
function initDynamicCircles() {
    const circles = document.querySelectorAll('.usage-circle');
    
    circles.forEach(circle => {
        const percentage = parseInt(circle.dataset.percentage);
        
        // Create SVG circle for progress
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '120');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('cx', '60');
        progressCircle.setAttribute('cy', '60');
        progressCircle.setAttribute('r', '50');
        progressCircle.setAttribute('fill', 'none');
        progressCircle.setAttribute('stroke', '#8B4513');
        progressCircle.setAttribute('stroke-width', '6');
        progressCircle.setAttribute('stroke-dasharray', `${percentage * 3.14} 314`);
        progressCircle.setAttribute('stroke-dashoffset', '78.5');
        progressCircle.style.transition = 'stroke-dasharray 2s ease-in-out';
        
        svg.appendChild(progressCircle);
        circle.insertBefore(svg, circle.firstChild);
        
        // Animate on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgress(progressCircle, percentage);
                }
            });
        });
        
        observer.observe(circle);
    });
}

function animateProgress(circle, targetPercentage) {
    let currentPercentage = 0;
    const increment = targetPercentage / 50; // 50 frames for smooth animation
    
    const animation = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(animation);
        }
        
        const circumference = 2 * Math.PI * 50;
        const progress = (currentPercentage / 100) * circumference;
        circle.setAttribute('stroke-dasharray', `${progress} ${circumference}`);
    }, 40);
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.preview-card, .testimonial-card, .info-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Testimonial Carousel (if more testimonials are added)
function initTestimonialCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    // Add carousel functionality if there are more than 3 testimonials
    if (testimonialCards.length > 3) {
        const container = document.querySelector('.testimonial-cards');
        
        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '‹';
        prevBtn.classList.add('carousel-btn', 'prev-btn');
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '›';
        nextBtn.classList.add('carousel-btn', 'next-btn');
        
        container.parentNode.insertBefore(prevBtn, container);
        container.parentNode.appendChild(nextBtn);
        
        // Navigation functionality
        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', () => {
            currentTestimonial = currentTestimonial === 0 ? testimonialCards.length - 1 : currentTestimonial - 1;
            updateCarousel();
        });
        
        function updateCarousel() {
            testimonialCards.forEach((card, index) => {
                card.style.display = index === currentTestimonial ? 'block' : 'none';
            });
        }
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            updateCarousel();
        }, 5000);
        
        updateCarousel();
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply smooth scrolling to anchor links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    navMenu.classList.remove('nav-menu-active');
                }
            }
        });
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Add click handlers for info section items
    const infoItems = document.querySelectorAll('.info-section li');
    
    infoItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add click feedback
            this.style.backgroundColor = '#e0d8c8';
            setTimeout(() => {
                this.style.backgroundColor = 'transparent';
            }, 200);
            
            // Here you would typically navigate to the respective page
            console.log('Clicked:', this.textContent);
        });
    });
    
    // Social media icon interactions
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Here you would typically open social media links
            console.log('Social icon clicked:', this.className);
        });
    });
}

// Form Validation (for future forms)
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize interactive elements when DOM is ready
// document.addEventListener('DOMContentLoaded', initInteractiveElements); // Removed duplicate listener

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate layouts if needed
    console.log('Window resized');
}, 250));