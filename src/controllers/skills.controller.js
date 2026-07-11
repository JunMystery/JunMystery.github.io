/**
 * Skills controller — tab filter functionality
 */

import { $$ } from '../utils/dom.js';

export function initSkillsTabs() {
    const tabs = $$('.skills-tab-btn');
    const groups = $$('.skill-group');

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            groups.forEach(group => {
                const category = group.getAttribute('data-category');
                group.style.display = (filter === 'all' || category === filter) ? '' : 'none';
            });
        });
    });
}
