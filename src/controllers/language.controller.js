import { i18n } from '../services/i18n.service.js';

function applyLocale() {
  const locale = i18n.locale;
  if (!locale) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = i18n.t(key);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    el.innerHTML = i18n.t(key);
  });

  const label = document.getElementById('lang-label');
  if (label) label.textContent = i18n.t('lang.name');

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === i18n.currentLang);
  });

  document.documentElement.lang = i18n.currentLang === 'vi' ? 'vi' : 'en';
}

function bindSwitcher() {
  const toggle = document.getElementById('lang-toggle');
  const menu = document.getElementById('lang-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });

    document.addEventListener('click', () => menu.classList.remove('open'));
  }

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      if (lang === i18n.currentLang) {
        menu?.classList.remove('open');
        return;
      }

      i18n.load(lang);
      applyLocale();
      menu?.classList.remove('open');
    });
  });
}

export function initLanguage() {
  const lang = i18n.detect();
  i18n.load(lang);
  applyLocale();
  bindSwitcher();
}
