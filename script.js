// ============================================
// VINAYAK SINGH PORTFOLIO — Script v2.0
// Modern interactions, 3D tilt, particles
// ============================================

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
    initTiltCards();
    initTimelineAnimation();
    initParallaxEffect();
    initKonamiCode();
    initThemeToggle();
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, 16);
    
    window.addEventListener('scroll', handleScroll);
    
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

// ============================================
// PARTICLE BACKGROUND — Cyan/Purple palette
// ============================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    
    const particles = [];
    const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
    
    // Subtle white and light blue stardust palette
    const colors = [
        { r: 255, g: 255, b: 255 },
        { r: 10, g: 132, b: 255 },
        { r: 255, g: 255, b: 255 },
    ];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.size = Math.random() * 1.5 + 0.3;
            this.opacity = Math.random() * 0.15 + 0.05;
            this.color = colors[Math.floor(Math.random() * colors.length)];
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
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connection lines with high transparency
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const alpha = 0.03 * (1 - distance / 120);
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', debounce(() => {
        resize();
    }, 250));
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                
                if (entry.target.classList.contains('strength-card') || 
                    entry.target.classList.contains('skill-category') ||
                    entry.target.classList.contains('achievement-card')) {
                    animateGridItems(entry.target.parentElement);
                }
                
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll(`
        .hero-text, .hero-visual, .section-header, .about-content,
        .strength-card, .skill-category, .timeline-item,
        .achievement-card, .education-item, .certification-item,
        .contact-method, .stat-card, .secops-category
    `);
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function animateGridItems(container) {
    if (!container) return;
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0)';
            item.style.opacity = '1';
        }, index * 80);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const target = parseInt(text);
    if (isNaN(target)) return;
    
    const hasPct = text.includes('%');
    const hasPlus = text.includes('+');
    const suffix = hasPct ? '%' : hasPlus ? '+' : '';
    
    const duration = 1800;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    const title = document.querySelector('.hero-title .name-highlight');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid var(--primary)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        } else {
            // Blink cursor then remove
            let blinks = 0;
            const blinkInterval = setInterval(() => {
                title.style.borderRight = blinks % 2 === 0 ? '2px solid transparent' : '2px solid var(--primary)';
                blinks++;
                if (blinks > 6) {
                    title.style.borderRight = 'none';
                    clearInterval(blinkInterval);
                }
            }, 400);
        }
    };
    
    setTimeout(typeWriter, 800);
}

// ============================================
// FLOATING ICONS
// ============================================
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
}

// ============================================
// SKILL TAG SHIMMER ANIMATION
// ============================================
function initSkillTagAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');
        let isAnimating = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isAnimating) {
                    isAnimating = true;
                    animateSkillTags(tags);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(category);
    });
}

function animateSkillTags(tags) {
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'scale(1.08)';
            tag.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.25)';
            
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
                tag.style.boxShadow = 'none';
            }, 200);
        }, index * 80);
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        const bars = navToggle.querySelectorAll('.bar');
        if (navToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
    
    // Close menu on link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 72;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL INDICATOR
// ============================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', throttle(() => {
            const opacity = Math.max(0, 1 - window.scrollY / 400);
            scrollIndicator.style.opacity = opacity;
        }, 16));
    }
}

// ============================================
// CONTACT TOOLTIPS
// ============================================
function initContactFormTooltips() {
    const socialLinks = document.querySelectorAll('.social-link[data-tooltip]');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-dynamic';
            tooltip.textContent = link.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                bottom: -34px;
                left: 50%;
                transform: translateX(-50%) translateY(4px);
                background: rgba(14, 21, 48, 0.95);
                color: #f0f4ff;
                padding: 0.3rem 0.7rem;
                border-radius: 6px;
                font-size: 0.75rem;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: all 0.2s ease;
                pointer-events: none;
                border: 1px solid rgba(255, 255, 255, 0.06);
                backdrop-filter: blur(8px);
            `;
            
            link.style.position = 'relative';
            link.appendChild(tooltip);
            
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateX(-50%) translateY(0)';
            });
        });
        
        link.addEventListener('mouseleave', () => {
            const tooltip = link.querySelector('.tooltip-dynamic');
            if (tooltip) tooltip.remove();
        });
    });
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

// ============================================
// TIMELINE ANIMATION
// ============================================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    dot.style.transform = 'scale(1.3)';
                    dot.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    setTimeout(() => {
                        dot.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(item);
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallaxEffect() {
    const heroShapes = document.querySelector('.hero-shapes');
    
    if (heroShapes) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.3;
            heroShapes.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn, .social-link, .contact-method');
    if (target) createRippleEffect(e, target);
});

function createRippleEffect(e, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 212, 255, 0.2);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Inject ripple animation CSS
const rippleCSS = document.createElement('style');
rippleCSS.textContent = `
    @keyframes rippleEffect {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(rippleCSS);

// ============================================
// KONAMI CODE EASTER EGG
// ============================================
function initKonamiCode() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.keyCode);
        if (userInput.length > konamiCode.length) userInput.shift();
        
        if (userInput.join(',') === konamiCode.join(',')) {
            activateEasterEgg();
            userInput = [];
        }
    });
}

function activateEasterEgg() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    heroTitle.style.background = 'linear-gradient(45deg, #00d4ff, #7c3aed, #f59e0b, #10b981, #00d4ff)';
    heroTitle.style.backgroundSize = '400% 400%';
    heroTitle.style.webkitBackgroundClip = 'text';
    heroTitle.style.webkitTextFillColor = 'transparent';
    heroTitle.style.animation = 'rainbowShift 2s ease infinite';
    
    const rainbowCSS = document.createElement('style');
    rainbowCSS.textContent = `
        @keyframes rainbowShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(rainbowCSS);
    
    const message = document.createElement('div');
    message.textContent = '🎉 Konami Code Activated! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.5);
        background: linear-gradient(135deg, #00d4ff, #7c3aed);
        color: white;
        padding: 1.5rem 3rem;
        border-radius: 16px;
        font-size: 1.3rem;
        font-weight: 700;
        z-index: 9999;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 0 40px rgba(0, 212, 255, 0.4);
    `;
    
    document.body.appendChild(message);
    
    requestAnimationFrame(() => {
        message.style.opacity = '1';
        message.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => message.remove(), 400);
    }, 2500);
}

// ============================================
// THEME SELECTOR (Light / Dark / System Default)
// ============================================
function initThemeToggle() {
    const segments = document.querySelectorAll('.theme-segment-btn');
    const indicator = document.getElementById('theme-indicator');
    
    // Get stored theme or default to system
    let currentTheme = localStorage.getItem('theme') || 'system';
    
    // Initial setup
    setTheme(currentTheme);
    
    segments.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme');
            setTheme(selectedTheme);
        });
    });
    
    function setTheme(theme) {
        // Update document attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Find index of the theme button
        let activeIndex = 2; // Default to system (index 2)
        segments.forEach((btn, index) => {
            if (btn.getAttribute('data-theme') === theme) {
                activeIndex = index;
                btn.classList.add('active');
                btn.setAttribute('aria-checked', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-checked', 'false');
            }
        });
        
        // Move sliding capsule background (width of each segment button is 28px)
        if (indicator) {
            indicator.style.transform = `translateX(${activeIndex * 28}px)`;
        }
    }
    
    // Sync with system theme preference if set to 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') {
            document.documentElement.setAttribute('data-theme', 'system');
        }
    });
}