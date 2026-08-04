// ============================================================
// utils.js — DOM helpers, constants, theme & scroll services
// ============================================================

/* DOM helpers */
var $ = function (sel, ctx) { ctx = ctx || document; return ctx.querySelector(sel); };
var $$ = function (sel, ctx) { ctx = ctx || document; return [].slice.call(ctx.querySelectorAll(sel)); };

var createEl = function (tag, attrs, children) {
    attrs = attrs || {};
    children = children || [];
    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (k === 'className') el.className = v;
        else if (k.indexOf('data-') === 0) el.setAttribute(k, v);
        else el[k] = v;
    });
    children.forEach(function (c) {
        if (typeof c === 'string') el.appendChild(document.createTextNode(c));
        else if (c instanceof Node) el.appendChild(c);
    });
    return el;
};

/* Constants */
var SELECTORS = {
    THEME_TOGGLE: '#theme-toggle',
    NAV_TOGGLE: '#nav-toggle',
    NAV_MENU: '#nav-menu',
    TAB_BTNS: '.skills-tab-btn',
    SKILL_GROUPS: '.skill-group',
    FOOTER: '.footer'
};

var TIMING = {
    TYPEWRITER_CHAR: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 10,
    TYPEWRITER_LINE_PAUSE: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 100,
    REVEAL_THRESHOLD: 0.12,
    REVEAL_MARGIN: '0px 0px -40px 0px'
};

/* Theme service */
var STORAGE_KEY_THEME = 'theme';

function getStoredTheme() { return localStorage.getItem(STORAGE_KEY_THEME); }
function setStoredTheme(theme) { localStorage.setItem(STORAGE_KEY_THEME, theme); }

function getPreferredTheme() {
    var stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
}

var ICON_PATHS = {
    sun: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    bars: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    times: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    timesCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    exclamation: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    running: '<circle cx="13" cy="4" r="2"/><path d="M13 6v5l-3 2-2 5"/><path d="m13 11 4-1"/>',
    gamepad: '<line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/>',
    bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    fire: '<path d="M12 22c4.4 0 8-3.6 8-8 0-4.4-4-10-8-12-4 2-8 7.6-8 12 0 4.4 3.6 8 8 8z"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>'
};

function getIconSVG(name, size) {
    size = size || 14;
    var inner = ICON_PATHS[name] || '';
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
}

function setIcon(el, name) {
    if (el) el.innerHTML = ICON_PATHS[name] || '';
}

function getToggleIcon(theme) {
    return theme === 'dark' ? getIconSVG('sun', 16) : getIconSVG('moon', 16);
}

/* Scroll service */
function createRevealObserver(threshold, rootMargin) {
    threshold = threshold || 0.12;
    rootMargin = rootMargin || '0px 0px -40px 0px';
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: threshold, rootMargin: rootMargin });
    return obs;
}

function createFooterObserver(threshold) {
    threshold = threshold || 0.4;
    var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            if (typeof window.startTypewriter === 'function') window.startTypewriter();
            obs.disconnect();
        }
    }, { threshold: threshold });
    return obs;
}
