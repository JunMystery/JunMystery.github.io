/**
 * Theme service — get/set theme preference
 */

const STORAGE_KEY = 'theme';

export function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
}

export function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
}

export function getPreferredTheme() {
    const stored = getStoredTheme();
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    setStoredTheme(theme);
}

export function getToggleIconClass(theme) {
    return theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
