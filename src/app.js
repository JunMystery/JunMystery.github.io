/**
 * app.js — Application bootstrap
 * Initializes all MVC controllers on DOMContentLoaded
 */

import { initTheme } from './controllers/theme.controller.js';
import { initNav } from './controllers/nav.controller.js';
import { initSkillsTabs } from './controllers/skills.controller.js';
import { initFooter } from './controllers/footer.controller.js';
import { initReveal } from './controllers/scroll.controller.js';
import { initLanguage } from './controllers/language.controller.js';

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initSkillsTabs();
    initFooter();
    initReveal();
    initLanguage();
});
