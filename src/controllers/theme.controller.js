/**
 * Theme controller — handles dark/light toggle and persistence
 */

import { $ } from '../utils/dom.js';
import { getPreferredTheme, applyTheme, getToggleIconClass, getStoredTheme } from '../services/theme.service.js';

export function initTheme() {
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
