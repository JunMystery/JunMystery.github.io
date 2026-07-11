// ============================================================
// controllers/theme.js — Dark/Light theme toggle
// Depends on: $, SELECTORS (utils.js)
// ============================================================

function initTheme() {
    var toggle = $(SELECTORS.THEME_TOGGLE);
    if (!toggle) return;

    var icon = toggle.querySelector('i');
    var saved = getStoredTheme();
    var theme = saved || getPreferredTheme();
    applyTheme(theme);
    if (icon) icon.className = getToggleIconClass(theme);

    toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        if (icon) icon.className = getToggleIconClass(next);
    });
}
