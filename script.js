// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

function initializeAll() {
    initNavigation();
    initParticles();
    initScrollAnimations();
    initTypingEffect();
    initFloatingIcons();
    initSkillTagAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initScrollIndicator();
    initContactFormTooltips();
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
    
    // Update active nav link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
}

// Custom Cursor (Removed)
// Cursor functionality has been disabled for better compatibility

// Particle Background
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', debounce(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, 250));
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('strength-card') || 
                    entry.target.classList.contains('skill-category') ||
                    entry.target.classList.contains('achievement-card')) {
                    animateGridItems(entry.target.parentElement);
                }
                
                // Animate stats counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(`
        .hero-text, .hero-visual, .section-header, .about-content,
        .strength-card, .skill-category, .timeline-item,
        .achievement-card, .education-item, .certification-item,
        .contact-method, .stat-card
    `);
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function animateGridItems(container) {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0)';
            item.style.opacity = '1';
        }, index * 100);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
        }
    }, 16);
}

// Typing Effect
function initTypingEffect() {
    const title = document.querySelector('.hero-title .name-highlight');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid var(--primary-color)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                title.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    setTimeout(typeWriter, 1000);
}

// Floating Icons Animation
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add floating animation with different delays
        icon.style.animationDelay = `${index * 0.5}s`;
        
        // Add hover effect
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-10px) scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Skill Tag Animations
function initSkillTagAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');
        let isAnimating = false;
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    isAnimating = true;
                    animateSkillTags(tags);
                }
            });
        }, observerOptions);
        
        observer.observe(category);
    });
}

function animateSkillTags(tags) {
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'scale(1.1)';
            tag.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.4)';
            
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
                tag.style.boxShadow = 'none';
            }, 200);
        }, index * 100);
    });
}

// Mobile Menu
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.transform = navToggle.classList.contains('active') ? 
                `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) ${index === 1 ? 'scale(0)' : ''}` : 'none';
        });
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^=\"#\"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const opacity = Math.max(0, 1 - scrolled / 500);
            scrollIndicator.style.opacity = opacity;
        });
    }
}

// Contact Form Tooltips
function initContactFormTooltips() {
    const socialLinks = document.querySelectorAll('.social-link[data-tooltip]');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = link.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-secondary);
                color: var(--text-primary);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            link.style.position = 'relative';
            link.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
        });
        
        link.addEventListener('mouseleave', () => {
            const tooltip = link.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Button Click Effects
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .social-link, .contact-method')) {
        createRippleEffect(e);
    }
});

function createRippleEffect(e) {
    const button = e.target.closest('.btn, .social-link, .contact-method');
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Timeline Animation
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                
                // Animate timeline dot
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        dot.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize timeline animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTimelineAnimation, 500);
});

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const heroShapes = document.querySelector('.hero-shapes');
    
    if (heroShapes) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.5;
            heroShapes.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', initParallaxEffect);

// Performance optimization: Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Easter egg: Konami code
function initKonamiCode() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.keyCode);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (userInput.join(',') === konamiCode.join(',')) {
            activateEasterEgg();
            userInput = [];
        }
    });
}

function activateEasterEgg() {
    // Add rainbow animation to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.background = 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)';
        heroTitle.style.backgroundSize = '400% 400%';
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.animation = 'rainbow 2s ease infinite';
        
        // Add rainbow animation CSS
        const rainbowCSS = `
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = rainbowCSS;
        document.head.appendChild(style);
        
        // Show celebration message
        const message = document.createElement('div');
        message.textContent = '🎉 Konami Code Activated! 🎉';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--primary-color);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            font-size: 1.5rem;
            z-index: 9999;
            animation: celebration 3s ease forwards;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize easter egg
document.addEventListener('DOMContentLoaded', initKonamiCode);

// Add celebration animation CSS
const celebrationCSS = `
    @keyframes celebration {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
    }
`;

const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = celebrationCSS;
document.head.appendChild(celebrationStyle);

// Progressive Web App support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}