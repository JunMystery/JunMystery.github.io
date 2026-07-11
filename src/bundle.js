/**
 * bundle.js � Auto-generated from src/ modules
 * Offline-friendly single-file build (no import/export)
 */

// --- utils/constants.js ---
/* Selectors */
const SELECTORS = {
    THEME_TOGGLE: '#theme-toggle',
    NAV_TOGGLE: '#nav-toggle',
    NAV_MENU: '#nav-menu',
    NAV_LINKS: '.nav-link',
    TAB_BTNS: '.skills-tab-btn',
    SKILL_GROUPS: '.skill-group',
    PRINT_BTNS: ['#btn-print', '#btn-print-nav'],
    FOOTER: '.footer',
};

/* Timing */
const TIMING = {
    TYPEWRITER_CHAR: 14,
    TYPEWRITER_LINE_PAUSE: 160,
    REVEAL_THRESHOLD: 0.12,
    REVEAL_MARGIN: '0px 0px -40px 0px',
};


// --- utils/dom.js ---
/** Get element by selector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/** Get all elements by selector */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/** Create element with optional attrs and children */
const createEl = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') el.className = v;
        else if (k.startsWith('data-')) el.setAttribute(k, v);
        else el[k] = v;
    });
    children.forEach(c => {
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else if (c instanceof Node) el.appendChild(c);
    });
    return el;
};


// --- services/theme.service.js ---
/**
 * Theme service — get/set theme preference
 */

const STORAGE_KEY = 'theme';

function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
}

function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
}

function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
}

function getToggleIconClass(theme) {
    return theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}


// --- services/print.service.js ---
/**
 * Print service — trigger browser print dialog
 */

function triggerPrint() {
    window.print();
}


// --- services/scroll.service.js ---
/**
 * Scroll service — IntersectionObserver factory
 */

function createRevealObserver(threshold = 0.12, rootMargin = '0px 0px -40px 0px') {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold, rootMargin });
    return obs;
}

function createFooterObserver(threshold = 0.4) {
    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            if (typeof window.startTypewriter === 'function') {
                window.startTypewriter();
            }
            obs.disconnect();
        }
    }, { threshold });
    return obs;
}


// --- models/footer.model.js ---
/**
 * Footer model — typewriter line data
 */

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


// --- models/navigation.model.js ---
/**
 * Navigation model — nav link config
 */

const NAV_SECTIONS = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
];


// --- controllers/theme.controller.js ---
/**
 * Theme controller — handles dark/light toggle and persistence
 */


function initTheme() {
    const toggle = $('#theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');
    const saved = getStoredTheme();
    const theme = saved || getPreferredTheme();
    applyTheme(theme);
    if (icon) icon.className = getToggleIconClass(theme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        if (icon) icon.className = getToggleIconClass(next);
    });
}


// --- controllers/nav.controller.js ---
/**
 * Nav controller — mobile toggle, smooth scroll, close menu on link click
 */


function initNav() {
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    const links = $$('.nav-link');

    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                menu.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';

                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}


// --- controllers/skills.controller.js ---
/**
 * Skills controller — tab filter functionality
 */


function initSkillsTabs() {
    const tabs = $$('.skills-tab-btn');
    const groups = $$('.skill-group');

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            groups.forEach(group => {
                const category = group.getAttribute('data-category');
                group.style.display = (filter === 'all' || category === filter) ? '' : 'none';
            });
        });
    });
}


// --- controllers/footer.controller.js ---
/**
 * Footer controller — typewriter effect on scroll into view
 */


function initFooter() {
    const footer = $('.footer');
    if (!footer) return;

    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runTypewriter();
            obs.disconnect();
        }
    }, { threshold: 0.4 });

    obs.observe(footer);
}

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
            setTimeout(() => typeTokens(line, tokIdx, charIdx + 1, done), TIMING.TYPEWRITER_CHAR);
        } else if (tokIdx + 1 < line.tokens.length) {
            typeTokens(line, tokIdx + 1, 0, done);
        } else {
            el.classList.remove('typing');
            setTimeout(done, TIMING.TYPEWRITER_LINE_PAUSE);
        }
    }

    function nextLine() {
        if (lineIdx < FOOTER_LINES.length) typeTokens(FOOTER_LINES[lineIdx++], 0, 0, nextLine);
    }

    nextLine();
}


// --- controllers/scroll.controller.js ---
/**
 * Scroll controller — IntersectionObserver-driven reveal animations
 */


function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: TIMING.REVEAL_THRESHOLD, rootMargin: TIMING.REVEAL_MARGIN });

    $$('.reveal, .reveal-stagger, .reveal-hero').forEach(el => {
        observer.observe(el);
    });
}


// --- app.js ---
/**
 * app.js — Application bootstrap
 * Initializes all MVC controllers on DOMContentLoaded
 */


document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initSkillsTabs();
    initFooter();
    initReveal();

    const printBtns = ['#btn-print', '#btn-print-nav'];
    printBtns.forEach(sel => {
        const btn = $(sel);
        if (btn) btn.addEventListener('click', triggerPrint);
    });
});

