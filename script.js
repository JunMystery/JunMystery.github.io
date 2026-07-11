/**
 * script.js
 * Interactive logic for portfolio site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Skills Interactive Tab Filtering
    const tabBtns = document.querySelectorAll('.skills-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (filter === 'all' || category === filter) ? 'flex' : 'none';
            });
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }

    // Directly trigger print/save dialog on click
    const printBtns = [
        document.getElementById('btn-print'),
        document.getElementById('btn-print-nav')
    ];

    printBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                window.print();
            });
        }
    });

    // Footer Typewriter — token-based colors, runs once on scroll into view
    const FOOTER_LINES = [
        { id: 'fl-0', tokens: [
            { text: '> ', cls: 'terminal-comment' },
            { text: 'git commit', cls: 'terminal-keyword' },
            { text: ' -m ', cls: '' },
            { text: '"built with intent, shipped with care"', cls: 'terminal-string' },
        ]},
        { id: 'fl-1', tokens: [
            { text: 'const ', cls: 'terminal-keyword' },
            { text: 'portfolio', cls: 'terminal-variable' },
            { text: ' = { ', cls: '' },
            { text: 'author', cls: 'terminal-keyword' },
            { text: ': ', cls: '' },
            { text: '"Nguyen Hoang Thanh Tu"', cls: 'terminal-string' },
            { text: ', ', cls: '' },
            { text: 'status', cls: 'terminal-keyword' },
            { text: ': ', cls: '' },
            { text: '"active"', cls: 'terminal-string' },
            { text: ' }', cls: '' },
        ]},
        { id: 'fl-2', tokens: [
            { text: '.engineer', cls: 'terminal-variable' },
            { text: ' { ', cls: '' },
            { text: 'stack', cls: 'terminal-keyword' },
            { text: ': ', cls: '' },
            { text: 'systems + ai', cls: 'terminal-string' },
            { text: '; ', cls: '' },
            { text: 'output', cls: 'terminal-keyword' },
            { text: ': ', cls: '' },
            { text: 'production-grade', cls: 'terminal-orange' },
            { text: '; }', cls: '' },
        ]},
    ];
    const CHAR_SPEED = 14;
    const LINE_PAUSE = 160;

    function runTypewriter() {
        FOOTER_LINES.forEach(l => {
            const el = document.getElementById(l.id);
            if (el) { el.innerHTML = ''; el.classList.remove('typing'); }
        });
        let lineIdx = 0;

        function typeTokens(line, tokIdx, charIdx, done) {
            const el = document.getElementById(line.id);
            if (!el) return;
            el.classList.add('typing');
            const tok = line.tokens[tokIdx];
            let span = el.children[tokIdx];
            if (!span) {
                span = document.createElement('span');
                if (tok.cls) span.className = tok.cls;
                el.appendChild(span);
            }
            if (charIdx < tok.text.length) {
                span.textContent += tok.text[charIdx];
                setTimeout(() => typeTokens(line, tokIdx, charIdx + 1, done), CHAR_SPEED);
            } else if (tokIdx + 1 < line.tokens.length) {
                typeTokens(line, tokIdx + 1, 0, done);
            } else {
                el.classList.remove('typing');
                setTimeout(done, LINE_PAUSE);
            }
        }

        function nextLine() {
            if (lineIdx < FOOTER_LINES.length) typeTokens(FOOTER_LINES[lineIdx++], 0, 0, nextLine);
        }
        nextLine();
    }

    const footerEl = document.querySelector('.footer');
    if (footerEl) {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { runTypewriter(); obs.disconnect(); }
        }, { threshold: 0.4 });
        obs.observe(footerEl);
    }
});
