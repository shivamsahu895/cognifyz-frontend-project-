// Task 4: Interactive Button & Task 5: API Integration & Task 6: Form Validation

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cognifyz Technologies - Interactive Website Loaded!');
    
    // Initialize all functionality
    initializeColorChanger();
    initializeAPIIntegration();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Task 4: Interactive Button - Background Color Changer
function initializeColorChanger() {
    const colorChangeBtn = document.getElementById('colorChangeBtn');
    const body = document.body;
    let currentTheme = 'light';
    
    // Array of different theme configurations
    const themes = [
        {
            name: 'light',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            class: ''
        },
        {
            name: 'dark',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            class: 'dark-theme'
        },
        {
            name: 'ocean',
            background: 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)',
            class: 'ocean-theme'
        },
        {
            name: 'sunset',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            class: 'sunset-theme'
        },
        {
            name: 'forest',
            background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
            class: 'forest-theme'
        }
    ];
    
    let currentThemeIndex = 0;
    
    colorChangeBtn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Cycle through themes
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        
        // Remove all theme classes
        body.className = body.className.replace(/\b\w+-theme\b/g, '');
        
        // Add new theme class
        if (newTheme.class) {
            body.classList.add(newTheme.class);
        }
        
        // Change hero section background
        const heroSection = document.querySelector('.hero-section');
        heroSection.style.background = newTheme.background;
        
        // Update button text
        colorChangeBtn.innerHTML = `<span style="animation: pulse 0.5s;">Theme: ${newTheme.name.charAt(0).toUpperCase() + newTheme.name.slice(1)}</span>`;
        
        // Reset button text after animation
        setTimeout(() => {
            colorChangeBtn.innerHTML = 'Change Theme';
        }, 2000);
        
        // Store theme preference
        localStorage.setItem('cognifyzTheme', newTheme.name);
        
        console.log(`Theme changed to: ${newTheme.name}`);
    });
    
    // Load saved theme on page load
    const savedTheme = localStorage.getItem('cognifyzTheme');
    if (savedTheme) {
        const themeIndex = themes.findIndex(theme => theme.name === savedTheme);
        if (themeIndex !== -1) {
            currentThemeIndex = themeIndex;
            const theme = themes[currentThemeIndex];
            if (theme.class) {
                body.classList.add(theme.class);
            }
            document.querySelector('.hero-section').style.background = theme.background;
        }
    }
}

// Task 5: API Integration
function initializeAPIIntegration() {
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const apiDataContainer = document.getElementById('apiDataContainer');
    let dataLoaded = false;
    
    fetchDataBtn.addEventListener('click', async function() {
        if (dataLoaded) {
            // Clear existing data
            apiDataContainer.innerHTML = '';
            dataLoaded = false;
            this.textContent = 'Fetch Posts';
            this.classList.remove('btn-success');
            this.classList.add('btn-primary');
            return;
        }
        
        // Show loading state
        this.innerHTML = '<div class="loading"></div> Loading...';
        this.disabled = true;
        
        try {
            // Fetch data from JSONPlaceholder API
            console.log('Fetching data from JSONPlaceholder API...');
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=6');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const posts = await response.json();
            console.log('API Data received:', posts);
            
            // Clear container and display data
            apiDataContainer.innerHTML = '';
            
            posts.forEach((post, index) => {
                const postCard = createPostCard(post, index);
                apiDataContainer.appendChild(postCard);
            });
            
            // Update button state
            this.textContent = 'Clear Posts';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            dataLoaded = true;
            
            // Add success message
            showNotification('Data fetched successfully!', 'success');
            
        } catch (error) {
            console.error('Error fetching data:', error);
            apiDataContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Error!</h4>
                        <p>Failed to fetch data from the API. Please check your internet connection and try again.</p>
                        <hr>
                        <p class="mb-0">Error details: ${error.message}</p>
                    </div>
                </div>
            `;
            
            // Reset button
            this.textContent = 'Retry Fetch';
            this.classList.add('btn-warning');
            
            showNotification('Failed to fetch data. Please try again.', 'error');
        } finally {
            this.disabled = false;
        }
    });
}

// Helper function to create post cards
function createPostCard(post, index) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="card api-card h-100 shadow-sm" style="border-radius: 15px; animation: fadeInUp 0.6s ease-out ${index * 0.1}s both;">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-primary" style="border-radius: 20px;">Post #${post.id}</span>
                    <small class="text-muted">API Data</small>
                </div>
                <h5 class="card-title fw-bold" style="color: #2c3e50; line-height: 1.3;">
                    ${post.title.charAt(0).toUpperCase() + post.title.slice(1)}
                </h5>
                <p class="card-text" style="color: #7f8c8d; font-size: 0.95rem;">
                    ${post.body.charAt(0).toUpperCase() + post.body.slice(1)}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <small class="text-muted">User ID: ${post.userId}</small>
                    <button class="btn btn-sm btn-outline-primary" onclick="showPostDetails(${post.id})" 
                            style="border-radius: 20px;">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Function to show post details
async function showPostDetails(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const post = await response.json();
        
        // Create modal-like alert
        const modal = document.createElement('div');
        modal.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '9999';
        
        modal.innerHTML = `
            <div class="bg-white p-4 rounded-4 shadow-lg" style="max-width: 500px; margin: 20px;">
                <h4 class="fw-bold mb-3" style="color: #2c3e50;">Post Details</h4>
                <h5 class="mb-3">${post.title}</h5>
                <p class="mb-3">${post.body}</p>
                <div class="d-flex justify-content-between">
                    <small class="text-muted">Post ID: ${post.id} | User ID: ${post.userId}</small>
                    <button class="btn btn-primary" onclick="this.closest('.position-fixed').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Error fetching post details:', error);
        showNotification('Failed to load post details', 'error');
    }
}

// Task 6: Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const formMessages = document.getElementById('formMessages');
    
    // Custom validation patterns
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'First name must contain only letters and be at least 2 characters long'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Last name must contain only letters and be at least 2 characters long'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            message: 'Please select a subject'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Message must be at least 10 characters long'
        }
    };
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', () => validateField(field, validationRules[fieldName]));
            field.addEventListener('blur', () => validateField(field, validationRules[fieldName]));
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        
        // Validate all fields
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !validateField(field, validationRules[fieldName])) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Simulate form submission
            submitForm(formData);
        } else {
            showFormMessage('Please correct the errors below.', 'error');
        }
    });
}

// Field validation function
function validateField(field, rules) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Minimum length validation
    if (isValid && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Must be at least ${rules.minLength} characters long`;
    }
    
    // Pattern validation
    if (isValid && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.message || 'Invalid format';
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        // Update error message
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Simulate form submission
async function submitForm(formData) {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data
        console.log('Form submitted with data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        // Show success message
        showFormMessage(`
            <h5 class="mb-2">Message Sent Successfully!</h5>
            <p class="mb-0">Thank you for contacting Cognifyz Technologies. We'll get back to you soon!</p>
        `, 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Remove validation classes
        document.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
        // Show notification
        showNotification('Message sent successfully!', 'success');
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage('Failed to send message. Please try again later.', 'error');
        showNotification('Failed to send message', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show form messages
function showFormMessage(message, type) {
    const formMessages = document.getElementById('formMessages');
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    
    formMessages.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const alert = formMessages.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => {
                formMessages.innerHTML = '';
            }, 150);
        }
    }, 5000);
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card, .form-control, .btn').forEach(el => {
        observer.observe(el);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(0, 123, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 123, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.5s ease-out;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <span class="me-2">${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.closest('.alert').remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }
    }, 4000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

