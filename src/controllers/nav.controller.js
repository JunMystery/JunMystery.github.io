/**
 * Nav controller — mobile toggle, smooth scroll, close menu on link click
 */

import { $, $$ } from '../utils/dom.js';

export function initNav() {
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    const links = $$('.nav-link');

    if (toggle && menu) {
        // Mobile toggle
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = menu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        // Close on link click + smooth scroll without URL hash
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

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }
}
