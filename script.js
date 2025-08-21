// DOM Elements
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const messageContainer = document.getElementById('message-container');

// Carousel Elements
const carousel = document.getElementById('testimonials-carousel');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const carouselDots = document.getElementById('carousel-dots');

// FAQ Elements
const faqItems = document.querySelectorAll('.faq-item');

// State Variables
let currentSlide = 0;
let isMenuOpen = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCarousel();
    initializeFAQ();
    initializeScrollEffects();
    initializeForm();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active', isMenuOpen);
    navToggle.classList.toggle('active', isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
}

function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function handleSmoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== CAROUSEL =====
function initializeCarousel() {
    if (!carousel) return;
    
    // Create dots
    createCarouselDots();
    
    // Add event listeners
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    // Auto-play carousel
    setInterval(() => changeSlide(1), 5000);
    
    // Show first slide
    showSlide(currentSlide);
}

function createCarouselDots() {
    testimonialItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= testimonialItems.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = testimonialItems.length - 1;
    }
    
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function showSlide(index) {
    // Hide all slides
    testimonialItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Remove active class from all dots
    const dots = carouselDots.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide
    testimonialItems[index].classList.add('active');
    dots[index].classList.add('active');
}

// ===== FAQ ACCORDION =====
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
    });
}

function toggleFAQ(clickedItem) {
    const isActive = clickedItem.classList.contains('active');
    
    // Close all FAQ items
    faqItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        clickedItem.classList.add('active');
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .timeline-item, .portfolio-item, .faq-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== FORM HANDLING =====
function initializeForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError(e);
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'nome':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
            break;
            
        case 'telefone':
            if (value && value.length < 10) {
                isValid = false;
                errorMessage = 'Telefone deve ter pelo menos 10 dígitos';
            }
            break;
            
        case 'tipo':
            if (!value) {
                isValid = false;
                errorMessage = 'Selecione um tipo de projeto';
            }
            break;
            
        case 'mensagem':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError({ target: field });
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showMessage('Por favor, corrija os erros no formulário.', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Prepare data for Google Apps Script
        const data = {
            nome: formData.get('nome'),
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            tipo: formData.get('tipo'),
            mensagem: formData.get('mensagem'),
            timestamp: new Date().toISOString()
        };
        
        // Send to Google Apps Script
        const response = await fetch('https://script.google.com/macros/s/AKfycbwiWyUtyAJqzccxc3kCeg_xBdm7tWspRiqco6DKtKrmlL9QeUkmn46E1Hr4nzPitpWz/exec', {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requires this
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Since no-cors doesn't return response details, we assume success
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em até 24 horas.', 'success');
        contactForm.reset();
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.', 'error');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// ===== MESSAGE SYSTEM =====
function showMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    messageContainer.appendChild(messageElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll events
const optimizedScrollHandler = throttle(handleHeaderScroll, 16); // ~60fps
window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY =====

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Focus management for mobile menu
function manageFocus() {
    if (isMenuOpen) {
        // Trap focus in mobile menu
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy loading for images (if added later)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
    
    // Preload Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'preload';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    faLink.as = 'style';
    document.head.appendChild(faLink);
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadResources();
    initializeLazyLoading();
});

// ===== ERROR HANDLING =====

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send errors to a logging service here
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ===== ANALYTICS (Optional) =====

// Track form submissions
function trackFormSubmission() {
    // If you have Google Analytics or similar
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'engagement',
            'event_label': 'contact_form'
        });
    }
}

// Track scroll depth
function trackScrollDepth() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track at 25%, 50%, 75%, 100%
            if (maxScroll >= 25 && maxScroll < 50) {
                trackEvent('scroll_depth', '25%');
            } else if (maxScroll >= 50 && maxScroll < 75) {
                trackEvent('scroll_depth', '50%');
            } else if (maxScroll >= 75 && maxScroll < 100) {
                trackEvent('scroll_depth', '75%');
            } else if (maxScroll >= 100) {
                trackEvent('scroll_depth', '100%');
            }
        }
    }, 1000));
}

function trackEvent(eventName, eventLabel) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'engagement',
            'event_label': eventLabel
        });
    }
}

// Initialize analytics tracking
document.addEventListener('DOMContentLoaded', () => {
    trackScrollDepth();
});

// ===== EXPORT FOR TESTING =====
// This allows testing functions in browser console
window.WebDevApp = {
    toggleMobileMenu,
    changeSlide,
    toggleFAQ,
    showMessage,
    handleFormSubmit
};
