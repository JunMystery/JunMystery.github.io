// ============================================================
// utils.js — DOM helpers, constants, theme & scroll services
// ============================================================

/* DOM helpers */
var $ = function (sel, ctx) { ctx = ctx || document; return ctx.querySelector(sel); };
var $$ = function (sel, ctx) { ctx = ctx || document; return [].slice.call(ctx.querySelectorAll(sel)); };


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
    times: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
};

function setIcon(el, name) {
    if (el) el.innerHTML = ICON_PATHS[name] || '';
}

/* Universal Tab & Filter Switcher */
function setupTabs(config) {
    var buttons = typeof config.buttons === 'string' ? $$(config.buttons) : (config.buttons || []);
    var panels = typeof config.panels === 'string' ? $$(config.panels) : (config.panels || []);
    var buttonAttr = config.buttonAttr || 'data-tab';
    var panelAttr = config.panelAttr || 'data-panel';
    var activeClass = config.activeClass || 'active';

    if (!buttons.length) return;

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute(buttonAttr);

            buttons.forEach(function (b) {
                b.classList.toggle(activeClass, b === btn);
            });

            if (panels.length) {
                if (config.filterMode) {
                    panels.forEach(function (p) {
                        var cat = p.getAttribute(panelAttr);
                        p.classList.toggle('hidden', targetId !== 'all' && cat !== targetId);
                    });
                } else {
                    panels.forEach(function (p) {
                        var id = p.getAttribute(panelAttr);
                        p.classList.toggle(activeClass, id === targetId);
                    });
                }
            }

            if (typeof config.onSwitch === 'function') {
                config.onSwitch(targetId, btn, panels);
            }
        });
    });
}
