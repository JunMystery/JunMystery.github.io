/**
 * script.js
 * Interactive logic for portfolio site
 */

document.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check saved theme or system preference
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
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // Skills Interactive Tab Filtering
    const tabBtns = document.querySelectorAll('.skills-tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all btns
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked btn
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Print CV Modal Controls
    const printBtn = document.getElementById('btn-print');
    const printBtnNav = document.getElementById('btn-print-nav');
    const printOverlay = document.getElementById('print-overlay');
    const printClose = document.getElementById('print-close');
    const printTrigger = document.getElementById('print-trigger');

    function openPrintView() {
        printOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closePrintView() {
        printOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (printBtn) printBtn.addEventListener('click', openPrintView);
    if (printBtnNav) printBtnNav.addEventListener('click', openPrintView);
    if (printClose) printClose.addEventListener('click', closePrintView);
    
    if (printTrigger) {
        printTrigger.addEventListener('click', () => {
            window.print();
        });
    }

    // Close on overlay click
    if (printOverlay) {
        printOverlay.addEventListener('click', (e) => {
            if (e.target === printOverlay) {
                closePrintView();
            }
        });
    }
});
