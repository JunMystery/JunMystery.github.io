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

    var banterCount = 0;
    var banterDone = false;

    toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        if (icon) icon.className = getToggleIconClass(next);

        banterCount++;
        if (typeof showVimBar === 'function' && !banterDone) {
            var banterMsg = getBanterMsg(next, banterCount);
            console.log('%c ' + banterMsg, 'color: #8b949e; font-style: italic');
            showVimBar(banterMsg);
            if (banterCount >= 10) banterDone = true;
        }
    });
}

function getBanterMsg(theme, count) {
    if (count === 10) { return '> OK you win, I\'ll stop counting.'; }
    if (count >= 3)   { return '> Make up your mind!'; }
    if (theme === 'light') return '> Light mode activated. Hope you have sunglasses.';
    return '> Dark mode restored. Your eyes thank you.';
}
