/**
 * app.js — Application bootstrap
 * Initializes all MVC controllers on DOMContentLoaded
 */

import { initTheme } from './controllers/theme.controller.js';
import { initNav } from './controllers/nav.controller.js';
import { initSkillsTabs } from './controllers/skills.controller.js';
import { initFooter } from './controllers/footer.controller.js';
import { initReveal } from './controllers/scroll.controller.js';
import { $, $$ } from './utils/dom.js';
import { triggerPrint } from './services/print.service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize controllers
    initTheme();
    initNav();
    initSkillsTabs();
    initFooter();
    initReveal();

    // Print buttons
    const printBtns = ['#btn-print', '#btn-print-nav'];
    printBtns.forEach(sel => {
        const btn = $(sel);
        if (btn) btn.addEventListener('click', triggerPrint);
    });
});
