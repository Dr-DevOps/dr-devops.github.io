/* ═══════════════════════════════════════════
   FUTURISTIC PORTFOLIO — Script
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Animated Grid Canvas ─────────────────
    const canvas = document.getElementById('grid-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, cols, rows;
        const CELL = 50;
        let mouse = { x: -1000, y: -1000 };
        let animId;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            cols = Math.ceil(w / CELL) + 1;
            rows = Math.ceil(h / CELL) + 1;
        }
        resize();
        window.addEventListener('resize', resize);

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function drawGrid(time) {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= rows; j++) {
                    const x = i * CELL;
                    const y = j * CELL;
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 200;
                    const alpha = dist < maxDist ? 0.08 + (1 - dist / maxDist) * 0.2 : 0.04;
                    const size = dist < maxDist ? 1.5 + (1 - dist / maxDist) * 2 : 1;

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
                    ctx.fill();
                }
            }

            // Draw faint grid lines
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.025)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= cols; i++) {
                ctx.beginPath();
                ctx.moveTo(i * CELL, 0);
                ctx.lineTo(i * CELL, h);
                ctx.stroke();
            }
            for (let j = 0; j <= rows; j++) {
                ctx.beginPath();
                ctx.moveTo(0, j * CELL);
                ctx.lineTo(w, j * CELL);
                ctx.stroke();
            }

            animId = requestAnimationFrame(drawGrid);
        }
        drawGrid(0);

        // Pause when tab not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                drawGrid(0);
            }
        });
    }

    // ─── Navigation ─────────────────────────────
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        lastScroll = scrollY;
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('open');
            if (navToggle) {
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── Terminal Typing Animation ──────────────
    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        const commands = [
            { cmd: 'whoami', output: 'vinayak-singh // DevSecOps Engineer', type: 'default' },
            { cmd: 'cat /etc/experience', output: '7+ years · AWS · GCP · K8s · Terraform', type: 'default' },
            { cmd: 'kubectl get pods --all-namespaces', output: 'All pods running ✓ — 99.9% uptime', type: 'success' },
            { cmd: 'terraform plan', output: '14 resources to add, 0 to change, 0 to destroy', type: 'warn' },
            { cmd: 'trivy image --severity CRITICAL app:latest', output: '0 vulnerabilities found — image is clean ✓', type: 'success' },
            { cmd: 'echo $STATUS', output: '🟢 Available for hire — Let\'s build something secure', type: 'success' },
        ];

        let cmdIndex = 0;

        function typeCommand(cmd, callback) {
            const line = document.createElement('div');
            line.className = 'terminal__line';
            line.innerHTML = `<span class="terminal__prompt">❯</span> <span class="terminal__cmd"></span><span class="terminal__caret">▌</span>`;
            terminalBody.appendChild(line);

            const cmdSpan = line.querySelector('.terminal__cmd');
            const caret = line.querySelector('.terminal__caret');
            let i = 0;

            function type() {
                if (i < cmd.length) {
                    cmdSpan.textContent += cmd[i];
                    i++;
                    setTimeout(type, 30 + Math.random() * 40);
                } else {
                    caret.remove();
                    setTimeout(callback, 300);
                }
            }
            type();
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function showOutput(text, type) {
            const line = document.createElement('div');
            line.className = 'terminal__line';
            const outputClass = type === 'success' ? 'terminal__output--success'
                : type === 'warn' ? 'terminal__output--warn'
                    : '';
            line.innerHTML = `<span class="terminal__output ${outputClass}">${text}</span>`;
            terminalBody.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function runNextCommand() {
            if (cmdIndex >= commands.length) {
                // Loop after a pause
                setTimeout(() => {
                    terminalBody.innerHTML = '';
                    cmdIndex = 0;
                    runNextCommand();
                }, 4000);
                return;
            }

            const { cmd, output, type } = commands[cmdIndex];
            cmdIndex++;

            typeCommand(cmd, () => {
                showOutput(output, type);
                setTimeout(runNextCommand, 1200);
            });
        }

        // Start with a slight delay
        setTimeout(runNextCommand, 800);
    }

    // ─── Scroll Reveal ──────────────────────────
    function setupReveal() {
        const revealElements = document.querySelectorAll(
            '.section__header, .about__text, .about__metrics, .metric-card, ' +
            '.strength-card, .skill-group, .timeline__item, .achievement-card, ' +
            '.edu-card, .cert-card, .contact-card, .education-col__title'
        );

        revealElements.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach((el, i) => {
            el.style.transitionDelay = `${(i % 6) * 0.08}s`;
            observer.observe(el);
        });
    }

    // ─── Metric Ring Animation ──────────────────
    function animateRings() {
        const rings = document.querySelectorAll('.metric-card__ring-fill');
        const circumference = 2 * Math.PI * 42; // r=42

        // Create SVG gradient definition
        const svgs = document.querySelectorAll('.metric-card__ring svg');
        svgs.forEach(svg => {
            if (!svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', 'ring-gradient');
                gradient.setAttribute('x1', '0%');
                gradient.setAttribute('y1', '0%');
                gradient.setAttribute('x2', '100%');
                gradient.setAttribute('y2', '100%');

                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', '#34d399');

                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', '#d4a017');

                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
                defs.appendChild(gradient);
                svg.insertBefore(defs, svg.firstChild);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ring = entry.target;
                    const percent = parseInt(ring.dataset.percent) || 0;
                    const offset = circumference - (percent / 100) * circumference;
                    ring.style.strokeDashoffset = offset;
                    observer.unobserve(ring);
                }
            });
        }, { threshold: 0.3 });

        rings.forEach(ring => {
            ring.style.strokeDasharray = circumference;
            ring.style.strokeDashoffset = circumference;
            observer.observe(ring);
        });
    }

    // ─── Footer Year ────────────────────────────
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ─── Init ───────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        setupReveal();
        animateRings();
    });

    // If DOM already loaded
    if (document.readyState !== 'loading') {
        setupReveal();
        animateRings();
    }

})();