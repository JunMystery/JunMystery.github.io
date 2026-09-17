/**
 * print.js — Simple print trigger for the CV page
 */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('[data-action="print"]');
    if (btn) {
        btn.addEventListener('click', () => window.print());
    }
});
