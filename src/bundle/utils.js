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
    NAV_LINKS: '.nav-link',
    TAB_BTNS: '.skills-tab-btn',
    SKILL_GROUPS: '.skill-group',
    FOOTER: '.footer'
};

var TIMING = {
    TYPEWRITER_CHAR: 14,
    TYPEWRITER_LINE_PAUSE: 160,
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

function getToggleIconClass(theme) {
    return theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
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
