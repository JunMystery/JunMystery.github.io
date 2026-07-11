// ============================================================
// controllers/language.js — Language switcher & locale application
// Depends on: i18n, $, $$ (i18n-service.js, utils.js)
// ============================================================

function applyLocale() {
    var locale = i18n.locale;
    if (!locale) return;

    [].slice.call(document.querySelectorAll('[data-i18n]')).forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = i18n.t(key);
    });

    [].slice.call(document.querySelectorAll('[data-i18n-html]')).forEach(function (el) {
        var key = el.getAttribute('data-i18n-html');
        el.innerHTML = i18n.t(key);
    });

    var label = document.getElementById('lang-label');
    if (label) label.textContent = i18n.t('lang.name');

    [].slice.call(document.querySelectorAll('.lang-option')).forEach(function (opt) {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === i18n.currentLang);
    });

    document.documentElement.lang = i18n.currentLang === 'vi' ? 'vi' : 'en';
}

function bindSwitcher() {
    var toggle = document.getElementById('lang-toggle');
    var menu = document.getElementById('lang-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        document.addEventListener('click', function () { menu.classList.remove('open'); });
    }

    [].slice.call(document.querySelectorAll('.lang-option')).forEach(function (opt) {
        opt.addEventListener('click', function () {
            var lang = opt.getAttribute('data-lang');
            if (lang === i18n.currentLang) {
                if (menu) menu.classList.remove('open');
                return;
            }

            i18n.load(lang);
            applyLocale();
            if (menu) menu.classList.remove('open');
        });
    });
}

function initLanguage() {
    var lang = i18n.detect();
    i18n.load(lang);
    applyLocale();
    bindSwitcher();
}
