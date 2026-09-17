// ============================================================
// i18n-service.js — Internationalization service (ES5)
// Depends on: LOCALE_EN, LOCALE_VI (loaded before this)
// ============================================================

var STORAGE_KEY_LANG = 'lang';

var I18nService = function () {
    this.locale = null;
    this.cache = { en: LOCALE_EN, vi: LOCALE_VI };
};

I18nService.prototype.detect = function () {
    var fromStorage = localStorage.getItem(STORAGE_KEY_LANG);
    if (fromStorage) return fromStorage;

    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl) return fromUrl;

    var browser = (navigator.language || '').slice(0, 2);
    if (browser === 'vi') return 'vi';

    return 'en';
};

I18nService.prototype.load = function (lang) {
    this.locale = this.cache[lang] || this.cache.en;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    return this.locale;
};

// Flat key lookup — locale keys are dotted strings like "nav.about"
I18nService.prototype.t = function (key) {
    if (!this.locale) return key;
    return typeof this.locale[key] === 'string' ? this.locale[key] : key;
};

Object.defineProperty(I18nService.prototype, 'currentLang', {
    get: function () { return localStorage.getItem(STORAGE_KEY_LANG) || 'en'; }
});

var i18n = new I18nService();
